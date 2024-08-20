import React, { useState, useEffect, useCallback  } from "react";
import { db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const GamePurchase = ({ gamePrice, receiverAddress, onPurchaseComplete, walletAddress }) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [isDownloadReady, setIsDownloadReady] = useState(false);

  const checkPreviousPurchase = useCallback(async () => {
    if (walletAddress) {
      try {
        const purchasesRef = collection(db, 'purchases');
        const q = query(purchasesRef, where("walletAddress", "==", walletAddress.toLowerCase()));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setIsDownloadReady(true);
          onPurchaseComplete(); // Notify parent component
        }
      } catch (error) {
        console.error("Error checking previous purchase:", error);
      }
    }
  }, [walletAddress, onPurchaseComplete]);

  useEffect(() => {
    checkPreviousPurchase();
  }, [checkPreviousPurchase]);

  

  const purchaseGame = async () => {
    setErrorMessage("");
    setIsPurchasing(true);
    setTransactionHash("");
    setIsDownloadReady(false);

    try {
      let provider;
      if (typeof window.ethereum !== "undefined") {
        provider = window.ethereum;
      } else {
        throw new Error("No compatible wallet found. Please install MetaMask.");
      }

      await provider.request({ method: "eth_requestAccounts" });
      const accounts = await provider.request({ method: "eth_accounts" });
      const account = accounts[0];

      // Check if connected to Polygon network
      const chainId = await provider.request({ method: "eth_chainId" });
      if (chainId !== "0x89") {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x89" }],
        });
      }

      // Prepare transaction
      const transactionParameters = {
        to: receiverAddress,
        from: account,
        value: "0x" + (gamePrice * 1e18).toString(16),
        chainId: "0x89",
      };

      // Send transaction
      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      setTransactionHash(txHash);
      console.log("Transaction sent:", txHash);

      // Wait for transaction confirmation
      const receipt = await waitForTransaction(provider, txHash);
      if (receipt.status === "0x1") {
        console.log("Transaction successful");
        await addPurchaseToFirebase(account, txHash);
        setIsDownloadReady(true);
        onPurchaseComplete();
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error purchasing game:", error);
      setErrorMessage(error.message || "Failed to purchase game. Please try again.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const waitForTransaction = (provider, txHash) => {
    return new Promise((resolve, reject) => {
      const checkTransaction = async () => {
        try {
          const receipt = await provider.request({
            method: "eth_getTransactionReceipt",
            params: [txHash],
          });
          if (receipt) {
            resolve(receipt);
          } else {
            setTimeout(checkTransaction, 1000); // Check again after 1 second
          }
        } catch (error) {
          reject(error);
        }
      };
      checkTransaction();
    });
  };

  const addPurchaseToFirebase = async (walletAddress, transactionHash) => {
    try {
      const docRef = await addDoc(collection(db, 'purchases'), {
        walletAddress: walletAddress.toLowerCase(), // Store in lowercase for consistency
        transactionHash,
        timestamp: new Date()
      });
      console.log("Purchase recorded with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding purchase to Firebase: ", e);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob(
      ["Thank you for purchasing BlazeFury! Your download will start soon."],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = "BlazeFury_download_info.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div>
      {!isDownloadReady ? (
        <button
          onClick={purchaseGame}
          disabled={isPurchasing}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full inline-flex items-center text-lg"
        >
          {isPurchasing ? "Processing..." : `Purchase Game (${gamePrice} MATIC)`}
        </button>
      ) : (
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full inline-flex items-center text-lg"
        >
          Download Now
        </button>
      )}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default GamePurchase;
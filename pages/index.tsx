import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronRight,
  Zap,
  Shield,
  Coins,
  MessageCircle,
  Send,
} from "lucide-react";
import WalletConnection from "../components/WalletConnection";
import TokenomicsChart, {
  data as tokenomicsData,
  COLORS,
} from "../components/TokenomicsChart";
import GamePurchase from "../components/GamePurchase";

const LandingPage = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isGamePurchased, setIsGamePurchased] = useState(false);

  const handleWalletConnection = useCallback((address) => {
    setIsWalletConnected(address !== null);
    setWalletAddress(address || "");
  }, []);

  const handlePurchaseComplete = useCallback(() => {
    setIsGamePurchased(true);
  }, []);

  useEffect(() => {
    const purchasedState = localStorage.getItem('isGamePurchased');
    if (purchasedState === 'true') {
      setIsGamePurchased(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isGamePurchased', isGamePurchased.toString());
  }, [isGamePurchased]);

  

  const developers = [
    {
      name: "Apuroop Telukutla",
      designation: "Founder",
    },
    {
      name: "Mayur Kollipara",
      designation: "Game and Blockchain Developer",
    },
  ];


  

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 py-4 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-purple-500">BlazeFury</div>
          <div className="flex items-center space-x-4">
            <WalletConnection
              isConnected={isWalletConnected}
              onConnected={handleWalletConnection}
              walletAddress={walletAddress}
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-bold mb-4">
          Welcome to <span className="text-purple-500">BlazeFury</span>
        </h1>
        <p className="text-2xl mb-8">
          Ignite Your Gaming Experience on the Polygon Network
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://discord.gg/yourlink"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full inline-flex items-center text-lg"
          >
            <MessageCircle className="mr-2" />
            Join Discord
          </a>
          <a
            href="https://t.me/yourlink"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full inline-flex items-center text-lg"
          >
            <Send className="mr-2" />
            Join Telegram
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Enter the{" "}
            <span className="text-purple-500">BlazeFury Universe</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-16 h-16 text-purple-500" />}
              title="High-Stakes Gameplay"
              description="Experience heart-pounding action with real MATIC rewards at stake."
            />
            <FeatureCard
              icon={<Shield className="w-16 h-16 text-purple-500" />}
              title="True Ownership"
              description="Own and trade unique in-game assets as NFTs on the Polygon blockchain."
            />
            <FeatureCard
              icon={<Coins className="w-16 h-16 text-purple-500" />}
              title="Play-to-Earn"
              description="Turn your gaming skills into real-world value with our P2E mechanics on Polygon."
            />
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center">Tokenomics</h2>
        <div className="flex flex-col items-center">
          <div className="w-full max-w-3xl mb-12">
            <TokenomicsChart />
          </div>
          <div className="w-full max-w-2xl">
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-purple-600">
                <tr>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {tokenomicsData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="py-3 px-4 flex items-center">
                      <span
                        className="w-4 h-4 rounded-full mr-3"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></span>
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-right">{item.value}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Meet Our <span className="text-purple-500">Developers</span>
          </h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
              {developers.map((dev, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-6 rounded-lg text-center transform transition duration-500 hover:scale-105"
                >
                  <h3 className="text-xl font-bold mb-2">{dev.name}</h3>
                  <p className="text-purple-400 text-sm">{dev.designation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Game Purchase Section */}
    <section className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-4xl font-bold mb-4">Ready to Join the BlazeFury Universe?</h2>
      <p className="text-xl mb-8">
        {isGamePurchased
          ? "Thank you for your purchase! You can now download the game."
          : "Purchase the game now and start your adventure!"}
      </p>
      <GamePurchase
        gamePrice={0.1}
        receiverAddress="0x8fA9418ac26123438096Ec6B2D7eb2496B7c231C"
        onPurchaseComplete={handlePurchaseComplete}
        walletAddress={walletAddress}
      />
    </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; 2024 BlazeFury. All rights reserved. Powered by Polygon
            (Matic).
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-700 p-8 rounded-lg text-center transform transition duration-500 hover:scale-105">
      <div className="flex justify-center mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default LandingPage;

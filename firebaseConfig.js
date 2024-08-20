import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAGfr9Grb-hTH8yKrS19XhPPy5-nKnPXl4",
  authDomain: "blazefury-79071.firebaseapp.com",
  projectId: "blazefury-79071",
  storageBucket: "blazefury-79071.appspot.com",
  messagingSenderId: "449672708466",
  appId: "1:449672708466:web:6d0bc2b34515cc22c3ddeb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
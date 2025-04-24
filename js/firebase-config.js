// Import Firebase app and Firestore from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCno_NoYBRMQM6rgxgEMrH1Ssq38av4-VM",
  authDomain: "beango-b1a75.firebaseapp.com",
  projectId: "beango-b1a75",
  storageBucket: "beango-b1a75.firebasestorage.app",
  messagingSenderId: "147201367488",
  appId: "1:147201367488:web:569245befce82acef23c25",
  measurementId: "G-5Q6FPPTDB7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
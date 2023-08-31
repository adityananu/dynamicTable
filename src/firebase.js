import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCtHY5vazMVrCb-adD4wUU3BagTxrYbOv4",
  authDomain: "dynamic-table-b080b.firebaseapp.com",
  databaseURL: "https://dynamic-table-b080b-default-rtdb.firebaseio.com",
  projectId: "dynamic-table-b080b",
  storageBucket: "dynamic-table-b080b.appspot.com",
  messagingSenderId: "108135496059",
  appId: "1:108135496059:web:3e9b41e543750e200a25de"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
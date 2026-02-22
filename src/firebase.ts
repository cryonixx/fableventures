// Firebase configuration and initialization
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiCyjOjA6E0dyoxRBTKAN9bcELkq9iHT0",
  authDomain: "fableventures.firebaseapp.com",
  projectId: "fableventures",
  storageBucket: "fableventures.firebasestorage.app",
  messagingSenderId: "677608824314",
  appId: "1:677608824314:web:de9b07a9901e6c1ea29843",
  measurementId: "G-8GSHKVQK5T",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);

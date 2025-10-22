// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALltRAx82WI8sSLkchwQL7gL6apQru7Kg",
  authDomain: "hunar-a76b7.firebaseapp.com",
  projectId: "hunar-a76b7",
  storageBucket: "hunar-a76b7.firebasestorage.app",
  messagingSenderId: "527742479003",
  appId: "1:527742479003:web:e81555d664537c3703f43e",
  measurementId: "G-WGLQY5ZLR8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const analytics = getAnalytics(app);

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  VARIANTS: 'variants',
  ORDERS: 'orders',
  ADDRESSES: 'addresses',
  WISHLIST: 'wishlist',
  COUPONS: 'coupons',
  HOMEPAGE_SLOTS: 'homepageSlots',
} as const;

export default app;

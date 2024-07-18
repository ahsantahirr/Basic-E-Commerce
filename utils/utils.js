import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signOut,signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, doc, setDoc,getDoc,collection,addDoc,  getDocs, query, where,deleteDoc} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL  } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";
const firebaseConfig = {
    apiKey: "AIzaSyAcdqV8iMZAOz4BQGwlGNGCyGGFVHxMVZA",
    authDomain: "user-authentication-f3353.firebaseapp.com",
    projectId: "user-authentication-f3353",
    storageBucket: "user-authentication-f3353.appspot.com",
    messagingSenderId: "1026852027315",
    appId: "1:1026852027315:web:226fb21f1c5a9256b829c6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)



export {
    auth,
    db,
    storage,
    onAuthStateChanged,
    doc, 
    setDoc,
    ref, 
    uploadBytes,
    getDownloadURL,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword ,
    signOut,
    getDoc,
    collection,
    addDoc,
    getDocs,
    query, 
    where,
    deleteDoc,
}
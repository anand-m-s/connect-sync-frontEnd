import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB07BRcjXcZ5iNiu-Ag2_1GlmTRH5IRynk",
    authDomain: "connect-sync-6a666.firebaseapp.com",
    projectId: "connect-sync-6a666",
    storageBucket: "connect-sync-6a666.appspot.com",
    messagingSenderId: "754598655394",
    appId: "1:754598655394:web:bf463a20d7dc5f41a22efb",
    measurementId: "G-CDQWSZJ3KF"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {  db};


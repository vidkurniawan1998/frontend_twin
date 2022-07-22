import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

var firebaseConfig = {
    apiKey: "AIzaSyC0wCEBwxQQjoRmXsjoG7d4IA5SJNrDP4M",
    authDomain: "surga-ff69c.firebaseapp.com",
    databaseURL: "https://surga-ff69c.firebaseio.com",
    projectId: "surga-ff69c",
    storageBucket: "surga-ff69c.appspot.com",
    messagingSenderId: "249295982640",
    appId: "1:249295982640:web:e25553fbe7e9dcec0e9df5",
    measurementId: "G-YSZJPNQCJ9"
};

var surgaApp = firebase.initializeApp(firebaseConfig, "surga");

const firestore = surgaApp.firestore();
const auth = surgaApp.auth();

export { firestore, auth };
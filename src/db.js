import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

var firebaseConfig = {
    apiKey: "AIzaSyDDErIjrpzd-8zE34C-nck9Ni2wM-N2Lk8",
    authDomain: "sales-b072f.firebaseapp.com",
    databaseURL: "https://sales-b072f.firebaseio.com",
    projectId: "sales-b072f",
    storageBucket: "sales-b072f.appspot.com",
    messagingSenderId: "59847690844",
    appId: "1:59847690844:web:f69ceb3a0d06b7fc9e3499",
    measurementId: "G-9LVGVQD4NN"
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const auth = firebase.auth();

export { firestore, auth };
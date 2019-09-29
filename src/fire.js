import * as firebase from "firebase";
import "firebase/firestore";
var config = {
  apiKey: "AIzaSyD09tB_WCf7ZT_crDupzYa4mkbKXB2DSxw",
  authDomain: "player-auction.firebaseapp.com",
  databaseURL: "https://player-auction.firebaseio.com",
  projectId: "player-auction",
  storageBucket: "player-auction.appspot.com",
  messagingSenderId: "505226413842",
  appId: "1:505226413842:web:39f8f912c713df7fac95cb"
};
var fire = firebase.initializeApp(config);
export default fire;

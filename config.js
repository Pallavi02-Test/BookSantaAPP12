import firebase from 'firebase';

require('@firebase/firestore');

var firebaseConfig = {
  apiKey: "AIzaSyCO4pIsVWOX8PzJY1mjctZ557RHS-2I120",
  authDomain: "booksantaapp-3e4a9.firebaseapp.com",
  databaseURL: "https://booksantaapp-3e4a9-default-rtdb.firebaseio.com",
  projectId: "booksantaapp-3e4a9",
  storageBucket: "booksantaapp-3e4a9.appspot.com",
  messagingSenderId: "429560450776",
  appId: "1:429560450776:web:9bfe75e75ec2a27ebe91ad"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

 export default firebase.firestore();
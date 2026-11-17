// =========================================
// FIREBASE
// =========================================

// Importa o Firebase
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


// Importa o Firestore
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// =========================================
// CONFIGURAÇÃO DO FIREBASE
// =========================================
//
// SUBSTITUA os valores abaixo pelos valores
// fornecidos pelo seu projeto Firebase.
//

const firebaseConfig = {

    apiKey: "AIzaSyCWtz-PHR56EUpX0H9BGuH_iZrGhjDoBVo",

    authDomain:
        "futebolhub-94b4e.firebaseapp.com",

    projectId:
        "futebolhub-94b4e",

    storageBucket:
        "futebolhub-94b4e.firebasestorage.app",

    messagingSenderId:
        "244832457882",

    appId:
        "1:244832457882:web:0c3cc6186ec60e24c43b23",
        
    measurementId: "G-N52T8LS017"
};


// =========================================
// INICIALIZAÇÃO
// =========================================

const app =
    initializeApp(firebaseConfig);


// Cria conexão com Firestore
const db =
    getFirestore(app);


// Exporta o banco para o script.js
export {
    db
};
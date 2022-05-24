const SHA256 = require("crypto-js/sha256");
class Block {
    //Constructor de bloque
    constructor(index, timestamp, data, precedingHash = " ") {

        this.index = index;
        this.timestamp = timestamp; // Fecha
        this.data = data; // Datos del bloque
        this.precedingHash = precedingHash; // Hash del bloque anterior
        this.hash = this.computeHash(); // Hash del bloque
        this.nonce = 0;
    }

    // Función que obtiene el nuevo hash del bloque
    computeHash() {

        return SHA256(this.index +
            this.precedingHash +
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonce).toString();

    }

    // Función de prueba de trabajo
    proofOfWork(difficulty) {
        // Comprueba que cumple con la dificultad de la cadena. El hash debe contener al inicio el número de 0s definidos en difficulty
        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
        ) {
            this.nonce++;
            this.hash = this.computeHash();

        }
    }
}

class Blockchain {
    //Constructor de blockchain
    constructor() {
        this.blockchain = [this.startGenesisBlock()];
        this.difficulty = 4;
    }

    // Función que obtiene el primer bloque de la cadena
    startGenesisBlock() {
        return new Block(0, "01/01/2020", "Bloque inicial", "0");
    }

    // Función que obtiene el ultimo bloque de la cadena
    obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }

    // Función que crea un nuevo bloque en la cadena
    addNewBlock(newBlock) {

        newBlock.precedingHash = this.obtainLatestBlock().hash; // Obtenemos el hash del bloque anterior 
        newBlock.proofOfWork(this.difficulty); // Realizamos la prueba de trabajo
        this.blockchain.push(newBlock) // Añadimos el bloque a la cadena

    }

    // Función que comprueba que la cadena es valida. Comprueba los hash de todos los bloques y sus anteriores.
    checkChainValidity() {
        // Recorre toda la cadena
        for (let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const precedingBlock = this.blockchain[i - 1];
            // Comprueba que el hash que tiene el bloque es el mismo que el calculo del hash del bloque.
            // Es decir comprueba que no se ha realizado ningun cambio en los datos del bloque.
            if (currentBlock.hash !== currentBlock.computeHash()) {
                return false;
            }
            // Comprueba que el hash del bloque anterior es correcto.
            if (currentBlock.precedingHash !== precedingBlock.hash) return false;
        }
        return true;
    }
}

// EJEMPLO

// Creación de una blockchain
let newBlockchain = new Blockchain();

// Creación de bloques
newBlockchain.addNewBlock(
    new Block(1, "24/05/2022", {
        sender: "User1",
        recipient: "User2",
        quantity: 50
    }));

newBlockchain.addNewBlock(
    new Block(2, "24/05/2022", {
        sender: "User3",
        recipient: "User4",
        quantity: 30
    }));


// Visualización de la cadena
console.log(JSON.stringify(newBlockchain, null, 4));

// Verificación de si nuestra cadena es válida
console.log(newBlockchain.checkChainValidity())
const {ObjectID} = require('mongodb')

class Heroi {
    // extraimos somente o necessario para criar
    // um heroi
    constructor({ id, nome, idade, poder}) {
        // caso o id venha preenchido, convertemos para
        // o formato do banco de dados, caso nao venha,
        // mantemos o padrão
        this._id = id ? ObjectID(id) : id
        this.nome = nome
        this.idade = idade
        this.poder = poder
    }   
}
// exportamos a classe para o MUNDO
module.exports = Heroi
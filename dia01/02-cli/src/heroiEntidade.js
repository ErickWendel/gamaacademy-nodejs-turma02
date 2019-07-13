class Heroi {
    // extraimos somente o necessario para criar
    // um heroi
    constructor({ id, nome, idade, poder}) {
        this.id = id
        this.nome = nome
        this.idade = idade
        this.poder = poder
    }   
}
// exportamos a classe para o MUNDO
module.exports = Heroi
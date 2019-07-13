// 10.10.0.165
// vamos instalar o modulo do mongodb
// npm install mongodb 
/*
 WINDOWS
-> RoboMongo, Studio 3T -> Interface para MongoDB

-> c:/Arquivos de Programa/MongoDB/Server/4.0/bin

-> Apertar Windows + Pause

-> C:/
    -> c:/data/db 

1o terminal -> mongod 
2o terminal -> mongo 


para listar bancos de dados
show dbs 
// alteramos o contexto para o banco selecionado
// se não existir, quando inserir um novo dado 
// ele criará automaticamente
use nomeDoBanco
use admin -> banco default com varias colections
use caracteres 

// para listar coleções (tabelas)
show collections 

para inserir um novo item

db.nomeDaColecao.insert({
    nome: 'teste',
    idade: 123
})
db.nomeDaColecao.find()
db.nomeDaColecao.find({ nome: 'teste' })

for(i =0; i < 1000; i++) {
    db.nomeDaColecao.insert({ nome: 'teste' + i})
}
db.nomeDaColecao.find()


*/
const {
    MongoClient
} = require('mongodb')

class HeroiDB {
    constructor() {
        this.heroiCollection = {}
    }

    async connect() {
        // para conectar com o mongodb local
        // localhost:27017/dbName
        const mongodbString = 'mongodb://localhost:27017/heroi'
        const mongoclient = new MongoClient(mongodbString, { useNewUrlParser: true })
        const connection = await mongoclient.connect()
        const heroiCollection = await connection
                                        .db('caracteres')
                                        .collection('heroi')
        // adicionamos o heroi para a instancia 
        // da classe  
        this.heroiCollection = heroiCollection
        
    }

    async cadastrar(heroi) {
        return this.heroiCollection.insertOne(heroi)
    }
    async listar(filtro) {
        return this.heroiCollection.find(filtro).toArray()
    }
    async remover(id) {
        return this.heroiCollection.deleteOne({ _id: id })
    }
    async atualizar(idHeroi, heroiAtualizado) {
        // o primeiro parametro é o filtro
        // o segundo o que substituira o arquivo
        // se esquecer de mandar o operador VAI PERDER O DADO
        // $set: dado -> ESQUECEU O SET -> VAI PERDER
        return this.heroiCollection.update({
            _id: idHeroi
        }, {
            $set: heroiAtualizado
        })
    }
}
// exportamos o modulo
module.exports = HeroiDB

// LEMBRAR DE COMENTAR
// async function main() {
//     const heroi = new HeroiDB()
//     const { heroiCollection } = await heroi.connect()
//     await heroiCollection.insertOne({
//         nome: 'Flash',
//         poder: 'Velocidade',
//         idade: 20
//     })
//     const items = await heroiCollection.find().toArray()
//     console.log('items', items)

// }
// main()
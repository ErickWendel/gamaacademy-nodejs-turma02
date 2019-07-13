/*
  A galera do C# implementou uma funcionalidade onde não precisamos mais usar .then e .catch
  
  Nosso codigo javascript fica exatamente igual
  a aplicações JAVA, Python, C# 
  -> O mesmo codigo que é lido, a ordem será executa 
*/
const { promisify } = require('util')

// convertemos a função obterTelefone
const obterTelefoneAsync = promisify(obterTelefone)

function buscarClientes(id) {
    // para simular uma função assincrona, usamos o setTimeout
    // retornamos um objeto Promise
    // para resolver depois
    return new Promise(function (resolve, reject) {
        setTimeout(function () {

            return resolve({
                id: id,
                nome: 'Xuxa da silva',
                idade: 70
            })
        }, 2000)
    })
    
}

function buscarEndereco(idCliente) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            return resolve({
                id: 1,
                rua: 'dos bobos',
                numero: 0
            }) 
        }, 2000);

    })
}

function obterTelefone(idCliente, callback) {
    setTimeout(() => {
        return callback(null, {
            id: 0,
            ddd: 11, 
            numero: '4002-8900'
        })
    }, 3000);
}


// para usar o await precisa do async
// -> quando usamos o async, automaticamente
// a função passa a retornar um objeto Promise
async function main(){
    try {
    console.time('async-01')
        // para sinalizar o codigo Javascript
    // para esperar a execução terminar
    // usamos a palavra chave await
    const clientes = await buscarClientes('xuxa')
    // Como o endereco e o telefone não depende um do outro, podemos executa-los em segundo plano. 
    // temos uma função chamada .all que resolve um array de promises, quando terminado, obtemos o resultado de todas de uma vez
    const telefonePromise = obterTelefoneAsync(clientes.id)
    const enderecoPromise = buscarEndereco(clientes.id)

    // retorna um array na ordem exata das funcoes 
    const [telefone, endereco] = 
        await Promise.all([
            telefonePromise,
            enderecoPromise
        ])
    /*
    respostas[0] 
        dadostelefone
    repostas[1]
        dadosEndereco
    */

    // const {rua, numero} = await buscarEndereco(clientes.id)
    // const telefone = await obterTelefoneAsync(clientes.id)
    console.timeEnd('async-01')

    console.log(`
     Nome: ${clientes.nome},
     Endereco: ${endereco.rua}, ${endereco.numero},
     Telefone: (${telefone.ddd}) ${telefone.numero}
    `)
    
    }
    catch(erro) {
        console.error('DEU RUIM', erro)
    }
    

}
main()

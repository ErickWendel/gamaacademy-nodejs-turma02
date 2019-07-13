/*
 Nosso objetivo é seguir os seguintes passos:

 1. Buscar cliente
 2. Buscar endereco
 3. Buscar telefone

 // NomeCliente, Endereco, Telefone

 para rodar uma app 
 node nomeArquivo.js
 ou no VSCode - F5

 Para sincronizar aplicações trabalhamos com uma convenção chamada CALLBACK (Atedente com o Ticket do fastfood)

 callbacks tem como objetivo, passar um função e executar apos o agendamento 
 callbacks -> geralmente recebem no minimo 2 params
 1o erro -> qualquer problema
 2o sucesso -> o resultado esperado
*/

function buscarClientes(id, callback) {
    // para simular uma função assincrona, usamos o setTimeout
    setTimeout(function () {
        return callback(null, {
            id: id,
            nome: 'Xuxa da silva',
            idade: 70
        })
    }, 2000)
}

function buscarEndereco(idCliente, callback) {
    setTimeout(function () {
        return callback(null, {
            id: 1,
            rua: 'dos bobos',
            numero: 0
        }) 
    }, 2000);
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

function main() {
    buscarClientes('xuxa', function (erro, sucesso) {
        // undefined, 0, '', {},  null, []
        // -> FALSE
        if(erro) {
            console.error('DEU RUIM', erro)
            return;
        }
        buscarEndereco(sucesso.id, function (erro1, sucesso1) {
            if(erro1) {
                console.error('DEU RUIM', erro1)
                return;
            }
            obterTelefone(sucesso.id, function (erro2, sucesso2) {
                if(erro2) {
                    console.error('DEU RUIM', erro2)
                    return;
                }
                // para imprimir variaveis dinaminamente, sem concatenar strings
                console.log(
                    `
                    Nome: ${sucesso.nome}
                    Endereco: ${sucesso1.rua} ${sucesso1.numero}
                    Telefone: (${sucesso2.ddd}) ${sucesso2.numero}
                    `
                )

            })
        })
    })
    // const endereco = buscarEndereco(cliente.id)

    // console.log(
    //     cliente.id, 
    //     endereco.rua 
    // )
}
main()

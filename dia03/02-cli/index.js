// para instalar pacotes externos usamos a ferramenta NPM (Node Package Manager) ou YARN (foi criado pelo FB para ser mais performatico)

// para iniciar um projeto node.js, precisamos de um arquivo que define os pacotes. Quando outra pessoa precisar acessar o seu codigo, este arquivo lhe ensina como instalar ou quais versoes sao suportadas. 
// para iniciar um projeto 
// npm init 
// -> -y => não precisa de wizard 

//para trabalhar com programas de linha de comando usaremos o Comander
// npm install commander
// --save (No PASSO)
// --save-dev -> Ferramentas como transpiladores, testes, ferramentas para diminuir o tamho do arquivo 
// importamos o heroi
const Heroi = require('./src/heroiEntidade')
// importamos o commander
// instalar o Path Intelisense no Code
const HeroiDbArquivo = require('./src/heroiDbArquivo')

const Commander = require('commander')
const commander = Commander
                    .version('v1.0')
                    .option('-n, --nome [value]', 'O nome do Heroi')
                    .option('-i, --idade [value]', 'A idade do Heroi')
                    .option('-I, --id [value]', 'O id do Heroi')
                    .option('-p, --poder [value]', 'O poder do Heroi')

                    // definimos opcoes para utilizar de acordo com a chamada do cliente
                    .option('-c, --cadastrar',
                         'deve cadastrar um Heroi')
                    
                    .option('-a, --atualizar [value]', 
                         'deve atualizar um Heroi')

                    .option('-r, --remover', 
                         'deve remover um Heroi')
                         
                    .option('-l, --listar', 
                         'deve listar Herois')
                         
                    .parse(process.argv)

async function main() {
    const dbArquivo = new HeroiDbArquivo()
    
    const heroi = new Heroi(commander)

    // node index.js --cadastrar
    // node index.js -c
    /*
    node index.js \
        --nome Flash \
        --poder Velocidade \
        --idade 80 \
        --cadastrar
    */
    if(commander.cadastrar) {
        await dbArquivo.cadastrar(heroi)
        console.log('Heroi cadastrado com sucesso!')
        return;
    }
    /**
     node index.js \
       --nome fl \
       --listar
     */
    if(commander.listar) {
        console.log('heroi', heroi)
        // no javascript atualmente usamos dois tipos de variaveis
        // -> const -> valores que nunca se alteram
        // const v1 = 0
        // v1 = 3 // erro

        // -> let -> valores que podem ser alterados
        // let v1 = 0
        // v1 = 3 // da bom
        let filtro = {}
        if(heroi.nome) {
            filtro = { nome: heroi.nome }
        }
        const herois = await dbArquivo.listar(filtro)
        console.log('herois', JSON.stringify(herois))
        return;
    }

    /*
    node index.js \
    --id 1562880485630 \
    --remover
    */
    if(commander.remover) {
        
        const id = heroi.id
        if(!id) {
            throw new Error('Voce deve passar o ID')
        }
        await dbArquivo.remover(id)
        console.log('Heroi removido com sucesso!')
        return;
    }
    /*
    node index \
     --nome Flash \
     --poder Forca \
     --id 1562884143646 \
     --atualizar
    */
    if(commander.atualizar) {
        const { id } = heroi 
        // para nao atualizar o ID, vamos remover
        delete heroi.id 
        await dbArquivo.atualizar(id, heroi)
        console.log('Heroi atualizado com sucesso!')
        return;
    }
}
main()
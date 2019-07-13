// vamos importar a biblioca padrão do Node.js
// para trabalhar com requisicoes Web
// const http = require('http')

// // http://localhost:3000/
// http.createServer((req, res) => {
//     res.end('Hello world!')
// }).listen(3000, () => 
//         console.log('server rodando'))

/*
 Vamos trabalhar com o Padrão Rest
 Rest x Restful 
 -> JSON (Javascript Schema Object Notation)
 -> Rest -> Padrão (convencao) de APIs (NAO É FRAMEWORKS)

 ACAO     | METODO  | URL
 CADASTRAR|  POST   | /v1/herois -> dados no body
 ATUALIZAR|         | /v1/herois/:id -> dados no body
            PATCH -> É usado para atualização parcial
            PUT -> É usado para substituir toda informacao original (menos)
 REMOVER  | DELETE  | /v1/herois/:id 
 LISTAR   | GET     | /v1/herois?skip=0&limit=10&nome=e
 LISTAR   | GET     | /v1/herois/:id/habilidades
 LISTAR   | GET     | /v1/herois/:id/habilidades/:id


 npm i hapi

 para evitar ficar fazendo IFs, validando na mão 
 podemos trabalhar com schemas de validação onde validamos
 o pedido primeiro antes de passar pelo nosso HANDLER
 npm i joi

 Para documentar nossa aplicação automagicamente, vamos usar 
 a lib swagger
 para usa-la precisamos seguir alguns passos
 1o adicionar o plugin ao Hapi
 2o adicionar tags (api) nas configs de rotas
 
 npm i hapi-swagger@9.1.3 inert vision


 Para não precisar ficar reiniciando o node, vamos instalar
 uma lib 
 -D ou --save-dev salva o depencia somente para desenvolvimento
 npm i -D nodemon

 vamos adicionar scripts automatizados em nosso package.json
 npx -> ele executa comandos usando a node_modules
 start: npx nodemon index.api.js
 para excutar
 npm start 
 caso o comando for qualquer outro nome
 "desenvolvimento": "ola mundo"
 npm run desenvolvimento -> usamos o RUN para comandos customi
 zados 

 para padronizar status de operação das APIs usamos o Boom
 npm i boom
*/

const Hapi = require('hapi')
// importamos o Joi para validar as requicoes 
// toda vez que for usar, adicionar na config.validate da rota
const Joi = require('joi')

// Swagger são os 3 abaixo
const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')
// boom para status HTTP
const Boom = require('boom')

const { ObjectID } = require('mongodb')

const Db = require('./src/heroiDb')

const app = new Hapi.Server({
    port: 3000
})

async function main() {
    try {
        const database = new Db()
        await database.connect()
        console.log('database conectado!')
        await app.register([
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options: {
                    documentationPath: '/v1/documentation',
                    info: {
                        title: 'API Heroes - Erick',
                        version: 'v1.0'
                    },
                    lang: 'pt'
                }
            }
        ])

        // vamos definir as rotas
        app.route([
            {
                // localhost:3000/v1/herois?nome=flash
                // http://localhost:3000/v1/herois?skip=1&limit=2
                path: '/v1/herois',
                method: 'GET',
                config: {
                    tags: [ 'api'],
                    description: 'Listar Herois',
                    notes: 'Pode filtrar por nome e paginar',
                    validate: {
                        // por padrão o hapi não mostra os erros
                        // então manipulamos a funçào para mostrar
                        failAction: (request, h, err) => {
                            throw err
                        },
                        // podemos validar
                        // headers, query, payload, e params
                        query: {
                            nome: Joi.string().max(10).min(2),
                            skip: Joi.number().default(0),
                            limit: Joi.number().max(10).default(10)
                        }
                    }
                },
                handler: async (request) => {
                    try {
                        const { query } = request 
                        const { skip, limit } = query
                        
                        // por padrão, tudo que vem da Web vem como string
                        // temos que fazer o mapeamento manual pois o mongodb 4
                        // não deixa usar mais string para esse caso
                        return database
                              .listar(query, parseInt(skip), parseInt(limit))
                    } catch (error) {
                        console.error('DEU RUim', error)
                        return Boom.internal();
                    }
                }
            },
            {
                path: '/v1/herois',
                method: 'POST',
                config: {
                    tags: [ 'api'],
                    description: 'Cadastrar Herois',
                    notes: 'Cadastra por nome, idade e poder',
                    validate: {
                        failAction: (r, h, erro) => {
                            throw erro
                        },
                        payload: {
                            nome: Joi.string()
                                      .max(10)
                                      .required(),
                            idade: Joi.number()
                                       .min(18)
                                       .required(),
                            poder: Joi.string()
                                      .max(10)
                                      .required()
                        }
                    }
                },
                handler: async (request, h) => {
                    try {
                        const { payload } = request
                        const v = await  database.cadastrar(payload)
                        // codigo correto para cadastrado (created)
                        return h.response(v).code(201)
                    } catch (error) {
                        console.error('DEU RUIM', error)
                        return Boom.internal();
                    }
                }
            },
            {
                path: '/v1/herois/{id}',
                method: 'DELETE',
                config: {
                     
                    tags: ['api'],
                    description: 'Remove Herois',
                    notes: 'Remove herois por id',
                    validate: {
                        failAction (r, h, error) {
                            throw error
                        }, 
                        params: {
                            id: Joi.string()
                                    .max(40)
                                    .required()
                        }
                    }
                },
                async handler(request) {
                    try {
                        const { id } = request.params
                        return database.remover(ObjectID(id))
                    } catch (error) {
                        console.log('DEU RUIM', error)
                        return Boom.internal();;
                    }
                }
            },
            {
                path: '/v1/herois/{id}',
                method: 'PATCH',
                config: {
                    tags: [ 'api'],
                    description: 'Atualiza herois',
                    notes: 'atualiza herois parcialmente',
                    validate: {
                        failAction (r, h, error) {
                            throw error
                        },
                        params: {
                            id: Joi.string()
                                   .max(40)
                                   .required()
                        },
                        payload: {
                            nome: Joi.string().max(20).min(2),
                            poder: Joi.string().max(10).min(2),
                            idade: Joi.number().min(18)
                        }
                    }
                },
                async handler (request) {
                    try {
                        // const { id } = request.params
                        // const { payload} = request
                        const {
                            params: {
                                id,
                            },
                            payload
                        } = request 

                        return database.atualizar(ObjectID(id), payload)
                    } catch (error) {
                        console.log('DEU RUIM', error)
                        return Boom.internal();;
                    }
                }
            }
        ])

        await app.start()
        console.log(`servidor rodando ${app.info.host}:${app.info.port}` )
    }
    catch(e) {
        console.error('DEU RUIM', e)
    }
}
main()
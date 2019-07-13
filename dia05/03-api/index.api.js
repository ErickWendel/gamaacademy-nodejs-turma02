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


 Um padrão conhecido na web para autenticar APIs Restful, é
 conhecido como JWT -> JSON Web Token

 -> Autenticacao
    -> Login 
 -> Autorizacao 
    -> Permissão de acesso

 Vamos usar o melhor computador do mundo o do CLIENTE,
  uma vez logado, fornecemos um TOKEN que o usuario usa a cada
  chamada. 
  Não usamos SESSAO ou Cookie, pois honera o servidor,
  é dificil de escalar e gasta mais memoria

  Precisamos de duas rotas
  Publica -> Login
  Privadas -> Todas as nossas APIs
  
  vamos instalar um pacote para manipular token
  -> Sign, Verify. jwt.io
  npm i jsonwebtoken 

  Para validar todos os requests baseado numa estrategia
  padrao de autenticacao, precisamos instalar o hapi jwt. 
  requests validam token primeiro e só depois chamam o handler

  npm i hapi-auth-jwt2
  -> 1o Registrar o Plugin
  -> 2o Criar a estrategia JWT (que vai refletir em todas as rotas)
  -> 3o passo, colocar auth: false nas rotas publicas

  Para gerenciar ambientes
  -> Producao
  -> Desenvolvimento
  -> Homologação 

  vamos dividir nossos ambientes
  config
    -> .env.development
    -> .env.production 
  
  npm i dotenv 
  IMPORTANTE: Só chamamos a configuração no arquivo inicial

  para usar variaveis de ambiente multi-plataforma
  instalamos o cross-env
  npm i cross-env

  criamos o banco de dados na mongodb.com 
  -> criamos o usuario Security>Database Access -> Add User
  -> liberamos o IP Security Network Access -> Add IP Address -> Allow Any IP
  
  Pegamos a conexão -> Clusters -> Connect -> Connect application e copiamos a string <user>:<senha>...
  voltamos a maquina local e testamos a conexao
  mongo stringMongoDB 
  show dbs 

  copiamos e colamos .env.dev.. e criamos o .prod
  -> substituimos a KEY do JWT por uma escolhida por nos
  -> Adicionamos a nova string do Mongo 
    -> removemos tudo que tinha de /test para frente
    -> substituimos o /teste pela nossa db /caracteres
  
  -> adicionamos no package.json o script para prod
  -> para rodar npm run prod

  npm i -g heroku
  heroku login

  heroku apps -> para listar as aplicacoes

  para subir a aplicação e gerar a URL automatica no heroku
  1o git init
  2.1 criar o arquivo Procfile
    -> Arquivo do heroku  ensinando como rodar nossa APP
    
  2o npx gitignore node -> vai criar um arquivo para ingorar arquivos comuns do node (build, node_modules, bin)
  TODA ALTERAÇÃO, que for para producao, rodar os passos abaixo (3, 4, 6)
  3o git add . 
  4o git commit -m "Versão 1"
  
  5o heroku apps:create meuNome-herois
  -> apos esse processo, o heroku vai adicionar a origin em nosso repositorio local 

  6o git push heroku master 

  heroku logs -a nomeDoApp -t 
    -> t -> Tail, qualquer alteração reflete no terminal

    O node se der problema ele QUEBRA e Não VOLTA
    Não sabemos quanto de CPU/MEMORIA/DICo a aplicação está usando e fica dificil saber se precisa escalar

    npm i pm2
    pm2 keymetrics 

    pm2 list -> lista as aplicações
    pm2 start nomeArquivo.js -i 10
    pm2 stop 0
    pm2 monit 
    pm2 logs 1 

 PM2_PUBLIC_KEY x40w1ne78b7xv6z
 PM2_SECRET_KEY f3g6i19ikwu4eu8

  heroku config:set PM2_PUBLIC_KEY=x40w1ne78b7xv6z PM2_SECRET_KEY=f3g6i19ikwu4eu8

  Podemos também usar um pacote NPM para fazer teste de carga

  npm i -g autocannon
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiY2hhcG9saW4iLCJpYXQiOjE1NjMwNDA4MzcsImV4cCI6MTU2MzA0MDg5N30.vZlZlAr_KN8xHGMgg8O20wAzciVa_0gNUlW0j8abPpo

  autocannon 'https://xuxaapi-herois.herokuapp.com/v1/herois?skip=0&limit=10' \
    --header 'Accept: application/json' --header 'authorization: MEU_ToKEN' \
    --header 'Content-Type: application/json' \
    --duration 2 \
    --concurrent 1000


    Por padrão aplicações vem fechadas, e voce define quem pode acessar a sua API

    Se alguem tentar acessar, vai cair no erro Cross Origin Resource Source (CORS), 
     routes: {
        cors: {
            origin: ['*'], // an array of origins or 'ignore'
            headers: ['Authorization'], // an array of strings - 'Access-Control-Allow-Headers' 
            exposedHeaders: ['Accept'], // an array of exposed headers - 'Access-Control-Expose-Headers',
            additionalExposedHeaders: ['Accept'], // an array of additional exposed headers
            maxAge: 60,
            credentials: true // boolean - 'Access-Control-Allow-Credentials'
        }
    }

*/
// fazemos a configuracaÇão de ambiente antes de todos 
// os pacotes, pois se algum deles precisa usar alguma dessas
// variaveis não sera afetado

const { config } = require('dotenv')

const env = process.env.NODE_ENV
config({
    path: `./config/.env.${env}`
})


const Hapi = require('hapi');
// importamos o Joi para validar as requicoes
// toda vez que for usar, adicionar na config.validate da rota
const Joi = require('joi');

// Swagger são os 3 abaixo
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');
// boom para status HTTP
const Boom = require('boom');

// jwt para manipular token
const Jwt = require('jsonwebtoken');

//hapi jwt para validar em todos os request
const HapiJwt = require('hapi-auth-jwt2');


const { ObjectID } = require('mongodb');

const Db = require('./src/heroiDb');

const app = new Hapi.Server({
  port: process.env.PORT,
  // devemos informar quem pode acessar a nossa API
  routes: {
    // outra opcao
    // cors: true,
    cors: {
      // podemos informar a lista de clientes que podem acessar
      // para liberar a todos, deixamos o *
      origin: ['*'],

    }
  }
});

const MINHA_CHAVE_SECRETA = process.env.JWT_KEY;
const USER = {
  usuario: process.env.USER_API,
  senha: process.env.SENHA_API,
};

const defaultHeader = Joi.object({
    authorization: Joi.string().required()
}).unknown()

async function main() {
  try {
    const database = new Db();
    await database.connect();
    console.log('database conectado!');
    await app.register([
      //auth  
      HapiJwt,
      //swagger
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: {
          documentationPath: '/v1/documentation',
          info: {
            title: 'API Heroes - Erick',
            version: 'v1.0',
          },
          lang: process.env.API_LANG,
        },
      },
    ]);

    // criamos uma estrategia de autenticação padrão 
    // para refletir em todas as rotas
    app.auth.strategy('jwt', 'jwt', {
        key: MINHA_CHAVE_SECRETA,
        validate: (dado, request) => {
            // poderiamos validar o usuario no banco
            // verificar se ele está com a conta em dia
            // ou mesmo se continua ativo na base
            return {
                isValid: true
            }
        }
    })
    app.auth.default('jwt')

    // vamos definir as rotas
    app.route([
      {
        // localhost:3000/v1/herois?nome=flash
        // http://localhost:3000/v1/herois?skip=1&limit=2
        path: '/v1/herois',
        method: 'GET',
        config: {
          tags: ['api'],
          description: 'Listar Herois',
          notes: 'Pode filtrar por nome e paginar',
          validate: {
            // por padrão o hapi não mostra os erros
            // então manipulamos a funçào para mostrar
            failAction: (request, h, err) => {
              throw err;
            },
            // podemos validar
            // headers, query, payload, e params
            query: {
              nome: Joi.string()
                .max(10)
                .min(2),
              skip: Joi.number().default(0),
              limit: Joi.number()
                .max(10)
                .default(10),
            },
            headers: defaultHeader
          },
        },
        handler: async request => {
          try {
            const { query } = request;
            const { skip, limit } = query;

            // por padrão, tudo que vem da Web vem como string
            // temos que fazer o mapeamento manual pois o mongodb 4
            // não deixa usar mais string para esse caso
            return database.listar(query, parseInt(skip), parseInt(limit));
          } catch (error) {
            console.error('DEU RUim', error);
            return Boom.internal();
          }
        },
      },
      {
        path: '/v1/herois',
        method: 'POST',
        config: {
          tags: ['api'],
          description: 'Cadastrar Herois',
          notes: 'Cadastra por nome, idade e poder',
          validate: {
            failAction: (r, h, erro) => {
              throw erro;
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
                .required(),
            },
            
            headers: defaultHeader
          },
        },
        handler: async (request, h) => {
          try {
            const { payload } = request;
            const v = await database.cadastrar(payload);
            // codigo correto para cadastrado (created)
            return h.response(v).code(201);
          } catch (error) {
            console.error('DEU RUIM', error);
            return Boom.internal();
          }
        },
      },
      {
        path: '/v1/herois/{id}',
        method: 'DELETE',
        config: {
          tags: ['api'],
          description: 'Remove Herois',
          notes: 'Remove herois por id',
          validate: {
            failAction(r, h, error) {
              throw error;
            },
            params: {
              id: Joi.string()
                .max(40)
                .required(),
            },
            headers: defaultHeader

          },
        },
        async handler(request) {
          try {
            const { id } = request.params;
            return database.remover(ObjectID(id));
          } catch (error) {
            console.log('DEU RUIM', error);
            return Boom.internal();
          }
        },
      },
      {
        path: '/v1/herois/{id}',
        method: 'PATCH',
        config: {
          tags: ['api'],
          description: 'Atualiza herois',
          notes: 'atualiza herois parcialmente',
          validate: {
            failAction(r, h, error) {
              throw error;
            },
            params: {
              id: Joi.string()
                .max(40)
                .required(),
            },
            payload: {
              nome: Joi.string()
                .max(20)
                .min(2),
              poder: Joi.string()
                .max(10)
                .min(2),
              idade: Joi.number().min(18),
            },
            headers: defaultHeader

          },
        },
        async handler(request) {
          try {
            // const { id } = request.params
            // const { payload} = request
            const {
              params: { id },
              payload,
            } = request;

            return database.atualizar(ObjectID(id), payload);
          } catch (error) {
            console.log('DEU RUIM', error);
            return Boom.internal();
          }
        },
      },
      {
        path: '/v1/login',
        method: 'POST',
        config: {
        // desabilitamos a autenticação no login
          auth: false,
          tags: ['api'],
          description: 'Fazer login',
          notes: 'login com user e senha',
          validate: {
            failAction(r, h, erro) {
              throw erro;
            },
            payload: {
              usuario: Joi.string()
                .max(10)
                .required(),
              senha: Joi.string()
                .min(3)
                .max(100)
                .required(),
            },
          },
        },
        async handler({ payload }) {
          try {
            const { usuario, senha } = payload;
            if (usuario !== USER.usuario || senha !== USER.senha)
              return Boom.unauthorized();

            const tokenPayload = { usuario };
            const token = Jwt.sign(tokenPayload, MINHA_CHAVE_SECRETA, {
              expiresIn: '1m',
            });
            return {
              token,
            };
          } catch (error) {
            console.error('DEU RUIM', error);
            return Boom.internal();
          }
        },
      },
    ]);

    await app.start();
    console.log(`servidor rodando ${app.info.host}:${app.info.port}`);
  } catch (e) {
    console.error('DEU RUIM', e);
  }
}
main();

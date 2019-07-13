/*
 npm init -y
 npm install request
*/
const { deepEqual } = require('assert');
// usar esta
const STARWARS_URL = 'https://swapi.co/api/people/?search=luke&format=json';
const request = require('request');

// precisamos converter de callback para promise
const { promisify } = require('util');

const obterRespostaAsync = promisify(obterResposta);

function obterResposta(url, callback) {
  // fazer o request
  request(url, function(err, res) {
    return callback(err, JSON.parse(res.body));
  });
}

function obterRespostaDoPokemon(url, callback) {
  request(url, (err, res) => {
    if (err) {
      console.error('DEU RUIM', err);
      return callback(err, null);
    }
    return callback(null, JSON.parse(res.body));
  });
}

function main() {
  const esperado = {
    gender: 'male',
    hair_color: 'blond',
    height: '172',
    homeworld: 'https://swapi.co/api/planets/1/',
    mass: '77',
    name: 'Luke Skywalker',
    skin_color: 'fair',
    // created: '2014-12-09T13:50:51.644000Z',
    // edited: '2014-12-10T13:52:43.172000Z',
    starship: {
      name: 'X-wing',
      model: 'T-65 X-wing',
    },
  };
  const resultadoComCallback = null;
  const resultadoComPromise = null;
  const resultadoComAsyncAwait = null;
  // FAZER FUNCIONAR ESTE ABAIXO
  // deepEqual(resultadoComCallback, esperado);
  // deepEqual(resultadoComPromise, esperado);
  // deepEqual(resultadoComAsyncAwait, esperado);
  obterResposta(STARWARS_URL, function(err, res) {
    const people = res.results[0];
    const starship = people.starships[0];
    obterResposta(starship, function(err1, { name, model }) {
      const atual = {
        gender: people.gender,
        hair_color: people.hair_color,
        height: people.height,
        homeworld: people.homeworld,
        mass: people.mass,
        name: people.name,
        skin_color: people.skin_color,
        // created: '2014-12-09T13:50:51.644000Z',
        // edited: '2014-12-10T13:52:43.172000Z',
        starship: {
          name,
          model,
        },
      };
      console.log('atual', atual);
      deepEqual(atual, esperado);
    });
  });

  obterRespostaAsync(STARWARS_URL)
    .then(function({ results: [people] }) {
      const {
        starships: [starship],
      } = people;
      return {
        ...people,
        starship,
      };
    })
    .then(function(people) {
      return obterRespostaAsync(people.starship).then(function({ name, model }) {
        const atual = {
          gender: people.gender,
          hair_color: people.hair_color,
          height: people.height,
          homeworld: people.homeworld,
          mass: people.mass,
          name: people.name,
          skin_color: people.skin_color,
          // created: '2014-12-09T13:50:51.644000Z',
          // edited: '2014-12-10T13:52:43.172000Z',
          starship: {
            name,
            model,
          },
        };
        console.log('atual', atual);
        deepEqual(atual, esperado);
      });
    });

    async function obterDados() {
       const {
           results: [people]
       } = await obterRespostaAsync(STARWARS_URL) 
       const { starships: [starship]} = people
       const {name, model} = await obterRespostaAsync(starship)
       const atual = {
        gender: people.gender,
        hair_color: people.hair_color,
        height: people.height,
        homeworld: people.homeworld,
        mass: people.mass,
        name: people.name,
        skin_color: people.skin_color,
        // created: '2014-12-09T13:50:51.644000Z',
        // edited: '2014-12-10T13:52:43.172000Z',
        starship: {
          name,
          model,
        },
      };
       deepEqual(atual, esperado)
    }
    obterDados()

  // const people = res.results[0]
  // const starship = people.starships[0]
  //  })
}
// usar como exemplo
function testComPokemon() {
  const esperadoPokemon = { name: 'pikachu', base_experience: 112 };
  const POKE_URL = 'https://pokeapi.co/api/v2/pokemon/pikachu';
  obterRespostaDoPokemon(POKE_URL, (err, res) => {
    console.log('name', res.name);
    deepEqual(
      { name: res.name, base_experience: res.base_experience },
      esperadoPokemon,
    );
  });
}
main();
// esse é só para testar se funciona
testComPokemon();

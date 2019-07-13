## Desafio

URL: https://swapi.co/api/people/?search=luke&format=json

### Definição

- Consumir API do swapi.co
- Obter Pessoas pelo nome
- A partir da pessoa recebida, pegar também Starship Instance
```
{
    "gender": "Male",
    "hair_color": "Blond",
    "height": "172",
    "homeworld": "https://swapi.co/api/planets/1/",
    "mass": "77",
    "name": "Luke Skywalker",
    "skin_color": "Fair",
    "created": "2014-12-09T13:50:51.644000Z",
    "edited": "2014-12-10T13:52:43.172000Z",
    "starship": {
        "name": "X-wing", 
        "model": "T-65 X-wing", 
    }
}
```

```js
/*
 npm init -y
 npm install request
*/
const { deepEqual } = require('assert');

// usar esta
const STARWARS_URL = 'https://swapi.co/api/people/?search=luke&format=json';

const request = require('request');

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
    gender: 'Male',
    hair_color: 'Blond',
    height: '172',
    homeworld: 'https://swapi.co/api/planets/1/',
    mass: '77',
    name: 'Luke Skywalker',
    skin_color: 'Fair',
    created: '2014-12-09T13:50:51.644000Z',
    edited: '2014-12-10T13:52:43.172000Z',
    starship: {
      name: 'X-wing',
      model: 'T-65 X-wing',
    },
  };
  const resultadoComCallback = null;
  const resultadoComPromise = null;
  const resultadoComAsyncAwait = null;


  // FAZER FUNCIONAR ESTE ABAIXO

  //   deepEqual(resultadoComCallback, esperado);
  //   deepEqual(resultadoComPromise, esperado);
  //   deepEqual(resultadoComAsyncAwait, esperado);
}

// usar como exemplo
function testComPokemon() {
    const esperadoPokemon = { name: 'pikachu', base_experience: 112 };
    const POKE_URL = 'https://pokeapi.co/api/v2/pokemon/pikachu'

    obterRespostaDoPokemon(POKE_URL, (err, res) => {
        deepEqual({ name : res.name,  base_experience: res.base_experience }, esperadoPokemon);
      });
}

main();
// esse é só para testar se funciona
testComPokemon();

```

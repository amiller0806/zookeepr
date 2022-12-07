const fs = require('fs');
const path = require('path');
//  This is another module built into the Node.js API that 
// provides utilities for working with file and directory paths. 
// It ultimately makes working with our file system a 
// little more predictable, especially when we work with production 
// environments such as Heroku.

const express = require('express');
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001;
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true}));
// parse incoming JSON data
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    personalityTraitsArray.forEach(trait => {
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

function createNewAnimal(body, animalsArray) {
  //  function that accepts the POST route's req.body value
  //  and the array we want to add the data to
const animal = body;
animalsArray.push(animal);
// Here, we're using the fs.writeFileSync() method, 
// which is the synchronous version of fs.writeFile() 
// and doesn't require a callback function.
fs.writeFileSync(
  path.join(__dirname, 'animals.json'),
  JSON.stringify(animalsArray, null, 2)
);
  // our function's main code will be here
  
  // return finished code to post route for response
  return animal;
}

function validateAnimal(animal) {

  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }

  if (!animal.species || typeof animal.species !=='string') {
    return false;
}

if (!animal.diet || typeof animal.diet !=='string') {
  return false;
}

if (!animal.personalityTraits || typeof animal.personalityTraits !=='string') {
  return false;
}
return true;
}
app.get('/api/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});


// Now when we receive new post data to be added to the animals.json
//  file, we'll tak Remember, the length property is always going to be one number ahead of the last index of the array so we can avoid any duplicate values.e the length property of the animals array 
// (because it's a one-to-one representation of our animals.json 
// file data) and set that as the id for the new data
app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will b
    req.body.id = animals.length.toString();


    // if any data in req.body is incorrect, send 400 error back 
    if(!validateAnimal(req.body)) { 
      // response method to relay a message to the client making the request.
      // We send them an HTTP status code and a message explaining 
      // what went wrong. Anything in the 400 range means that it's a 
      // user error and not a server error, and the message can help the 
      // user understand what went wrong on their end.
      res.status(400).send('The animal is not properly formatted.');
    } else {
          // add animal to json file and animals array 
const animal = createNewAnimal(req.body, animals);
res.json(animal);
    }
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});

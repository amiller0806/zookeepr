//  We assign express() to the app variable so 
// that we can later chain on methods to the Express.js
//  server. 

const express = require('express');
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001;
const app = express();



function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into the array and save
if (typeof(query.personalityTraits) ==='string') {
                    personalityTraitsArray = [query.personalityTraits];
                } else {
                    personalityTraitsArray= query.personalityTraits;
                }
                // Loop through each trait in the personalityTraits array:
                personalityTraitsArray.forEach(trait => {
                    // Check the trait against each animal in the filteredResults array.
                    // Remember, it's initially a copy of the animalsArray,
                    // but here we're updating it for each trait in the.forEach() loop
                    // For each trait being targeted by the filter, the filteredResults
                    // array will then contain only the entries that contain the trait,
                    // so at the end we'll have an array of animals that have every one 
                    filteredResults = filteredResults.filter(
                                    animal => animal.personalityTraits.indexOf(trait) !== -1
                    );                   
                });
                    }
    if(query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if(query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
}



// get() method requires two arguments. 
// 1st: string that describes the route the client will have
//  to fetch from
// 2nd: callback function that will execute every time that route is
//  accessed with a GET request.

app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }

    // using the send() method from the res parameter (short for response) 
    // to send the string Hello! to our client.
    res.json(results);
});

app.get('/', function(req, res) {  
    res.status(200).send("Hi, It works!")  
  });  

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);

});
// PORT: Likewise, if you have the address for a 
// college campus, you don't know exactly which 
// building or classroom to go to. 
// The port is like a building/classroom; 
// it gives the exact destination on the host.
// HOST: Address of website, The host tells the client where to go, but it doesn't specify exactly where to go. 

// We're revising the filteredResults array for each trait we loop with .forEach()
// Each iteration revises filteredResults so that it only has animals that have the indicated trait
// At the end of the .forEach() loop, we'll have a filteredResults array that only has animals that have all of the 
// traits we're targeting
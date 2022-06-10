// A route that the fron-end can request data from
const { animals } = require('./data/animals');

//Initiate the server 
const express = require('express');

const PORT = process.env.PORT || 3001;

//Telling the server to listen to requests
const app = express();

//Instead of handling the filter functionality inside the .get() callback, we break it out into its own function
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
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
    // return the filtered results:
    return filteredResults;
  }

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

//Route for animals. get() requires two arguments, the first string is the route the client fetches data
//Second is a callback function that will execute every time the route is accessed with a GET request
//Send() method for res param to send the string 'Hello!' to our client
app.get('/api/animals', (req, res) => {
    //send() method is good for short messages, to send JSON just change to JSON
    let results = animals;
    if (req.query) {
        results =filterByQuery(req.query, results);
    }
    res.json(results);
});

//The req object gives us access to another property for this case, req.params. Unlike the query object, the param object needs to be defined in the route path, with <route>/:<parameterName>.
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    res.json(result);
});

//Sends 404 error code when client searches for something with no record
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

//Port init. Heroku apps get served using port 80
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});
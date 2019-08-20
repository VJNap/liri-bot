require("dotenv").config();
var fs = require('fs');
var keys = require("./keys.js");
var axios = require('axios');
var moment = require('moment');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
// =====
var command = process.argv[2];
var userInput = process.argv[3];
for (i = 4; i < process.argv.length; i++) {
    userInput += ' ' + process.argv[i];
};
// =====
function liriMain() {
    switch (command) {
        case 'concert-this':
            concertThis();
            break;
        case 'spotify-this-song':
            spotifyThis();
            break;
        case 'movie-this':
            movieThis();
            break;
        case 'do-what-it-says':
            doIt();
            break;
        default:
            console.log('Please choose a valid command');
    }
};

function concertThis() {
    var bandQuery = 'https://rest.bandsintown.com/artists/' + userInput + '/events?app_id=codingbootcamp'
    axios.get(bandQuery).then(function (res) {
        var i;
        for (i = 0; i < 5; i++) {
            console.log('Venue: ' + res.data[i].venue.name);
            console.log('Location: ' + res.data[i].venue.city + ', ' + res.data[i].venue.region);
            console.log('Date: ' + res.data[i].datetime.slice(0,10));
            console.log('===================================')            
        };
    });
};
function spotifyThis() {
    if (!userInput) {
        userInput = 'The Sign'
    };
    spotify.search({ type: 'track', query: userInput }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var i;
        for (i = 0; i < 5; i++) {
            console.log('Artist(s): ' + data.tracks.items[i].artists[0].name);
            console.log('Song Title: ' + data.tracks.items[i].name);
            console.log('Spotify URL: ' + data.tracks.items[i].external_urls.spotify);
            console.log('Album: ' + data.tracks.items[i].album.name);
            console.log('===================================')
        };
    });
};
function movieThis() {
    if (!userInput) {
        userInput = 'Mr. Nobody'
    };
    var movieQuery = 'http://www.omdbapi.com/?apikey=trilogy&t=' + userInput
    axios.get(movieQuery).then(function (res) {
        console.log('Title: ' + res.data.Title);
        console.log('Year: ' + res.data.Year);
        console.log('IMDB: ' + res.data.imdbRating);
        console.log(res.data.Ratings[1].Source + ': ' + res.data.Ratings[1].Value);
        console.log('Country: ' + res.data.Country);
        console.log('Language: ' + res.data.Language);
        console.log('Plot: ' + res.data.Plot);
        console.log('Cast: ' + res.data.Actors);
    });
};
function doIt() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            throw err
        }
        var dataArray = data.split(',');
        console.log(dataArray);
        command = dataArray[0];
        userInput = dataArray[1];
        liriMain();
    }
    )
};

liriMain();
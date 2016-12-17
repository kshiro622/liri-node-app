// NPM packages
var fs = require('fs');
var Twitter = require('twitter');
var request = require('request');
var spotify = require('spotify');
var keys = require('./keys.js');


// Store inputs from command line
var command = process.argv[2];
var mediaName = process.argv.slice(3);
mediaName = mediaName.join(' ');

// Twitter constructor function
var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});

// OMDB Query URLs
var omdbQueryUrl = 'http://www.omdbapi.com/?t=' + mediaName + '&y=&plot=short&tomatoes=true&r=json';
var undefinedUrl = 'http://www.omdbapi.com/?t=Mr. Nobody&y=&plot=short&tomatoes=true&r=json';

// call run function
run(command, mediaName);

// run function
function run(command, mediaName) {

    // ** ------ Twitter API ------ ** //
    if (command === 'my-tweets') {
        var params = {
            screen_name: 'kshiro5',
            count: 20
        };
        client.get('statuses/user_timeline', function(error, tweets, response) {
            if (!error) {
                for (var i = 0; i < tweets.length; i++) {
                    console.log('-------------------------------------------------');
                    console.log('Created at: ' + tweets[i].created_at + '\nTweet: ' + tweets[i].text);
                    console.log('-------------------------------------------------');
                }
            } else if (error) {
                console.log('-------------------------------------------------');
                console.log(error);
                console.log('-------------------------------------------------');
            }
        });

        // *** ------ Spotify API ------ *** //
    } else if (command === 'spotify-this-song') {
        if (mediaName.length > 0) {
            // Display data for first result of song searched
            spotify.search({ type: 'track', query: mediaName }, function(err, data) {
                if (err) {
                    console.log('-------------------------------------------------');
                    console.log('Error occurred: ' + err);
                    console.log('-------------------------------------------------');
                    return;
                }
                console.log('-------------------------------------------------');
                console.log('Artist: ' + data.tracks.items[0].artists[0].name + '\nSong Name: ' + data.tracks.items[0].name + '\nPreview Link: ' + data.tracks.items[0].preview_url + '\nAlbum: ' + data.tracks.items[0].album.name);
                console.log('-------------------------------------------------');
            });
        } else {
            // If no song is entered, display data for "The Sign" by Ace of Base
            spotify.search({ type: 'track', query: 'ace of base' }, function(err, data) {
                if (err) {
                    console.log('-------------------------------------------------');
                    console.log('Error occurred: ' + err);
                    console.log('-------------------------------------------------');
                    return;
                }
                console.log('-------------------------------------------------');
                console.log('Displaying data for "The Sign" by Ace of Base');
                console.log('Artist: ' + data.tracks.items[1].artists[0].name + '\nSong Name: ' + data.tracks.items[1].name + '\nPreview Link: ' + data.tracks.items[1].preview_url + '\nAlbum: ' + data.tracks.items[1].album.name);
                console.log('-------------------------------------------------');
            });
        }

        // ** ------ OMDB API ------ ** //
    } else if (command === 'movie-this') {
        if (mediaName.length > 0) {
            request(omdbQueryUrl, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('-------------------------------------------------');
                    console.log("Title: " + JSON.parse(body)["Title"] + "\nRelease Year: " + JSON.parse(body)["Year"] + "\nIMDB Rating: " + JSON.parse(body)["imdbRating"] + "\nCountry: " + JSON.parse(body)["Country"] + "\nLanguage: " + JSON.parse(body)["Language"] + "\nPlot: " + JSON.parse(body)["Plot"] + "\nActors: " + JSON.parse(body)["Actors"] + "\nRotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"] + "\nRotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
                    console.log('-------------------------------------------------');
                }
            });
        } else {
            // If no movie is entered, return info for Mr. Nobody
            mediaName = 'Mr. Nobody';
            request(undefinedUrl, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('-------------------------------------------------');
                    console.log("Title: " + JSON.parse(body)["Title"] + "\nRelease Year: " + JSON.parse(body)["Year"] + "\nIMDB Rating: " + JSON.parse(body)["imdbRating"] + "\nCountry: " + JSON.parse(body)["Country"] + "\nLanguage: " + JSON.parse(body)["Language"] + "\nPlot: " + JSON.parse(body)["Plot"] + "\nActors: " + JSON.parse(body)["Actors"] + "\nRotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"] + "\nRotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
                    console.log('-------------------------------------------------');
                }
            });
        }

        // ** ------ Do what it says ------ ** //
    } else if (command === 'do-what-it-says') {
        fs.readFile("random.txt", "utf8", function(error, data) {
            var text = data.split(',');
            var textCommand = text[0];
            var textMedia = text[1];
            run(textCommand, textMedia);
        });

        // Enter valid command //
    } else {
        console.log('-------------------------------------------------');
        console.log("Please enter a valid command.");
        console.log('-------------------------------------------------');
    }
}

/*
Author: Ben Kolb
Email: bqk124@gmail.com
Twitter: @bolbken

Last Edited: July 24, 2018

Description:  A Node.js application that exports a number of methods to stream and handle operation of the Twitter Streaming API.

TLDR: The purpose of this application is to produce twitter records that satisfy a filter.
*/

// NPM and Node.JS libraries
var Twit = require('twit');
var fs = require('fs');
const readline = require('readline');

// Local JS
var config = require('./config');
var cycle = require('./cycle-handler');

module.exports = {
    // Functions to stream and operate on the twitter events
    /*
        Progress table of the objects contents
        
        Properties::
        None

        Methods::
        InitializeTwitterStreamAPI      Tested || Simply instanciates the twitter api and twitter stream classes
        Listen4Tweets                   Tested || Listens for tweet event emitter, pulls some properties of the tweet and passes to callback
        ValidateTweet                   Tested || Checks the if the tweet 1) has correct properties & 2) json confirms the system isn't currently running.  Passes validated flag and newTweetObj to callback.
        WriteNewTweet2JSON              Tested || Takes tweet object and writes it to the cycle-data.json, writes running = 1
        TestTwitterConnection           Not Started || Validatates Wifi, Twitter API, and stream will operate.  Supplies error information otherwise.
        run                             Ready for testing || Executes some of the other methods to wrap the functionality of twitter.js
        
    */
    InitializeTwitterStreamAPI: function(twitConfig, streamFilter, callback) {
        var twitterConnected = false;
        
        // Instantiate Twit and pass config from params
        var TwitterAPI = new Twit(twitConfig);
        var avidVaderStream = TwitterAPI.stream('statuses/filter', { track: streamFilter });
        console.log('Created Twitter Streaming API data channel using filter: "' + streamFilter + '"');

        // Listen for stream to be connected
        avidVaderStream.on('connected', function (response) {
            twitterConnected = true;
        })

        callback(TwitterAPI, avidVaderStream, twitterConnected);
    },

    Listen4Tweets: function(twit_obj, stream_obj, callback) {
        
        stream_obj.on('tweet', function (tweet) {
            // Initialize tweetObj and clear out properties
            var tweetObj = {
                timestamp: null,
                name: null,
                id: 0,
                text: null
            };

            // Print new tweet data to console and set to tweetObj
            console.log('****** New Tweet ******');
            console.log('Time Stamp: ' + tweet.created_at);
            tweetObj.timestamp = tweet.created_at;
            console.log('Twitter User: ' + tweet.user.name);
            tweetObj.name = tweet.user.name;
            console.log('New Tweet ID: ' + tweet.id);
            tweetObj.id = tweet.id;
            console.log('Text Body: ' + tweet.text);
            tweetObj.text = tweet.text;
            
            callback(tweetObj)
        });

        //Added ability to simulate a tweet
        // Create the interface connection
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Initialize a simulated tweet object
        var simTweetObj = {
            "timestamp": null,
            "name": "simulation",
            "id": 4,
            "text": "Simulated tweet."
        };

        // Listen for input event on command line
        rl.on('line', (input) => {
            if(input == 'simTweet') {
                simTweetObj.timestamp = +new Date;

                callback(simTweetObj);
            }
        });


    },

    ValidateTweet: function(newTweetObj, callback) {
        // Purpose:
        // 1) Confirm newTweetObj has all the properties its supposed to have [timestamp, name, id, text]
        // 2) Confirm jsonFilePath has running = 0;
        // Callback with tweetValid bool, tweetObj

        // Assume the tweet isn't valid
        var tweetValid = false;

        // Test 1:  Validate all properties required are defined, rollup any issues
        var tweetPropErrorRollup = 0;

        if(!(newTweetObj.timestamp)){
            tweetPropErrorRollup = tweetPropErrorRollup + 1;
        }
        if(!(newTweetObj.name)){
            tweetPropErrorRollup = tweetPropErrorRollup + 1;
        }
        if(!(newTweetObj.id)){
            tweetPropErrorRollup = tweetPropErrorRollup + 1;
        }
        if(!(newTweetObj.text)){
            tweetPropErrorRollup = tweetPropErrorRollup + 1;
        }
        if(tweetPropErrorRollup > 0) {
            tweetValid = false;
            console.log('Tweet Validation: Properites not valid.  tweetValid = ', tweetValid);
        }
        else{

            //Test 2: Confirm JSON file has running = 0;

            cycle.RunState((runStateBool) => {
                if(runStateBool === true) {
                    console.log('Current Tweet Halted.  Vader is running.')
                    tweetValid = false;
                } else if(runStateBool === false) {
                    console.log('Current Tweet Validated.  Permitting run.');
                    tweetValid = true;
                    callback(tweetValid, newTweetObj);

                } else {
                    console.log('Current Tweet Halted. Error in run state.');
                    tweetValid === false;
                }
            });

        }

    },

    WriteNewTweet2JSON: function(newTweetObj, callback) {
       console.log(newTweetObj);
       
        // Read in the cycleData json file
        cycle.ReadCycleData((cycleDataObj) => {
            // Write tweet to cycleData json

            console.log(cycleDataObj);
            cycleDataObj.tweet.timestamp = newTweetObj.timestamp;
            cycleDataObj.tweet.id = newTweetObj.id;
            cycleDataObj.tweet.userName = newTweetObj.name;
            cycleDataObj.tweet.text = newTweetObj.text;

            // Write running into the payload.running property of the json file
            cycleDataObj.payload.running = 1;

            cycle.WriteCycleData(cycleDataObj,() => {

                callback(cycleDataObj);
            });
        });
    },

    TestTwitterConnection: function(callback) {
        //TBD
    }, 

    run: function(twit_obj, stream_obj, callback) {
        this.Listen4Tweets(twitterAPIObj, streamObj, (twitterObj) => {

            this.ValidateTweet(twitterObj, (tweetValidBool, tweetObj) => {
    
                if(tweetValidBool === true) {
    
                    this.WriteNewTweet2JSON(tweetObj, ()=> {
    
                        callback(tweetObj);
                    });
                }
            });
        });
    }
}

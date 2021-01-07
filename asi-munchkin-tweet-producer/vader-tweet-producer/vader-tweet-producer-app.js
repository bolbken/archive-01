/*
Author: Ben Kolb
Email: bqk124@gmail.com
Twitter: @bolbken

Last Edited: May 2, 2018

Description:  A Node.js application that sends MQTT messages when a twitter post satisfies the config.twitter.filter condition.
The twitter data is piped into the application using the Twitter API and the separate Streaming API.  The twitter data is then packaged into
a JSON object and turned into a string.  The string is sent to a AWS MQTT message broker that is connect to AWS IOT.  The application logs
all messages that land on the MQTT topic.

TLDR: The purpose of this application is to produce twitter records that satisfy a filter to an AWS MQTT topic.
*/

// NPM Requires
var Twit = require('twit');
var awsIot = require('aws-iot-device-sdk');

// Locally available requires
var config = require('./config');

// Initialize complex objects for TwitterAPI, Twitter Stream API, and AWS IOT
var TwitterAPI = new Twit(config.twitter);
var avidVaderStream = TwitterAPI.stream('statuses/filter', { track: config.twitter.filter });
console.log('Created Twitter Streaming API data channel using filter: "' + config.twitter.filter + '"');
var vaderIot = awsIot.device(config.iotThing.vader);

// Initialize streamState object.  Object will be printed to AWS IOT MQTT message broker
var streamState = {
    currentTweet: {
        tweetTime: 'null',
        tweetID: 'null',
        tweetUser: 'null',
        tweetText: 'null'
    },
    vaderListening: false,
    vaderActive: false
}

// Initialize connection with AWS IOT vader thing
vaderIot.on('connect', function() {
    console.log('Connected to AWS IOT');
    vaderIot.subscribe(config.iotThing.vader.topic);
    console.log('Subscribed to AWS MQTT topic: ' + config.iotThing.vader.topic);
});

// Log of all messages that are recieved in MQTT subscriptions
vaderIot.on('message', function(topic, payload) {
    console.log('Subscription message from AWS MQTT:: Topic= ', topic);
    console.log('Message Payload= ', JSON.parse(payload));
});

// When a tweet is found:  Log to the console, save to streamState object, publish streamState object to AWS IOT MQTT topic
avidVaderStream.on('tweet', function (tweet) {
    console.log('****** New Tweet ******');
    console.log('Time Stamp: ' + tweet.created_at);
    streamState.currentTweet.tweetTime = tweet.created_at;
    console.log('Twitter User: ' + tweet.user.name);
    streamState.currentTweet.tweetUser = tweet.user.name;
    console.log('New Tweet ID: ' + tweet.id);
    streamState.currentTweet.tweetID = tweet.id;
    console.log('Text Body: ' + tweet.text);
    streamState.currentTweet.tweetText = tweet.text;
    console.log('Updated streamState object.');

    // Publish streamState object to the AWS IOT MQTT topic
    vaderIot.publish(config.iotThing.vader.topic, JSON.stringify(streamState));
    console.log('Published streamState object to MQTT Topic: ' + config.iotThing.vader.topic);
});

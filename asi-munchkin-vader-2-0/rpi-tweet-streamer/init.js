/*
Author: Ben Kolb
Email: bqk124@gmail.com
Twitter: @bolbken

Last Edited: July 23, 2018

Description:  A Node.js initialization application. Order of operation:
  1) Include libraries and set constants
  2) Test wifi connection
  3) Test connection with mos
  4) Test connection with twitter/ start API stream
  5) Save startup log to sqlite
  6) Call app.js to start the application
  
TLDR: The purpose of this application is to initiate app on system startup.

*/

// Library inclusions and other constants to initilize the system
const config = require('./config');
const twitter = require('./twitter');
const mosComms = require('./comms');
const app = require('./app');

// Exit code for start up failure
exitCode = 1;

// Initialize Start-up validation object for recording to sqlite
var startupValidation = {
  "timestamp": null,
  "wifiConnection": false,
  "twitterAPIConnection": false,
  "mosConnection": false
};



// Execute the Initialization Steps

Startup((startupTimestamp) => {

  startupValidation.timestamp = startupTimestamp;

  TestInternetConnection((wifiConnected) => {

    startupValidation.wifiConnection = wifiConnected;
  
    TestMosCommsConnection((mosConnected) => {

      startupValidation.mosConnection = mosConnected;
  
      StartTwitterAPI((twitterAPIObj, streamObj, twitterConnected) => {

        startupValidation.twitterAPIConnection = twitterConnected;

        if(startupValidation.wifiConnection === true && startupValidation.mosConnection === true && startupValidation.twitterAPIConnection === true) {
        
          console.log('Start-Up Complete. Start-Up Validation: PASS');
          app.run(twitterAPIObj, streamObj);
        
        } else {
          console.log('Start-Up Complete. Start-Up Validation: FAIL');
          console.log('Wifi Connection: ', startupValidation.wifiConnection);
          console.log('Mos Connection: ', startupValidation.mosConnection);
          console.log('Twitter Connection: ', startupValidation.twitterAPIConnection);
          
          console.log('Aborting Application with Exit Code', exitCode);
          process.exit(exitCode);
        }
      });
    });
  });
});


// Startup message and pass the current timestamp
function Startup(callback) {
  var startTimestamp = Date.now();
  console.log('----------Starting Munchkin Vader App----------');
  console.log('Start-Up Timestamp: ', startTimestamp);

  callback(startTimestamp);
}

function TestInternetConnection(callback) {
  require('dns').lookup('google.com',function(err) {
      if (err && err.code == "ENOTFOUND") {
          callback(false);
      } else {
          callback(true);
      }
  })
}

function TestMosCommsConnection(callback) {
  mosComms.TestComms((mosCommState) => {
    
    callback(mosCommState)
  })
}

function StartTwitterAPI(callback) {
  twitter.InitializeTwitterStreamAPI(config.twitter,config.twitter.filter,(twitterAPIObj, streamObj, twitterConnected) => {

    callback(twitterAPIObj, streamObj, twitterConnected);
  })
}
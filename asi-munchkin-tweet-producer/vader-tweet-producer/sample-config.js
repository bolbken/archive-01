/*
Author: Ben Kolb
Twitter: @bolbken
github: @bolbken

Last Edited: May 2, 2018

Description:  A sample config file to support vader-tweet-producer-app.js application.
*/

'use strict';

var config = module.exports = {
  twitter: {
    consumer_key: "PLACEHOLDER",
    consumer_secret: "PLACEHOLDER",
    access_token: "PLACEHOLDER",
    access_token_secret: "PLACEHOLDER",
    filter: '#AvidVader'
  },
  iotThing: {
    vader: {
      keyPath: 'vader-tweet-producer/PLACEHOLDER-private.pem',
      certPath: 'vader-tweet-producer/PLACEHOLDER-certificate.pem',
      caPath: 'vader-tweet-producer/PLACEHOLDER.pem',
      clientId: 'clientID_PLACEHOLDER',
      host: 'PLACEHOLDER.iot.us-east-1.amazonaws.com',
      region: 'us-east-1',
      topic: 'PLACEHOLDER'
    },
    stormtrooper: {
      keyPath: 'PLACEHOLDER-private.pem',
      certPath: 'PLACEHOLDER-certificate.pem',
      caPath: 'PLACEHOLDER.pem',
      clientId: 'clientID_stormtrooper_1',
      host: 'xxxxxxxxxxxx.iot.us-east-1.amazonaws.com',
      region: 'us-east-1',
      topic: 'PLACEHOLDER'
    } 
  }
};

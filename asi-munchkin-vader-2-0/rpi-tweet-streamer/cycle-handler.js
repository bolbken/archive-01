/*
Author: Ben Kolb
Email: bqk124@gmail.com
Twitter: @bolbken

Last Edited: October 29, 2018

Description:  A Node.js app to read and write the cycle-data.json file.

*/

// NPM and Node.JS librarys
const fs = require('fs');
const { spawn } = require('child_process');
const _ = require('lodash');

// Local JS 
const config = require('./config');
const tweetapp = require('./twitter');
let serial_msg = require('./cycle-data.json');

module.exports = {
    // Functions Reading/Writing the current status to the JSON file
    /*
        Progress table of the objects contents
        
        Properties::
        cycleDataPath:  Sets the path of the cycle-data.json file relative to this file. 
        
        Methods::
        
        **Whole File Methods**
        ReadCycleData:  Tested || Takes json file path, callback with js object
        WriteCycleData: Tested || Takes takes object to write to json, callback with writeFlag, js object
        ResetJSON:      Tested || Hard coded js obj created, calls WriteCycleData

        **Helper methods**
        RunState:       Tested || Reads json file, checks "payload.running", returns t/f
        TweetIDValue:   Tested || Reads the current tweet id in the json file, returns id value
        
    */

    // Properties
    cycleDataPath: './cycle-data.json',


    // Methods for reading or writing to the whole json file
    ReadCycleData: function(callback) {
        // Initialize json data object
        var cycleDataObj = {};

        // Read the cycle data json file to a string
        fs.readFile(this.cycleDataPath, 'utf8', function (err, json_str) {
            if (err) throw err;

            // Parst string from json file into js object
            cycleDataObj = JSON.parse(json_str);
            
            callback(cycleDataObj);
        });

    },

    WriteCycleData: function(newCycleDataObj, callback) {
        // Stringify the cycle data js object
        cycleDataJsonStr = JSON.stringify(newCycleDataObj);

        // Initialize write flag
        var write2JsonFlag = false;

        //Write the string to the file
        fs.writeFile(this.cycleDataPath, cycleDataJsonStr, (err) => {
            if (err) throw err;

            // Set the write flag boolean
            write2JsonFlag = true;

            callback(write2JsonFlag, newCycleDataObj);
        });
    },

    ResetJSON: function(callback){
        // Initialize the default JSON object
        json_dflt = {
            "payload": {
                "newTweet": 0,
                "running": 0,
                "saberSFxState": 0,
                "saberExtendConfirm": 0,
                "saberRetractConfirm": 0
            },
            
            "heartbeat": {
                "commState": 0
            },
        
            "sfx": {
                "name": null,
                "index": null
            },

            "tweet": {
                "timestamp": null,
                "id": 0,
                "username": null,
                "text": null
            }
        }; 

        // Write the JSON object to the file
        this.WriteCycleData(json_dflt,(writeFlag, cycleDataObj)=> {
            if(writeFlag == true) {
                console.log('Reset JSON file to Default.');
                callback(writeFlag, cycleDataObj);
            }
        });
    },


    // Methods to help with other js files and modules
    RunState: function(callback){
        // Initialize a run state boolean
        var runState = false;
        
        // Read the cycle data file into an object
        this.ReadCycleData((cycleDataObj) => {
            if(cycleDataObj.payload.running === 0) {
                runState = false;
            } else if(cycleDataObj.payload.running === 1) {
                runState = true;
            } else {
                runState = false;
                console.log('Run State cannot be determined. INVALID DATA: cycledata.json property payload.running = ', cycleDataObj.payload.running);
            }

            callback(runState);
        });
    }, 

    TweetIDValue: function(callback) {
        var curTweetID = 0;

        this.ReadCycleData((tweet_obj) => {
            curTweetID = tweet_obj.id;
        });

        callback(curTweetID);
    }

}
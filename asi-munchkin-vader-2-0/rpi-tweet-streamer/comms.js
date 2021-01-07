/*
Author: Ben Kolb
Email: bqk124@gmail.com
Twitter: @bolbken

Last Edited: October 29, 2018

Description:  A Node.js app to communicate with a NodeMCU over serial USB connection using the mos-tool.

TLDR: The purpose of this application is to communicate with a NodeMCU using USB serial.

*/

// Library inclusions and other constants to initilize the system
// Library
const fs = require('fs');
const { spawn } = require('child_process');
const _ = require('lodash');

// Local JS 
const config = require('./config');
const twitter = require('./twitter');
const cycle = require('./cycle-handler');

module.exports = {
  // Functions Reading/Writing the current status to the JSON file
  /*
  Progress table of the objects contents
    
    MosRPC:       Tested || Takes string of command for "mos call ___", callback takes the data and err std's
    SaberExtend:  Ready for testing || Reworked to use mos rpc, doesn't write to json obj
    SaberRetract: Ready for testing || Copy SaberExtend and edit to retract saber, doesn't write to json obj
    SaberState:   Ready for testing || Checks the saber state from mos and updates the json with status if different
    TestComms:    Ready for testing || MOS RPC calls "RPC.List" and checks if values are retruned.  With good comms writes true bit to json.heartbeat.commState

  */

  // Properties
  cycleDataPath: "./cycle-data.json",

  delayExtRet: 10000,

  // Wrapper for calling mos cli RPC functions.  Returns data and err in callback function
  MosRPC: function(mosCmd, callback) {

    var outData = null;
    var errData = null;
    
    const rpcCmd = spawn('mos', ['call', mosCmd]);

    rpcCmd.stdout.on('data', (data) => {
      outData = data;
      console.log(`MOS RPC Call: ${mosCmd} || stdout: ${outData}`);
    });

    rpcCmd.stderr.on('data', (data) => {
      errData = data;
      console.log(`MOS RPC Call: ${mosCmd} || stderr: ${errData}`);
    });

    rpcCmd.on('close', (code) => {
      console.log(`MOS RPC Call: ${mosCmd} || Exit Code: ${code}`);
      data = JSON.parse(outData);
      err = errData.toString('utf8');
      callback(data,err);
    });
  },

  SaberExtend: function(callback) {
    // Check if the saber is extended
    this.SaberState(function(mosSaberState, jsonSaberState) {
      let saberExtendPermit = false;

      // Saber is retracted
      if(mosSaberState === false) {
        console.log('Saber is Retracted: permitting saber extend.');
        saberExtendPermit = true;

        // Make the mos cli call
        this.MosRPC("SaberExtend", function(data, err) {
          if (err) throw err;
          console.log('Saber commanded to extend.');
          console.log('MOS RPC SaberExtend Returns: ' + data);
        });
      
      } else if(mosSaberState === true) {
        console.log('Saber is extended: Denying saber extend.');
        saberExtendPermit = false;
      }

      callback(saberCommandedToExtendBool);
    });
  },

  SaberState: function(saberStateCallback) {

    this.MosRPC('GetSaberState', function(statebool,err) {
      let json_data_obj = {};
      var _saberState = null;

      if(statebool === true) {
        _saberState = 1;
      } else if(statebool === false){
        _saberState = 0;
      } else {
        console.log('ERROR : GetSaberState returned a non boolean.');
      }
      
      // Ready json str to json data obj
      fs.readFile(this.cycleDataPath, 'utf8', function (err, json_str) {
        if (err) throw err;
        json_data_obj = JSON.parse(json_str);

        HandleSaberState(_saberState, json_data_obj.payload.saberNpState, function(writeFlag, newNPJsonState) {
          if(writeFlag == true) {
            fs.writeFile("./uart-data.json", json_data_obj, (err) => {
              if (err) throw err;
              console.log('SaberState written to uart-data.json');
            });

            saberStateCallback(_saberState, newNPJsonState)
          }

        });
      });          
    }); 

    // Compares and prints results, returns json new state bool and complete bool
    function HandleSaberState(mosState, jsonState, callback) {
      var compDone = false;

      if(mosState == jsonState) {
        console.log('GetSaberState and JSON saberNPstate Match as: ', mosState);
        compDone = true;
      } else if(jsonState !== mosState) {
        console.log('Saber state variables do not match.');
        console.log('GetSaberState: ', mosState, ' :: saberNPstate: ', jsonState);
        jsonState = mosState;
        console.log('Changed saberNPstate to: ', jsonState);
        compDone = true;
      }

      callback(compDone, jsonState);
    }
  },
  
  SaberRetract: function(callback){
     // Check if the saber is retracted
     this.SaberState(function(mosSaberState, jsonSaberState) {
      let saberRetractPermit = false;

      // Saber is extended
      if(mosSaberState === true) {
        console.log('Saber is Extended: permitting saber retract.');
        saberRetractPermit = true;

        // Make the mos cli call
        this.MosRPC("SaberRetract", function(data, err) {
          if (err) throw err;
          console.log('Saber commanded to Retract.');
          console.log('MOS RPC SaberRetract Returns: ' + data);
        });
      
      } else if(mosSaberState === false) {
        console.log('Saber is retracted: Denying saber retract.');
        saberRetractPermit = false;
      }

      callback(saberCommandedToretractBool);
    });

  },

  TestComms: function(callback){
    let commState = false;

    this.MosRPC('RPC.List', function(data, err) {   //Lists rpc commands available returns JSON.


      if(_.isEmpty(data) || _.isError(err)) {      //Checks if data is empty or err is present
        console.log('Failed to create Comms with MOS RPC.  Returning FALSE boolean');
        commState = false;
        
        callback(commState);
      } else { 
      console.log('Comms are successful.  Returning TRUE boolean');
        commState = true;
        
        fs.readFile('./cycle-data.json', 'utf8', function (err, json_str) {
          if (err) throw err;
          json_data_obj = JSON.parse(json_str);

          json_data_obj.heartbeat.commState = commState;
          console.log('Set cycle-data.heartbeat.commState = ' + json_data_obj.heartbeat.commState);

          fs.writeFile("./cycle-data.json", json_data_obj, (err) => {
            if (err) throw err;
            console.log('CommState written to cycle-data.json');

            callback(commState);
          });

        });
      }
    });
  },

  MosRun: function() {

    this.SaberState((saberState) => {

      if(saberState === false) {

        this.SaberExtend((saberExtendFlag) => {

          if(saberExtendFlag === true) {

            // Read json, set obj value, and Write saberExtendConfirm to 1 because the saber extended
            cycle.ReadCycleData((cycleData) => {

              cycleData.payload.saberExtendConfirm = 1;

              cycle.WriteCycleData(cycleData, () => {

                // Console log to notify the json has been modified
                // TBD
              });
            });

            // Begin a timer before commanding the saber to retract
            setTimeout(this.SaberRetract, this.delayExtRet, (saberRetractFlag) => {

              if(saberRetractFlag === true) {

                // Read json, set obj value, and Write saberRetractConfirm to 1 because the saber retracted
                cycle.ReadCycleData((cycleData) => {

                  cycleData.payload.saberRetractConfirm = 1;

                  cycle.WriteCycleData(cycleData, () => {

                    // Console log to notify the json has been modified
                    // TBD
                  });
                });

                this.SaberState((saberStateBool) => {

                  if(saberStateBool === true) {

                    // Log to console that the mos operation is complete.

                    // Callback with information ??
                  }
                });
              }
            });
          }
        });
      }
    });
  }

}

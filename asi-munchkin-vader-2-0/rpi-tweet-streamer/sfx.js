/*
Author: Ben Kolb
Email: bqk124@gmail.com
Twitter: @bolbken

Last Edited: October 26, 2018

Description:  A Node.js object full of methods that execute the playing of audio files in a folder path.

State:        Tested with RPi audio port to be working with code example below.

*/



// Local requires
const config = require('./config');
const cycle = require('./cycle-handler');

// NPM and node.js requires
const fs = require('fs');
var Sound = require('aplay');

module.exports = {

    sfxfolderpath: './vader-sfx',

    sfxCachePath: './sfx-data.json',
    
    GetSfxList: function(callback) {
        fs.readdir(this.sfxfolderpath, (err, sfxNameList) => {
            if(err) throw err;
            callback(sfxNameList);
        });
    },

    GetSfxHistory: function(sfxNameList, callback) {
        var prevSfxName = null,
            prevSfxIndex = null;
        

        this.ReadSfxData((sfxCacheobj) => {

            prevSfxName = sfxCacheobj.sfx.name;
            prevSfxIndex = sfxCacheobj.sfx.index;
            
            if(prevSfxName == null || prevSfxIndex == null ){
                prevSfxName = sfxNameList[0];
                prevSfxIndex = 0;
                
            }


            callback(prevSfxName, prevSfxIndex);
        });
    },

    GetNextSfx: function(sfxList, prevSfxName, callback) {
        var prevIndex = null;
        var nextIndex = null;
        var nextName = null;

        sfxList.forEach((name, index) => {
            if(name === prevSfxName){
                prevIndex = index;
            }
        });

        if(sfxList.length-1 <= prevIndex) {
            nextIndex = 0;
        } else {
            nextIndex = prevIndex + 1;

        }

        nextName = sfxList[nextIndex];

        callback(nextName,nextIndex);
    },

    PlaySfx: function(sfxName) {
        
        // Combine path and file name and print to console
        var filePathFull = this.sfxfolderpath + '/' + sfxName;
        console.log('Playing audio file: ', filePathFull);

        // Play the sound with the combined file path
        var soundFx = new Sound();
        soundFx.play(filePathFull);
        
        // Listen for callback to signal the sound is complete
        soundFx.on('complete', function () {
            console.log('File playback complete: ', filePathFull);
        });
    },

    WriteToSfxJson: function(sfxName, sfxIndex, callback ) {

        fs.readFile('./cycle-data.json', 'utf8', function (err, json_str) {
            if (err) throw err;
            json_data_obj = JSON.parse(json_str);

            json_data_obj.sfx.name = sfxName;
            json_data_obj.sfx.index = sfxIndex;

            write_str = JSON.stringify(json_data_obj);

            fs.writeFile("./cycle-data.json", write_str, (err) => {
                if (err) throw err;

                // Log to console the cycle data has been written to

            });
        });
    },

    CacheCurSfx: function(sfxName, sfxIndex) {
        var sfxCacheObj = {
            "sfx": {
                "name": null,
                "index": null,
            }
        };

        
        sfxCacheObj.sfx.name = sfxName;
        sfxCacheObj.sfx.index = sfxIndex;

        write_str = JSON.stringify(sfxCacheObj);

        fs.writeFile(this.sfxCachePath, write_str, (err) => {
            if (err) throw err;

            // Log to console the sfx has been cached
        });

    },

    ReadSfxData: function(callback) {
        // Initialize json data object
        var sfxCacheObj = {};

        // Read the cycle data json file to a string
        fs.readFile(this.sfxCachePath, 'utf8', function (err, json_str) {
            if (err) throw err;

            console.log(json_str)

            // Parst string from json file into js object
            sfxCacheObj = JSON.parse(json_str);
            
            callback(sfxCacheObj);
        });

    },

    run: function() {

        this.GetSfxList((sfxNameList) => {
            
            this.GetSfxHistory(sfxNameList, (prevSfxName) => {

                this.GetNextSfx(sfxNameList, prevSfxName,(sfxName, sfxIndex) => {

                    this.PlaySfx(sfxName);

                    this.WriteToSfxJson(sfxName, sfxIndex);

                    this.CacheCurSfx(sfxName, sfxIndex);
                });
            });
        });
    }
    
}

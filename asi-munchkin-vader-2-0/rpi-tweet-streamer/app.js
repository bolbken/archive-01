const config = require('./config');
const twitter = require('./twitter');
const cycle = require('./cycle-handler');

module.exports = {
    run: function(twitAPIObj, streamObj) {
        twitter.run(twitAPIObj, streamObj, (tweetObj) => {
            // sfx.run
            // mos.run {
            //  db.WriteCycle(json){
            //      cycle.ResetJSON()
            //  }
            // }

            
        })
         
    }
}
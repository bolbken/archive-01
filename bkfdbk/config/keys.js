if(process.env.NODE_ENV == "production") {
    // In production return those keys
    module.exports = require('./prod');

} else {
    // In development
    module.exports = require('./dev');
}
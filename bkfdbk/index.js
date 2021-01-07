const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");

const keys = require("./config/keys");
require("./models/User");
require("./models/Surveys");
require("./services/passport");

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());

app.use(passport.session());

require("./routes/authroutes")(app);
require("./routes/billingroutes")(app);
require("./routes/surveyRoutes")(app);

if ((process.env.NODE_ENV = "production")) {
  // Send specific files to build folder
  app.use(express.static("/client/build"));

  // Send unknown requests to html folder
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Express server started");

// const express = require('express');
// const app = express();

// app.get('/', (req, res ) => {
//     res.send({ hi: 'there' });

// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT);

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = require('./routes/api-routes.js');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3001;
const path = require('path');
const compression = require('compression');
app.use(compression());

//For cookieParser
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var prerender = require('prerender-node').set('prerenderToken', 'g2ELwUGfiTnZLyH4ovgK');
app.use(prerender);

  //Models
const models = require("./models");

app.use(router);

//Sync Database with sequelize
models.sequelize.sync({alter:true}).then(function () {
    console.log('Nice! Database looks fine');
}).catch(function (err) {
    console.log(err, "Something went wrong with the Database Update!");``
});

app.use(express.static("client/build"));

app.get('*', (_, response) => {
	response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the API server
app.listen(PORT, function () {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});

var express 	= require('express');
var app 		= express();
var http 		= require('http');

app.use(express.static('build'));

var httpServer 	= http.createServer(app);
var PORT 		= 80;


httpServer.listen(PORT, function(){
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});


// Welcome
app.get('/', function(req, res) {
    res.status(200).send('Welcome!');
});

module.export = app;

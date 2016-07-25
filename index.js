'use strict';
var app = require( 'express' )();
//var fs = require('fs');
//var cheerio = require('cheerio');
//var $ = cheerio.load(fs.readFileSync( __dirname + '/index.html', 'utf8'));
var http = require( 'http' ).Server( app );
var io = require( 'socket.io' )( http );
var MongoClient = require( 'mongodb' ).MongoClient;

app.set( 'view engine', 'ejs' );

app.get( '/', function( req, res ){
	//res.send('<h1>Hello World</h1>');
	res.render( __dirname + '/index.ejs', { 'messages' : messages} );
});

io.on( 'connection' , function( socket ){
    messages = [];
    bindMessage();
	socket.on( 'disconnect', function(){
		console.log( 'user disconnected' );
	});
	
	socket.on( 'chat message', function( msg ){
		console.log( 'msg:' + msg);
		db.collection('messages').save({ 'message' : msg }, function(err, result){
			if (err) return console.log(err);
			console.log('saved to database');
		});
        messages.push( msg );
		io.emit( 'chat message', msg );
	});
});

var db;
MongoClient.connect( 'mongodb://mychat_usr:mychat_pass@ds029745.mlab.com:29745/mychat', function( err, database ){
	if (err) return console.log(err);
	db = database;
	http.listen(4000, function() {
		console.log('listening on 4000');
	});
});

var messages = [];
function bindMessage(){
	console.log( 'call ');
	db.collection( 'messages' ).find().toArray(function( err, result ){
        console.log(result);
		for( var i in result ){
            messages.push( result[ i ].message );
		}
	});
}
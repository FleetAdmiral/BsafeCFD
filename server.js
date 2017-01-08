var express = require('express');
var request = require('request');

var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded())

var db;
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://arn197:hellobyebye@ds155028.mlab.com:55028/bsafe',function(err, database){     
	if(err)         
		return console.log("Error while connecting to database");     
	db = database; 
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/heatmap.html');
})

app.get('/view',function(req,res){
  res.sendFile(__dirname + '/views/index.html');
})

app.get('/getCircle',function(req,res){
	db.collection('latlng').find().toArray(function(err,result){         
		console.log(result);         
		res.json(result);     
	});
})

app.get('/userEmails', function(req,res){
	db.collection('userdetails').find().toArray(function(err,result){         
		console.log(result);         
		res.json(result);   
	});
})

app.post('/updateLocation',function(req,res){
	console.log(req.body.id);
	db.collection('userdetails').update({id: req.body.id},{ $set: {lat: req.body.lat, lon: req.body.lon} })
})

app.post('/sendata',function(req,res){
	console.log(req.body);
	if(db.collection('userdetails').find( { id: req.body.id } ))
		console.log("Existing User");
	else{ 
		db.collection('userdetails').insert({id : req.body.id,name: req.body.name, email: req.body.email, gender: req.body.gender, approved: 0});
	}
})

app.post('/submitCircle',function(req,res){
		db.collection('latlng').insert({uid: req.body.id,lat: req.body.lat, lon: req.body.lon, rad: req.body.rad});	
})

app.get('/checkUser', function(req,res){
		db.collection('userdetails').find({id : req.param('id')}).toArray(function(err,result){         
		console.log(result);         
		var data;
		console.log(result[0].approved);
		if(result[0].approved === 0)
		{
			data = {admin : 0};
		}
		else
		{
			data = {admin : 1};
		}
		res.json(data);
	});
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

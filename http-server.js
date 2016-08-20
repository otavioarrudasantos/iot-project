var restify = require('restify');
var mongoose = require('mongoose');

var app = restify.createServer();

mongoose.connect('mongodb://localhost/sub-zero');
var Temperatura = mongoose.model('Temperatura', {serverDate: Date, date: Date, value: Number});

app.use(function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  });

app.get('/temp', function(req, res, next){
    console.log('get');
    res.header('Content-Type', 'application/json');

    Temperatura.find({}, function(err, docs){
        if(err){
            res.send(400, {'error': err});
        }else{
            res.send(200, docs);
        }
    });    
    next();
})

app.listen('8080', ()=>{console.log('8080')});
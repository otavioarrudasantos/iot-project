
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://test.mosquitto.org');
var mongoose = require('mongoose');
var restify = require('restify')

mongoose.connect('mongodb://localhost/sub-zero');
var Temperatura = mongoose.model('Temperatura', {serverDate: Date, date: Date, value: Number});

client.on('connect', function () {
  client.subscribe('iot-univem/sub-zero/temperatura');
});
 
client.on('message', function (topic, message) {
  var messageJson = JSON.parse(message.toString());
  
  var data = {
        'serverDate': (new Date()).toISOString(), 
        'value':messageJson.Temperature,
        'date': messageJson.Date
      };
  if(data.value > 30 && data.value < 31.5){
    sendSMS(data);
  }
  var temp = new Temperatura(data);

  temp.save(function(err){
    if(err){
      console.error(err);
    }else{
      console.log('Salvo:', data );
    }
  });
});

function sendSMS(data){

  var client = restify.createStringClient({
    url: 'https://smscommunity.herokuapp.com/sms/14998468949/?token_public=iot&token_secret=senha123'
  });
  
  client.post('/sms/14998574757/?token_public=iot&token_secret=senha123', {"Sorvete Derretendo":"!!", "Temperatura": data.value}, function(err, req, res, data){
    if(err){
      console.log('erro sms');
    }else{
      console.log("sms enviado");
    }
  });
}
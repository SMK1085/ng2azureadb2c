var express = require('express');
var api = require('./routes/api');

var app = express();

app.get('/api/v1/adb2c/:tenant/discovery/v2.0/keys', api.discoverykeys);
app.get('/api/v1/verifyjwtsig', api.verifytoken);

app.listen(42902, function(){
    console.log('NG2AzureADB2C API listening to port 42902.');
});
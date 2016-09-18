var request = require('request');
var jwt = require('jsonwebtoken');

exports.discoverykeys = function (req, res) {
    var url = 'https://login.microsoftonline.com/' + req.params.tenant +
        '/discovery/v2.0/keys?p=' + req.query.p;
    request(url, function (err, response, body) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(body);
        }
    });
};

exports.verifytoken = function (req, res) {
    var token = req.query.token;
    var cert = req.query.n;
    var alg = req.query.alg;

    jwt.verify(token, cert, { algorithms: [alg] }, function (err, payload) {
        if (!err) {
            res.status(500).send(err.message);
        } else {
            console.log(payload);
            res.json({ verified: true });
        }
    });
};
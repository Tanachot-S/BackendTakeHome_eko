var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    compression = require('compression');

var config = require('./config').getParam();

var lib = {
    message: require('./module/returnmessage'),
};

var app = express();
app.use(compression());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/' + config.APPPATH, express.static(__dirname + '/app'));

app.use(function (error, req, res, next) {
    //Catch json error
    if (error) {
        res.json(lib.message.error("error data"));
    } else {
        next();
    }
});

app.use(function (req, res, next) {
    res.setHeader("Access", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST,OPTION');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});

app.disable('x-powered-by');
app.set('port', process.env.PORT || config.PORT);

app.post('/' + config.APPPATH + '/', function (req, res) {
    res.json(lib.message.fail(""));
});

function catchErrorHandling(e, res) {
    console.log(e);
    if (e instanceof TypeError) {
        res.status(404);
        res.json(lib.message.error("Not found"));
    } else {
        res.status(500);
        res.json(lib.message.error(e.message));
    }
}

app.post('/' + config.APPPATH + '/public/:service/:action', function (req, res) {
    try {
        var service = require('./services/' + req.params.service + '/' + req.params.action);
        service.doProcess(req, res, lib);
    } catch (e) {
        catchErrorHandling(e, res);
    }
});

process.on('uncaughtException', function (err) {
    console.log(err.stack);
});

var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
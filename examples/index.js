/**
 * Created by charanjits on 4/7/16.
 */
var http = require('http'),
    connect = require('connect'),
    httpProxy = require('http-proxy');

var app = connect();
var proxy = httpProxy.createProxyServer();
var config = require( './config' );
app.use(require('../')(config));

app.use(
    function (req, res) {
        var url = req.url;
        var target =  'http://prinhyltphp0415:8080/';
        var host = 'prinhyltphp0415:8080';
        var nodeUrl = '/spark/node/';
        var index = url.indexOf( nodeUrl );
        var nodeId;

        if( index != -1 ) {
            nodeId = url.substr( index+nodeUrl.length, 2 );
            var nodePath = url.substring( index+nodeUrl.length + 2 );

            target = 'http://172.16.54.31:80'+nodeId ;

            proxy.web(req, res, {
                target: target,
                headers:{ host: host },
                ignorePath: true
            }, function(e) {
                console.log(e);
            });
        } else {

            target: 'http://prinhyltphp0415:8080/';


            if(url=='/spark'){
                res.writeHead(301, {Location: '/spark/'});
                res.end();
                return;
            }
            proxy.web(req, res, {
                target: target+url,
                headers:{ host: host },
                ignorePath: true
            }, function(e) {
                console.log(e);
            });
        }
    }
);
http.createServer(app).listen(8889);
console.log( 'started listening on', 8889 );
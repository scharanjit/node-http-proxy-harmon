/**
 * Created by charanjits on 4/7/16.
 */
var trumpet = require('trumpet');
var zlib = require('zlib');
var url = require( 'url' );

module.exports = function harmonBinary(settings) {
  var _htmlOnly     = (typeof settings.htmlOnly == 'undefined') ? false : settings.htmlOnly;



  function prepareResponseSelectors(req, res) {
    var tr          = trumpet();
    var _write      = res.write;
    var _end        = res.end;
    var _writeHead  = res.writeHead;
    var gunzip      = zlib.Gunzip();
    var hostName = req.headers.host;
    var reqUrl = req.url;


    res.isHtml = false;



    res.isGziped = false;

    res.writeHead = function (code, headers) {



      var location = this.getHeader('location');

      if( location ) {
        var u = url.parse(location);
        
        location = u.protocol + '//' + hostName + u.path;




        this.setHeader('location', location );  
      }

      //console.log('urrrrl', reqUrl);
      
      //console.log( 'location:', this.getHeader('Location') );
      
      var contentType = this.getHeader('content-type');

      var contentEncoding = this.getHeader('content-encoding');

      /* Sniff out the content-type header.
       * If the response is HTML, we're safe to modify it.
       */
      if (!_htmlOnly || ((typeof contentType != 'undefined') && (contentType.indexOf('text/html') == 0))) {
        res.isHtml = true;

        // Strip off the content length since it will change.
        res.removeHeader('Content-Length');

        if (headers) {
          delete headers['content-length'];
        }
      }

      /* Sniff out the content-type header.
       * If the response is Gziped, we're have to gunzip content before and ungzip content after.
       */
      if (res.isHtml && contentEncoding && contentEncoding.toLowerCase() == 'gzip') {

          res.isGziped = true;

          // Strip off the content encoding since it will change.
          res.removeHeader('Content-Encoding');

          if (headers) {
              delete headers['content-encoding'];
          }
     }

      _writeHead.apply(res, arguments);
    };

    res.write = function (data, encoding) {
      // Only run data through trumpet if we have HTML
      //console.log('res.isHtml', res.isHtml, res.isGziped);
      //console.log( 'writedata', data );
      
      if (res.isHtml) {
      
        if (res.isGziped) {
          gunzip.write(data);
        } else {
          
          tr.write(data, encoding);
        }
      } else {
        _write.apply(res, arguments);
      }
    };

    tr.on('data', function (buf) {
      

      if( settings.replaceCallBack ) {
        var str = buf.toString('utf8');
        var workerName="172.16.54.31";
        var privateIP="http://172.16.54.31:80";
        str = settings.replaceCallBack( req, str ,privateIP,workerName);
        buf = new Buffer(str);
      }
      _write.call(res, buf);


    });

    gunzip.on('data', function (buf) {
      
      tr.write(buf);
    });

    res.end = function (data, encoding) {
      if (res.isGziped) {
        gunzip.end(data);
      } else {
        tr.end(data, encoding);
      }
    };

    gunzip.on('end', function (data) {
      tr.end(data);
    });

    tr.on('end', function () {
      _end.call(res);
    });
  }


  return function harmonBinary(req, res, next) {
    
    var ignore = false;
    var lowercaseUrl = req.url.toLowerCase();
    if (settings.ignoreRegEx && settings.ignoreRegEx.test(req.url.toLowerCase())) {
      ignore = true;
    }
    if( !ignore ) {
        prepareResponseSelectors( req, res);
    }
    next();  
  };
};

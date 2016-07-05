/**
 * Created by charanjits on 4/7/16.
 */
module.exports = {
  replaceCallBack: function  ( req, str ,privateIP,workerName) {
  
    var hostName = req.headers.host;

    str = str.replace( new RegExp(privateIP, 'gi'), 'http://' + hostName +'/spark/node/' );
    
    str = str.replace( new RegExp(workerName, 'gi'), 'ID' );

    return str;
  }
};
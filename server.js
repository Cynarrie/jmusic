
var http = require('http');
var path = require('path');
var express = require('express');
var fs = require('fs');
var youtubedl = require('youtube-dl');
var router = express();
var server = http.createServer(router);

router.use(express.json());       // to support JSON-encoded bodies
router.use(express.urlencoded()); 
router.use(express.static(path.resolve(__dirname, 'client')));

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'havefundownloading';


router.get('/tube',function(req, res){
    var tb = req.query.tb;

var video = youtubedl(tb,
  // Optional arguments passed to youtube-dl.
  ['--format=18'],
  // Additional options can be given for calling `child_process.execFile()`.
  { cwd: __dirname + '/client', maxBuffer: Infinity });

// Will be called when the download starts.
var num = Math.random();
var songName = "";
video.on('info', function(info) {

  console.log('Download started');
  console.log('filename: ' + info._filename);
  console.log('size: ' + info.size);
  songName = info._filename;
  video.pipe(fs.createWriteStream(__dirname+ '/client/' +num+'.mp4'));

  
});

video.on('complete', function complete(info) {
  'use strict';
  console.log('filename: ' + info._filename + ' already downloaded.');
});

video.on('end', function() {
  var obj = {
    name:songName,
    byte:base64_encode(__dirname+ '/client/' +num+'.mp4')
  };
  res.send(obj); 
  console.log('finished downloading!');
  fs.unlinkSync(__dirname+ '/client/' +num+'.mp4');
  console.log('successfully deleted file');
});
  
});

function base64_encode(file) {
    // read binary data
    var files = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return files.toString('base64');
}


var server_port = process.env.PORT || 5000;
var server_ip_address = process.env.IP || '127.0.0.1';

server.listen(server_port, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port);
});


function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}


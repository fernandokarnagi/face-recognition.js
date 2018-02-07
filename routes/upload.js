/**
 * To test: curl -v -X POST -H "Content-Type: application/json" -d @upload.json 'http://ec2-52-221-182-171.ap-southeast-1.compute.amazonaws.com:3000/upload'
 */

var express = require('express');
var router = express.Router();

/**
 * Upload image
 */
router.post('/', function(req, res, next) {  
  var imageBase64 = req.body.image;
  var label = req.body.label;
  console.log(imageBase64);

  var id = new Date().getTime();

  const path = require('path')
  const fs = require('fs')
  const {
    fr,
    drawRects,
    getAppdataPath,
    ensureAppdataDirExists
  } = require('../cyder/commons')

  const dataPath = path.resolve('/home/ubuntu/data/faces')
  var fileName = dataPath + "/" + label + "_" + id + ".png";

  fs.writeFile(fileName, imageBase64, 'base64', function(err) {
    console.log(err);
    res.send('file is saved'); 
  });
 
});

module.exports = router;

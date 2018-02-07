/**
 * To test: curl -v -X POST -H "Content-Type: application/json" -d '{ "image": "asdf@asdf.com"}' 'http://ec2-52-221-182-171.ap-southeast-1.compute.amazonaws.com:3000/faces'
 * To test: curl -v -X POST -H "Content-Type: application/json" -d @image.json 'http://ec2-52-221-182-171.ap-southeast-1.compute.amazonaws.com:3000/faces'
 */

var express = require('express');
var router = express.Router();

/**
 * Upload image
 */
router.post('/', function(req, res, next) {  
  var imageBase64 = req.body.image;
  console.log(imageBase64);
  res.send('respond with a resource');

});

module.exports = router;

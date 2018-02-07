var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) { 
  console.log(req.body);
  var imageBase64 = req.image;
  console.log(imageBase64);
  res.send('respond with a resource');

});

module.exports = router;

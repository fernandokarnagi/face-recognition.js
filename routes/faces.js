/**
 * To test: curl -v -X POST -H "Content-Type: application/json" -d '{ "image": "asdf@asdf.com"}' 'http://face.cyder.com.sg:3000/faces'
 * To test: curl -v -X POST -H "Content-Type: application/json" -d @image.json 'http://face.cyder.com.sg:3000/faces'
 */

var express = require('express');
var router = express.Router();

/**
 * Upload image
 */
router.post('/', function(req, res, next) {  

  try {
    var imageBase64 = req.body.image;
  
    const path = require('path')
    const fs = require('fs')
    const {
      fr,
      drawRects,
      getAppdataPath,
      ensureAppdataDirExists
    } = require('../cyder/commons')
  
    var uploadPath = path.resolve('/tmp')
    var dataPath = path.resolve('/home/ubuntu/data')
    var fileName = uploadPath + "/" + new Date().getTime();
  
    fs.writeFile(fileName, imageBase64, 'base64', function(err) {
      console.log(err);
  
      fr.winKillProcessOnExit()
      ensureAppdataDirExists()
  
      var trainedModelFile = 'cyderfaceRecognitionModel.json'
      var trainedModelFilePath = path.resolve(dataPath, trainedModelFile)
  
      
      var detector = fr.FaceDetector()
      var recognizer = fr.FaceRecognizer()
  
      console.log('Use this learned model file %s, loading model', trainedModelFilePath)
  
      delete require.cache[require.resolve(trainedModelFilePath)]
      recognizer.load(require(trainedModelFilePath))
  
      console.log('imported the following descriptors:')
      console.log(recognizer.getDescriptorState())
  
      let img = fr.loadImage(fileName);
  
      // resize image if too small
      var minPxSize = 400000
      if ((img.cols * img.rows) < minPxSize) {
        img = fr.resizeImage(img, minPxSize / (img.cols * img.rows))
      }
  
      console.log('locating faces for query image');
      var faceRects = detector.locateFaces(img).map(res => res.rect);
      console.log('getting faces from locations');
      var faces = detector.getFacesFromLocations(img, faceRects, 150);
  
      // mark faces with distance > 2 as unknown
      var unknownThreshold = 2;

      var names = '';
  
      if (faces.length > 0) { 
        faceRects.forEach((rect, i) => {
          var prediction = recognizer.predictBest(faces[i], unknownThreshold) 
          console.log(rect)
          console.log(prediction)
          names = prediction.className + ',' + names
        })
        if (names.endsWith(',')) {
          names = names.substring(0, names.length - 1);
        }
        res.send(names);   
      } else {
        res.send('no match found');
      } 
    });
  } catch (e) {
    res.status(500);
    res.send(e);
  }
});

module.exports = router;

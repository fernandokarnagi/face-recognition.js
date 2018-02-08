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
  
    const uploadPath = path.resolve('/tmp')
    const dataPath = path.resolve('/home/ubuntu/data')
    var fileName = uploadPath + "/" + new Date().getTime();
  
    fs.writeFile(fileName, imageBase64, 'base64', function(err) {
      console.log(err);
  
      fr.winKillProcessOnExit()
      ensureAppdataDirExists()
  
      const trainedModelFile = 'cyderfaceRecognitionModel.json'
      const trainedModelFilePath = path.resolve(dataPath, trainedModelFile)
  
      
      const detector = fr.FaceDetector()
      const recognizer = fr.FaceRecognizer()
  
      console.log('Use this learned model file %s, loading model', trainedModelFile)
  
      recognizer.load(require(trainedModelFilePath))
  
      console.log('imported the following descriptors:')
      console.log(recognizer.getDescriptorState())
  
      let img = fr.loadImage(fileName);
  
      // resize image if too small
      const minPxSize = 400000
      if ((img.cols * img.rows) < minPxSize) {
        img = fr.resizeImage(img, minPxSize / (img.cols * img.rows))
      }
  
      console.log('locating faces for query image');
      const faceRects = detector.locateFaces(img).map(res => res.rect);
      console.log('getting faces from locations');
      const faces = detector.getFacesFromLocations(img, faceRects, 150);
  
      // mark faces with distance > 2 as unknown
      const unknownThreshold = 2;

      var names = '';
  
      if (faces.length > 0) { 
        faceRects.forEach((rect, i) => {
          const prediction = recognizer.predictBest(faces[i], unknownThreshold) 
          console.log(rect)
          console.log(prediction)
          names = prediction.className + ',' + names
        })
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

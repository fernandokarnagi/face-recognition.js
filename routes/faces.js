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

  const path = require('path')
  const fs = require('fs')
  const {
    fr,
    drawRects,
    getAppdataPath,
    ensureAppdataDirExists
  } = require('../cyder/commons')

  const dataPath = path.resolve(__dirname + '/../cyder/upload')
  var fileName = dataPath + "/" + new Date().getTime();

  fs.writeFile(fileName, imageBase64, 'base64', function(err) {
    console.log(err);

    fr.winKillProcessOnExit()
    ensureAppdataDirExists()

    const trainedModelFile = 'cyderfaceRecognitionModel.json'
    const trainedModelFilePath = path.resolve(getAppdataPath(), trainedModelFile)

    
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

    // mark faces with distance > 0.6 as unknown
    const unknownThreshold = 1;

    if (faces.length > 0) {
      const prediction = recognizer.predictBest(faces[0], unknownThreshold) 
      res.send(prediction);   
    } else {
      res.send('no match found');
    } 
  });
 
});

module.exports = router;

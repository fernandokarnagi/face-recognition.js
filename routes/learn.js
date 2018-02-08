/**
* To test: curl -v -X GET 'http://face.cyder.com.sg:3000/learn'
 */

var express = require('express');
var router = express.Router();

/**
 * Learn
 */
router.get('/', function(req, res, next) {  
  try {
    const path = require('path')
    const fs = require('fs')
    const {
      fr,
      drawRects,
      getAppdataPath,
      ensureAppdataDirExists
    } = require('../cyder/commons')
  
    fr.winKillProcessOnExit()
    ensureAppdataDirExists()
  
    const dataPath = path.resolve('/home/ubuntu/data')

    const trainedModelFile = 'cyderfaceRecognitionModel.json'
    const trainedModelFilePath = path.resolve(dataPath, trainedModelFile)
  
    
    const facesPath = path.resolve(dataPath, 'faces')
    const classNames = ['fernando', 'angela', 'lakshmi', 'allycia', 'keping', 'abigail', 'larry', 'damian', 'sherine', 'ivan', 'yin']
  
    const recognizer = fr.FaceRecognizer()
  
    console.log('start training recognizer, saving to %s ...', trainedModelFile)
    const allFiles = fs.readdirSync(facesPath)
    const imagesByClass = classNames.map(c =>
      allFiles
        .filter(f => f.includes(c))
        .map(f => path.join(facesPath, f))
        .map(fp => fr.loadImage(fp))
    )
  
    imagesByClass.forEach((faces, label) => {
      try {
        console.log("memorizing ", classNames[label], ", with these faces: ", faces);
        recognizer.addFaces(faces, classNames[label])
      } catch (e) {} 
    })
  
  
    fs.writeFileSync(trainedModelFilePath, JSON.stringify(recognizer.serialize())); 
    res.send('learned');
   
  } catch (e) {
    res.status(500);
    res.send(e);
  }
  
});

module.exports = router;

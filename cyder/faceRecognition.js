const path = require('path')
const fs = require('fs')
const {
  fr,
  drawRects,
  getAppdataPath,
  ensureAppdataDirExists
} = require('./commons')

fr.winKillProcessOnExit()
ensureAppdataDirExists()

const trainedModelFile = 'cyderfaceRecognitionModel.json'
const trainedModelFilePath = path.resolve(getAppdataPath(), trainedModelFile)

const dataPath = path.resolve('./data')

const detector = fr.FaceDetector()
const recognizer = fr.FaceRecognizer()

console.log('Use this learned model file %s, loading model', trainedModelFile)

recognizer.load(require(trainedModelFilePath))

console.log('imported the following descriptors:')
console.log(recognizer.getDescriptorState())

let img = fr.loadImage(dataPath + '/test.jpg');

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
const unknownThreshold = 0.6;
faceRects.forEach((rect, i) => {
  const prediction = recognizer.predictBest(faces[i], unknownThreshold) 
  console.log(rect)
  console.log(prediction)
})
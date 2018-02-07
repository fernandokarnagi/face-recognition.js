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
const facesPath = path.resolve(dataPath, 'faces')
const classNames = ['sheldon', 'lennard', 'raj', 'howard', 'stuart']

const detector = fr.FaceDetector()
const recognizer = fr.FaceRecognizer()

if (!fs.existsSync(trainedModelFilePath)) {
  console.log('%s not found, start training recognizer...', trainedModelFile)
  const allFiles = fs.readdirSync(facesPath)
  const imagesByClass = classNames.map(c =>
    allFiles
      .filter(f => f.includes(c))
      .map(f => path.join(facesPath, f))
      .map(fp => fr.loadImage(fp))
  )

  imagesByClass.forEach((faces, label) =>
    recognizer.addFaces(faces, classNames[label]))

  fs.writeFileSync(trainedModelFilePath, JSON.stringify(recognizer.serialize()));
}  


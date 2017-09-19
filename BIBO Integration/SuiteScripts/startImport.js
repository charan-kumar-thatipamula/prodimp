var triggerImport = require('./triggerImport')
var fs = require('fs')
var prop = require('./properties')
var options = prop.options
// {
//   uri: 'https://rest.sandbox.netsuite.com/app/site/hosting/restlet.nl?script=599&deploy=1',
//   method: 'POST',
//   headers: {
//     'Authorization': 'NLAuth nlauth_account=647267_SB2, nlauth_email=smaddela@ydesigngroup.com, nlauth_signature=n$Login123, nlauth_role=3'
//   }
// }

var sourcePath = prop.sourcePath // 'D:\\Projects\\Infologitech\\Infologitech_BIBO\\ItemImport\\StoreRoom\\TestImportFiles' // 'D:\\Projects\\Infologitech\\Storeroom\\itemfiles'
var tempPath = prop.tempPath // 'D:\\Projects\\Infologitech\\Infologitech_BIBO\\ItemImport\\StoreRoom\\Temporary'
var processedPath = prop.processedPath // 'D:\\Projects\\Infologitech\\Infologitech_BIBO\\ItemImport\\StoreRoom\\Processed'
var childFilesFolder = prop.childFilesFolder
var numFilesToMove = prop.numFilesToMove // 5
var resultsFileName = prop.resultsFileName
var fResultGlobal = {
  count: 0
}
function moveFiles(sourcePath, tempPath, cb) {
  fs.readdir(sourcePath, function (err, items) {
    if (err) {
      return console.log(err)
    }
    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath)
    }
    var resCount = 0
    for (var i = 0; i < numFilesToMove; i++) {
      if (i < items.length) {
        fs.rename(sourcePath + '\\' + items[i], tempPath + '\\' + items[i], function (err) {
          if (err) {
            console.log(err)
          }
          resCount++
          if (numFilesToMove === resCount || resCount === items.length) {
            cb()
          }
        })
      }
    }
    // fs.createReadStream(sourcePath + '\\' + ).pipe(fs.createWriteStream('newLog.log'))
  })
}
var callback = function (done) {
  if (done) {
    moveFiles(tempPath, processedPath, function () {
      // moveFiles(sourcePath, tempPath, function () {
        // triggerImport.run(tempPath, options, callback, fResultGlobal)
      // })
    })
  } else {
    moveFiles(sourcePath, tempPath, function () {
      triggerImport.run(tempPath, options, callback, fResultGlobal)
    })
    // triggerImport.run(tempPath, options, callback)
  }
  console.log('processing done')
  console.log(triggerImport.finalRes)
  console.log(new Date())
  // if (!fs.existsSync(tempPath)) {
  //   fs.mkdirSync(tempPath)
  // }

  // updateResultFile(triggerImport.finalRes)
  if (fResultGlobal.count !== 0) {
    // updateResultFile(fResultGlobal)
    // console.log(fResultGlobal)
    console.log(fResultGlobal.count)
  }
  // triggerImport.finalRes = {}
}
// callback(false)

function start() {
  console.log(new Date())
  try {
    fs.unlinkSync(processedPath + '\\' + resultsFileName)
    console.log('Deleted results files')
  } catch (e) {
    console.log(e)
  }
  try {
    var files = fs.readdirSync(tempPath)
    for (var i in files) {
      fs.unlinkSync(tempPath + '\\' + files[i])
    }
    console.log('Deleted temp files')
  } catch (e) {
    console.log(e)
  }

  // files = fs.readdirSync(sourcePath) 
  // for (var i in files) {
  //   // fs.unlinkSync(tempPath + '\\' + files[i])
  //   var readStream = fs.createReadStream(childFilesFolder + '\\' + files[i])
  //   readStream.pipe(fs.createWriteStream(sourcePath + '\\' + files[i]))
  // }
  callback(false)
}
start()
// moveFiles(sourcePath, tempPath)
// triggerImport.run(tempPath, options, callback)
// console.log('From startImport: ' + rValue)

function updateResultFile(resJson) {
  resJson = JSON.stringify(resJson)
  fs.open(processedPath + '\\' + resultsFileName, 'r', function (err, fd) {
    if (err) {
      fs.writeFile(processedPath + '\\' + resultsFileName, resJson, function (err) {
        if (err) {
          console.log(err)
        }
        console.log('The file was saved!')
      })
    } else {
      fs.appendFile(processedPath + '\\' + resultsFileName, ', ' + resJson, function (err) {
        if (err) {
          return console.log(err)
        }
        console.log('The file was saved from update!')
      })
    }
  })
}

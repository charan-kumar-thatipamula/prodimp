/*
 * Created on Thu Sep 21 2017
 *
 * Entry file for import
 *
 * Author: Shashank Maddela
 */

var triggerImport = require('./triggerImport')
var fs = require('fs')
var prop = require('./properties')
var options = prop.options

var sourcePath = prop.sourcePath
var tempPath = prop.tempPath
var processedPath = prop.processedPath
var numFilesToMove = prop.numFilesToMove
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
  })
}
var callback = function (done) {
  if (done) {
    moveFiles(tempPath, processedPath, function () {
      moveFiles(sourcePath, tempPath, function () {
        triggerImport.run(tempPath, options, callback, fResultGlobal)
      })
    })
  } else {
    moveFiles(sourcePath, tempPath, function () {
      triggerImport.run(tempPath, options, callback, fResultGlobal)
    })
  }
  console.log('processing done')
  // console.log(triggerImport.finalRes)
  var d = new Date()

  if (fResultGlobal.count !== 0) {
    console.log(fResultGlobal.count)
  }
  console.log('End Time: ' + d)
  console.log('\n************End*************\n')
}

function start() {
  console.log(new Date())
  try {
    // fs.unlinkSync(processedPath + '\\' + resultsFileName)
    // console.log('Deleted results files')
  } catch (e) {
    // console.log(e)
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

  callback(false)
}
start()

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

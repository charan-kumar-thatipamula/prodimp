/*
 * Created on Thu Sep 21 2017
 *
 * Author: Shashank Maddela
 */

var fs = require('fs')
var request = require('request')
var X2JS = require('./xml2json')
var prop = require('./properties')
var resultsPath = prop.resultsPath
var resultsFileName = prop.resultsFileName
var notProcessedSKUFileName = prop.notProcessedSKUFileName
var skus = {}
var resObj = {}
var missedSKUs = {}

module.exports = {
  run: function (path, options, callback, fResultGlobal) {
    var sufx = new Date().getTime()
    resultsFileName = prop.resultsFileName + sufx + '.txt'
    notProcessedSKUFileName = prop.notProcessedSKUFileName + sufx + '.txt'
    // console.log('resultsFileName: ' + resultsFileName)
    // console.log('notProcessSKUs: ' + notProcessedSKUFileName)
    var count = 0
    var resCount = 0
    var reqCount = 0
    var that = this
    skus = {}
    resObj = {}
    missedSKUs = {}

    fs.readdir(path, function (err, items) {
      if (err) {
        return console.log(err)
      }
      var d1 = new Date()
      console.log('\n************Start*************\n')
      console.log('Start time: ' + d1)
      var batchSize = prop.batchSize
      console.log('Files count: ' + items.length)
      for (var i = 0; i < items.length; i++) {
        console.log(items[i])
        fs.readFile(path + '\\' + items[i], 'utf8', function (errr, data) {
          if (errr) {
            return console.log(errr)
          }
          var x2js = new X2JS()
          var xmlAsJson = x2js.xml_str2json(data)
          // console.log(i + 1)
          // console.log(xmlAsJson)
          var b = xmlAsJson.Envelope.Body
          var recordArray = b.updateList ? b.updateList.record : b.addList.record
          if (!Array.isArray(recordArray)) {
            recordArray = [recordArray]
          }
          var j = 0
          while (j < recordArray.length) {
            var tempA = []
            for (var k = 0; k < batchSize && k + j < recordArray.length; k++) {
              count++
              tempA.push(recordArray[k + j])
              skus[tempA[0].itemId.__text] = items[i]
            }

            b.updateList ? (b.updateList.record = tempA) : (b.addList.record = tempA)
            j = j + k
            options.json = {
              xmlAsJson: xmlAsJson,
              isJson: true
            }
            reqCount++
            console.log('Request sent: ' + count)
            request(options, function (error, response, body) {
              if (error) {
                console.log(error)
                return
              }
              var d2 = new Date()
              if (typeof body === 'object') {
                that.updateResponse(body, fResultGlobal)
              } else {
                that.updateResponse(JSON.parse(body), fResultGlobal)
              }
              // console.log('Elapsed Time: ' + ((d2 - d1) / 1000))
              resCount++
              // console.log(resCount + ' : ' + reqCount)
              if (resCount === reqCount) {
                resCount = reqCount = 0
                for (var key in skus) {
                  if (skus.hasOwnProperty(key)) {
                    if (!resObj[key]) {
                      missedSKUs[key] = skus[key]
                    }
                  }
                }
                // resObj['itemsCount'] = count
                // for (var k = 0; k < items.length; k++) {
                //   var fK = 'file' + (k + 1)
                //   resObj[fK] = items[k]
                // }
                that.updateResultFiles()
                // console.log(JSON.stringify(missedSKUs))
                console.log('resultsFileName: ' + resultsFileName)
                console.log('notProcessSKUs: ' + notProcessedSKUFileName)
                // if (i === items.length - 1 && j >= recordArray.length) {
                callback(true)
                // }
              }
            })
          }
        })
      }
    })
  },

  updateResponse: function (res, fResultGlobal) {
    if (res.error) {
      delete res.error
    }
    var flag = false
    for (var key in res) {
      if (res.hasOwnProperty(key)) {
        // if (resObj.hasOwnProperty(key)) {
        //   console.log('\n$$$$$$$$$$$$$$$$$$$\nDuplicate Found: ' + key + '\n$$$$$$$$$$$$$$$$$$$\n')
        //   if (!resObj.hasOwnProperty('DuplicateSKUs')) {
        //     resObj['DuplicateSKUs'] = {}
        //   }
        //   if (!resObj['DuplicateSKUs'].hasOwnProperty(key)) {
        //     resObj['DuplicateSKUs'][key] = []
        //   }
        //   resObj['DuplicateSKUs'][key].push(res[key])
        // } else {
        //   resObj[key] = res[key]
        //   flag = true
        // }
        if (resObj.hasOwnProperty(key)) {
          console.log('\n$$$$$$$$$$$$$$$$$$$\nDuplicate Found: ' + key + '\n$$$$$$$$$$$$$$$$$$$\n')
        }
        resObj[key] = res[key]
        flag = true
      }
    }
    if (!flag) {
      return
    }
    res = JSON.stringify(res)
  },

  updateResultFiles: function () {
    fs.open(resultsPath + '\\' + resultsFileName, 'r', function (err, fd) {
      if (err) {
        fs.writeFileSync(resultsPath + '\\' + resultsFileName, JSON.stringify(resObj))
      } else {
        fs.appendFileSync(resultsPath + '\\' + resultsFileName, JSON.stringify(resObj))
      }
    })
    fs.open(resultsPath + '\\' + notProcessedSKUFileName, 'r', function (err, fd) {
      if (err) {
        fs.writeFileSync(resultsPath + '\\' + notProcessedSKUFileName, JSON.stringify(missedSKUs))
      } else {
        fs.appendFileSync(resultsPath + '\\' + notProcessedSKUFileName, JSON.stringify(missedSKUs))
      }
    })
  },

  count: {
    value: 0
  }
}

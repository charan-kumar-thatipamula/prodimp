var fs = require('fs')
var request = require('request')
var X2JS = require('./xml2json')
var prop = require('./properties')
var resultsPath = prop.resultsPath // 'D:\\Projects\\Infologitech\\Infologitech_BIBO\\ItemImport\\StoreRoom\\Processed'
var resultsFileName = prop.resultsFileName
var notProcessedSKUFileName = prop.notProcessedSKUFileName
var skus = {}
var resObj = {}
var missedSKUs = {}
// var opts = prop.options

module.exports = {
  run: function (path, options, callback, fResultGlobal) {
    var sufx = new Date().getTime()
    resultsFileName = resultsFileName + sufx + '.txt'
    notProcessedSKUFileName = notProcessedSKUFileName + sufx + '.txt'
    console.log('resultsFileName: ' + resultsFileName)
    console.log('notProcessSKUs: ' + notProcessedSKUFileName)
    var count = 0
    var resCount = 0
    var reqCount = 0
    var that = this
    fs.readdir(path, function (err, items) {
      if (err) {
        return console.log(err)
      }
      var d1 = new Date()
      console.log('Start time: ' + d1)
      var batchSize = prop.batchSize
      console.log('Files count: ' + items.length)
      for (var i = 0; i < items.length; i++) {
        console.log(items[i])
        this.finalRes = {}
        fs.readFile(path + '\\' + items[i], 'utf8', function (errr, data) {
          if (errr) {
            return console.log(errr)
          }
          var x2js = new X2JS()
          var xmlAsJson = x2js.xml_str2json(data)
          console.log(i + 1)
          console.log(xmlAsJson)
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
              // if (count === 1) {
              //   console.log(JSON.stringify(tempA))
              // }
            }
            if (count > 100) {

            }
            b.updateList ? (b.updateList.record = tempA) : (b.addList.record = tempA)
            // xmlAsJson.Envelope.Body.updateList.record = tempA
            // console.log('\n' + JSON.stringify(xmlAsJson.Envelope.Body.updateList.record) + '\n')
            j = j + k
            options.json = {
              xmlAsJson: xmlAsJson,
              isJson: true
            }
            reqCount++
            console.log('Request sent: ' + count)
            // this.count.value += 1
            // fResultGlobal.count += 1
            // console.log('\n Sending request: ' + JSON.stringify(options))
            request(options, function (error, response, body) {
              if (error) {
                console.log(error)
                return
              }
              var d2 = new Date()
              // console.log(typeof body)
              // console.log(typeof body)
              // console.log(body)
              if (typeof body === 'object') {
                that.updateResponse(body, fResultGlobal)
              } else {
                that.updateResponse(JSON.parse(body), fResultGlobal)
              }
              // body = null
              // response = null
              // console.log('End time: ' + d2)
              console.log('Elapsed Time: ' + ((d2 - d1) / 1000))
              console.log('Records till now: ' + count)
              resCount++
              console.log(resCount + ' : ' + reqCount)
              if (resCount === reqCount) {
                resCount = reqCount = 0
                for (var key in skus) {
                  if (skus.hasOwnProperty(key)) {
                    if (!resObj[key]) {
                      missedSKUs[key] = skus[key]
                    }
                  }
                }
                console.log(JSON.stringify(missedSKUs))
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
                console.log('resultsFileName: ' + resultsFileName)
                console.log('notProcessSKUs: ' + notProcessedSKUFileName)
                callback(true)
              }
            })
          }
        })
      }
    })
  },

  updateResponse: function (res, fResultGlobal) {
    // fs.writeFileSync(resultsPath + '\\' + resultsFileName, res)
    if (res.error) {
      delete res.error
    }
    var flag = false
    for (var key in res) {
      if (res.hasOwnProperty(key)) {
        resObj[key] = res[key]
        flag = true
      }
    }
    if (!flag) {
      return
    }
    res = JSON.stringify(res)
    // fs.open(resultsPath + '\\' + resultsFileName, 'r', function (err, fd) {
    //   if (err) {
    //     fs.writeFileSync(resultsPath + '\\' + resultsFileName, res)
    //   } else {
    //     fs.appendFileSync(resultsPath + '\\' + resultsFileName, res)
    //   }
    // })

    // for (var key in res) {
    //   if (res.hasOwnProperty(key)) {
    //     fResultGlobal[key] = res[key]
    //     fResultGlobal.count += 1
    //     // this.finalRes[key] = res[key]
    //   }
    // }
  },

  finalRes: {

  },

  count: {
    value: 0
  }
}

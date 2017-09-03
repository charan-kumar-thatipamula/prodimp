function Main() {

}

Main.prototype.run = function () {
  var fId = 20541954
  try {
    var lf = new LoadFile()
    lf.setFileId(fId)
    var soapStr = lf.loadFile()
    var i = 0
    while (i < soapStr.length) {
      // nlapiLogExecution('DEBUG', 'soapStr', soapStr.substring(i, i + 4000))
      i = i + 4000
    }

    // var xmlUtil = new XMLUtilility()
    // xmlUtil.setSoapString(soapStr)
    // var itemJson = xmlUtil.getJsonFromSoapString()
    var itemJsonStr = processRecordWrapper(soapStr) // JSON.stringify(itemJson)

    // var nsUpdate = new NSUpdate()
    // nsUpdate.setItemJson(itemJsonStr)
    // nsUpdate.processRecord()
  } catch (e) {
    nlapiLogExecution('ERROR', 'Exception saving item', e)
  }
}

function processRecordWrapper(soapStr) {
  // nlapiLogExecution('DEBUG', 'soapStr', soapStr)
  // nlapiLogExecution('DEBUG', 'typeof soapStr', typeof soapStr)
  // return JSON.stringify(soapStr)
  try {
    var d1 = new Date().getTime()
    var xmlUtil = new XMLUtilility()
    xmlUtil.setSoapString(soapStr)
    var itemJson = xmlUtil.getJsonFromSoapString()
    var itemJsonStr = JSON.stringify(itemJson)
    var i = 0
    // while (i < itemJsonStr.length) {
    //   nlapiLogExecution('DEBUG', 'itemJsonStr', itemJsonStr.substring(i, i + 4000))
    //   i = i + 4000
    // }
    var d2 = new Date().getTime()
    nlapiLogExecution('DEBUG', 'time for xml to string', (d2 - d1) / 1000)
    var savedRecords = triggerProcessRecord(itemJsonStr)
    nlapiLogExecution('DEBUG', 'savedRecords', JSON.stringify(savedRecords))
    var d3 = new Date().getTime()
    nlapiLogExecution('DEBUG', 'total time taken', (d3 - d2) / 1000)
    return JSON.stringify(savedRecords)
  } catch(e) {
    nlapiLogExecution('DEBUG', 'Exception during Item Import', e)
    return JSON.stringify(e)
  }
  // return itemJsonStr
}

function triggerProcessRecord(itemJsonStr) {
  var nsUpdate = new NSUpdate()
  nsUpdate.setItemJson(itemJsonStr)
  return nsUpdate.processRecord()
}

function run() {
  var d1 = new Date()
  var startTime = d1.getTime()
  nlapiLogExecution('DEBUG', 'start time', d1)
  var m = new Main()
  m.run()
  var d2 = new Date()
  var endTime = d2.getTime()
  nlapiLogExecution('DEBUG', 'end time', d2)
  nlapiLogExecution('DEBUG', 'elapsed time', (d2 - d1) / 1000)
  nlapiLogExecution('DEBUG', 'lapsed time', (endTime - startTime) / 60)
}

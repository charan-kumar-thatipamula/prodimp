function LoadFile() {

}

LoadFile.prototype.getFileId = function () {
  return this.fileId
}

LoadFile.prototype.getFilePath = function () {

}

LoadFile.prototype.setFileId = function (fileId) {
  this.fileId = fileId
}

LoadFile.prototype.loadFile = function () {
  try {
    var fStr = nlapiLoadFile(this.getFileId()).getValue()
    return fStr
  } catch (e) {
    nlapiLogExecution('DEBUG', 'Exception loading file: ', e)
    throw e
  }
}

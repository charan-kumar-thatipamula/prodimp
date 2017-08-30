function XMLUtilility() {

}

XMLUtilility.prototype.getJsonFromSoapString = function () {
    var x2js = new X2JS()
    var xmlAsJson = x2js.xml_str2json(this.getSoapString())
    return xmlAsJson
}

XMLUtilility.prototype.setSoapString = function (soapStr) {
    this.soapStr = soapStr
}

XMLUtilility.prototype.getSoapString = function () {
    return this.soapStr
}

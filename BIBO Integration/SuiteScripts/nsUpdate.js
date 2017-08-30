function NSUpdate() {

}

NSUpdate.prototype.setItemJson = function (itemJson) {
  this.itemJson = JSON.parse(itemJson)
}

NSUpdate.prototype.getItemJson = function () {
  return this.itemJson
}

function updateNSObject(nsObjUpdate, itemJson) {
  for (var field in itemJson) {
    if (itemJson.hasOwnProperty(field)) {
      switch (field) {
        case 'pricingMatrix':
          var pricingArray = jsonPath(itemJson, '$.' + 'pricingMatrix.pricing') || [{}]
          pricingArray = pricingArray[0]
          nsObjUpdate.handlePricingMatrix(pricingArray)
          break
        case 'customFieldList':
          var customFieldArray = jsonPath(itemJson, '$.' + 'customFieldList.customField') || [{}]
          customFieldArray = customFieldArray[0]
          nsObjUpdate.handleCustomFieldList(customFieldArray)
          break
        default:
          nsObjUpdate.updateField(itemJson, field)
          break
      }
    }
  }
  return nsObjUpdate.save()
}

NSUpdate.prototype.processRecord = function () {
  // var nlObj = nlapiCreateRecord('inventoryitem')
  var obj = {
    "one": {
      "two": {
        "three": 3
      }
    }
  }
  // nlapiLogExecution('DEBUG', 'value', JSON.stringify(jsonPath(obj, '$.one.two')))
  // return
  // var x = jsonPath(this.getItemJson(), '$.Envelope')
  // var j = this.getItemJson()
  // nlapiLogExecution('DEBUG', 'typeof j', typeof j)
  // nlapiLogExecution('DEBUG', 'value', j['envelope'])
  // nlapiLogExecution('DEBUG', 'x', x)
  // return
  var record = jsonPath(this.getItemJson(), '$.' + 'Envelope.Body.addList.record') || [{}]
  record = record[0]
  if (!record) {
    nlapiLogExecution('DEBUG', 'record is empty', 'No records found to import. Returning.....')
    return
  }
  var nlObj = getNLObj(record)
  var nsObjUpdate = new NSObjUPdate()
  nsObjUpdate.setNLRecord(nlObj)
  return updateNSObject(nsObjUpdate, record)
}

function getNLObj(record) {
  var itemId = 'asdfasd' // record.itemId.__text
  var s = nlapiSearchRecord('inventoryitem', null, new nlobjSearchFilter('nameinternal', null, 'is', itemId), null)
  if (!s || !s.length) {
    return nlapiCreateRecord('inventoryitem')
  } else {
    return nlapiLoadRecord('inventoryitem', s[0].getId())
  }
}

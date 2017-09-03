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
  var record = jsonPath(this.getItemJson(), '$.' + 'Envelope.Body.addList.record') || ['']
  record = record[0]
  if (!record || !record.length) {
    var record = jsonPath(this.getItemJson(), '$.' + 'Envelope.Body.updateList.record') || ['']
    record = record[0]
  }
  if (!record) {
    nlapiLogExecution('DEBUG', 'record is empty', 'No records found to import. Returning.....')
    return
  }

  var context = nlapiGetContext()
  var savedIds = {}
  for (var i = 0; i < record.length; i++) {
    var remainingUsage = context.getRemainingUsage()
    nlapiLogExecution('DEBUG', 'Remaining usage', 'Remaining usage points: ' + remainingUsage)
    if (remainingUsage < 30) {
      break
    }
    var cRecord = record[i]
    // nlapiLogExecution('DEBUG', 'cRecord', JSON.stringify(cRecord))
    try {
      var nlObj = getNLObj(cRecord)
      var nsObjUpdate = new NSObjUPdate()
      nsObjUpdate.setNLRecord(nlObj)
      var cId = updateNSObject(nsObjUpdate, cRecord)
      // savedIds.push(cId)
      nlapiLogExecution('DEBUG', 'SKU and Id', 'SKU: ' + cRecord.itemId.__text + ', Saved Id: ' + cId)    
      savedIds[cRecord.itemId.__text] = cId
    } catch(e) {
      nlapiLogExecution('DEBUG', 'Exception saving the item: ' + cRecord.itemId.__text, e)
      savedIds[cRecord.itemId.__text] = e
    }
  }
  // var nlObj = getNLObj(record)
  // var nsObjUpdate = new NSObjUPdate()
  // nsObjUpdate.setNLRecord(nlObj)
  // return updateNSObject(nsObjUpdate, record)
  return savedIds
}

function getNLObj(record) {
  var itemId = record.itemId.__text
  // var s = nlapiSearchRecord('inventoryitem', null, new nlobjSearchFilter('nameinternal', null, 'is', itemId), null)
  var s = nlapiSearchRecord('inventoryitem', null, new nlobjSearchFilter('custitem_external_id', null, 'is', itemId), null)
  if (!s || !s.length) {
    return nlapiCreateRecord('inventoryitem')
  } else {
    return nlapiLoadRecord('inventoryitem', s[0].getId())
  }
}

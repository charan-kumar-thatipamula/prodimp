function NSObjUPdate() {

}

NSObjUPdate.prototype.setNLRecord = function (nlObj) {
  this.nlObj = nlObj
}

NSObjUPdate.prototype.getNLRecord = function (nlObj) {
  return this.nlObj
}

NSObjUPdate.prototype.handlePricingMatrix = function (pricingArray) {
  var plLineMap = getPriceLevelLineMap(this.getNLRecord())
  for (var i = 0; i < pricingArray.length; i++) {
    var priceObj = pricingArray[i]
    var priceLevel = jsonPath(priceObj, '$.' + 'priceLevel._internalId')[0]
    var priceValue = jsonPath(priceObj, '$.' + 'priceList.price.value.__text')[0]
    // var priceValue = jsonPath(priceObj, '$.' + 'priceList.price.value')[0]
    setValue(this.getNLRecord(), 'price_1_', priceValue, 'price', plLineMap[priceLevel])
    // this.getNLRecord().setLineItemValue('price', 'price_1_', plLineMap[priceLevel], priceValue)
  }
}

function getPriceLevelLineMap(nlObj) {
  var c = nlObj.getLineItemCount('price')
  var plLineMap = {}
  nlapiLogExecution('DEBUG', 'price lines count', c)
  for (var i = 1; i <= c; i++) {
    var pl = nlObj.getLineItemValue('price', 'pricelevel', i)
    plLineMap[pl] = i
  }
  return plLineMap
}
NSObjUPdate.prototype.handleCustomFieldList = function (customFieldArray) {
  for (var i = 0; i < customFieldArray.length; i++) {
    var custObj = customFieldArray[i]
    var value = getValue(custObj.value)
    // setValue(this.getNLRecord(), custObj._internalId, value)
    setValue(this.getNLRecord(), custObj._scriptId, value)
  }
}
NSObjUPdate.prototype.updateField = function (itemJson, field) {
  var value = getValue(itemJson[field])
  setValue(this.getNLRecord(), field, value)
}

NSObjUPdate.prototype.save = function () {
  try {
  this.getNLRecord().setFieldValue('isdropshipitem', 'F')
  this.getNLRecord().setFieldValue('custitem_cseg_ilt_busns_unit', 1)
  this.getNLRecord().setFieldValue('custitem_product_category', 8)
  this.getNLRecord().setFieldValue('custitem_product_class', 52)
  this.getNLRecord().setFieldValue('custitem_product_subclass', 1)
  // this.getNLRecord().setFieldValue('itemid', new Date().getTime() + '')
  var itemid = this.getNLRecord().getFieldValue('itemid')
  var rId = nlapiSubmitRecord(this.getNLRecord())
  return {
    'itemid': itemid,
    'rId': rId
  }
  } catch (e) {
    throw e
  }
}
NSObjUPdate.prototype.getNLObj = function (record) {
  var itemId = record.itemId.__text || record.itemId
  // var itemId = record.itemId
  // var s = nlapiSearchRecord('inventoryitem', null, new nlobjSearchFilter('nameinternal', null, 'is', itemId), null)
  var s = nlapiSearchRecord('inventoryitem', null, new nlobjSearchFilter('itemid', null, 'is', itemId), null)
  if (!s || !s.length) {
    return nlapiCreateRecord('inventoryitem')
  } else {
    return nlapiLoadRecord('inventoryitem', s[0].getId())
  }
}
function setValue(nlObj, f, v, subList, lineNum) {
  if (v === undefined) {
    return
  }
  f = f.toLowerCase()
  if (subList) {
    // nlapiLogExecution('DEBUG', 'subList, f, lineNum, v', subList + ' : ' + f + ' : ' + lineNum + ' : ' + v)
    nlObj.setLineItemValue(subList, f, lineNum, v)
  } else {
    // nlapiLogExecution('DEBUG', 'f, v', f + ' : ' + v)
    if (f === 'parent') {
      // v = 104687
    }
    nlObj.setFieldValue(f, v)
  }
}
function getValue(obj) {
  if (obj._internalId) {
    return parseInt(obj._internalId, 10)
  } else if (obj.__text) {
    return (obj.__text === 'true' || obj.__text === 'false') ? ((obj.__text === 'true') ? 'T' : 'F') : obj.__text
  }

  if (typeof obj === 'object') {
    return ''
  } else {
    return (obj === 'true' || obj === 'false') ? ((obj === 'true') ? 'T' : 'F') : obj
  }
}

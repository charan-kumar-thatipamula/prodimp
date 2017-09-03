var fs = require('fs')
var http = require('https')

// // The url we want is `www.nodejitsu.com:1337/`
// var options = {
//   host: 'https://rest.sandbox.netsuite.com/app/site/hosting/restlet.nl?script=599&deploy=1',
//   // since we are listening on a custom port, we need to specify it by hand
//   // This is what changes the request to a POST request
//   method: 'POST',
//   headers: { 'Authorization': 'NLAuth nlauth_account=647267_SB2, nlauth_email=smaddela@ydesigngroup.com, nlauth_signature=n$Login123, nlauth_role=3' }
// }
// var callback = function (response) {
//   var str = ''
//   var count = 1
//   response.on('data', function (chunk) {
//     console.log(count + ' : ' + chunk)
//     str += chunk
//     count++
//   })

//   response.on('error', function (e) {
//     console.log('Error occurred')
//     console.log(e)
//   })
//   response.on('end', function () {
//     console.log(str)
//   })
// }
// var req = http.request(options, callback)

var request = require('request')
var X2JS = require('./xml2json')
// var parser = require('xml2json')

var options = {
  uri: 'https://rest.sandbox.netsuite.com/app/site/hosting/restlet.nl?script=599&deploy=1',
  // since we are listening on a custom port, we need to specify it by hand
  // This is what changes the request to a POST request
  method: 'POST',
  headers: {
    'Authorization': 'NLAuth nlauth_account=647267_SB2, nlauth_email=smaddela@ydesigngroup.com, nlauth_signature=n$Login123, nlauth_role=3'
  }
}

var h = {
  headers: { 'Authorization': 'NLAuth nlauth_account=647267_SB2, nlauth_email=smaddela@ydesigngroup.com, nlauth_signature=n$Login123, nlauth_role=3' },
  json: {
    func: 'enter your method name here', // nlapiCreateRecord',
    args: 'enter arguments to pass' // ['customer']
  }
}
var path = 'D:\\Projects\\Infologitech\\Infologitech_BIBO\\ItemImport\\StoreRoom\\TestImportFiles' // 'D:\\Projects\\Infologitech\\Storeroom\\itemfiles'
fs.readdir(path, function (err, items) {
  // console.log(items)
  if (err) {
    return console.log(err)
  }
  var d1 = new Date()
  console.log('Start time: ' + d1)
  // var count = 1
  var n = 2
  console.log('Files count: ' + items.length)
  for (var i = 0; i < items.length; i++) {
    console.log(items[i])
    fs.readFile(path + '\\' + items[i], 'utf8', function (errr, data) {
      if (errr) {
        return console.log(errr)
      }
      // console.log(typeof data)
      options.json = data
      // var x2js = new X2JS()
      // var xmlAsJson = x2js.xml_str2json(data)
      // console.log(xmlAsJson)
      // return xmlAsJson
      request(options, function (error, response, body) {
        if (error) {
          console.log(error)
          return
        }
        // console.log(count++)
        console.log(body)
        // console.log('i and items.length-1: ' + i + ' and ' + (items.length - 1))
        // if (i === items.length) {
          var d2 = new Date()
          console.log('End time: ' + d2)
          console.log('Elapsed Time: ' + ((d2 - d1) / 1000))
        // }
        // console.log(error)
        // console.log(response)
        // console.log(body)
      })
      // request(options.method, options.uri, h, cb)
      // req.write(data)
      // req.end()
      // console.log(data)
    })
  }
})

// This is the data we are posting, it needs to be a string or a buffer

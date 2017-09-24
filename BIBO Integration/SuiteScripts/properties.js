

module.exports = {
    options: {
        uri: 'https://rest.sandbox.netsuite.com/app/site/hosting/restlet.nl?script=599&deploy=1',
        method: 'POST',
        headers: {
            'Authorization': 'NLAuth nlauth_account=647267_SB2, nlauth_email=smaddela@ydesigngroup.com, nlauth_signature=n$Login123, nlauth_role=3'
        }
    },

    sourcePath: 'D:\\Projects\\Infologitech\\Infologitech_BIBO\\ItemImport\\StoreRoom\\Source',
    tempPath: 'D:\\Projects\\Infologitech\\Infologitech_BIBO\\ItemImport\\StoreRoom\\Temporary',
    processedPath: 'D:\\Projects\\Infologitech\\Infologitech_BIBO\\ItemImport\\StoreRoom\\Processed',
    resultsPath: 'D:\\Projects\\Infologitech\\Infologitech_BIBO\\ItemImport\\StoreRoom\\ResultFiles',
    numFilesToMove: 2,
    batchSize: 10,
    resultsFileName: 'results',
    notProcessedSKUFileName: 'notProcessed'
}

// ******* Details of each field ********
// {
//     options: {
//         uri: 'https://rest.sandbox.netsuite.com/app/site/hosting/restlet.nl?script=599&deploy=1',
//         method: 'POST',
//         headers: {
//             'Authorization': 'NLAuth nlauth_account=647267_SB2, nlauth_email=*******, nlauth_signature=******, nlauth_role=3'
//         }
//     }, // Authorization for NetSuite

//     sourcePath: // Folder that has input xml files with items information.
//     tempPath: // Create a temporary folder which will be used during import and provide path here.
//     processedPath: // After completion all the files will be moved to this folder.
//     resultsPath: // This will have results in as tx files. 
                    // files starting with 'results' will have the files and their internalids or any errors during their creation
                    // files starting with 'notProcessed' needs to be run again
//     numFilesToMove: 2, // Number of files to be moved in each run. 
                          // Each time 'node startImport.js' is run, these many files will be taken and import for items in these many number of files will run
                          // I recommend using 1000 imports in each run. So if each file has 500 items in it, value for this field will be 2 (2*500 = 1000 items)
//     batchSize: 10, // Number of files sent per request. Please do not change this.
//     resultsFileName: 'results', // results file prefix. timestamp will be added to this prefix and will saved in 'resultsPath' from above.
                                   // This file will have SKU and Id/ error as json object.
                                   // If import is success, you can an id for the SKU. If failed, you can see error associated with that queue.
//     notProcessedSKUFileName: 'notProcessed' // prefix for files that are not at all triggerred for import.
                                               // It will have SKU and input file name.
                                               // So, all the input files listed here should be put back in 'sourcePath' and run the import again.
// }
module.exports = {
    options: {
        uri: 'https://rest.sandbox.netsuite.com/app/site/hosting/restlet.nl?script=599&deploy=1',
        method: 'POST',
        headers: {
            'Authorization': 'NLAuth nlauth_account=647267_SB2, nlauth_email=smaddela@ydesigngroup.com, nlauth_signature=n$Login123, nlauth_role=3'
        }
    },

    sourcePath: 'D:\\Projects\\Infologitech\\Infologitech_BIBO\\ItemImport\\StoreRoom\\Source', // 'D:\\Projects\\Infologitech\\Storeroom\\itemfiles'
    tempPath: 'D:\\Projects\\Infologitech\\Infologitech_BIBO\\ItemImport\\StoreRoom\\Temporary',
    processedPath: 'D:\\Projects\\Infologitech\\Infologitech_BIBO\\ItemImport\\StoreRoom\\Processed',
    resultsPath: 'D:\\Projects\\Infologitech\\Infologitech_BIBO\\ItemImport\\StoreRoom\\ResultFiles',
    childFilesFolder: 'D:\\Projects\\Infologitech\\Infologitech_BIBO\\ItemImport\\StoreRoom\\Childfiles-parent',
    numFilesToMove: 2,
    batchSize: 10,
    resultsFileName: 'results',
    notProcessedSKUFileName: 'notProcessed'
}

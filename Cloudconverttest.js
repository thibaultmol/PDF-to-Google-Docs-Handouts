function cloudConvertTest1() {
    var cloudconvertApiKey = "INSERTKEY";
    // Create Process ID
    var payload = {
        'inputformat': 'pdf'
        , 'outputformat': 'jpg'
    };
    var headers = {
        'Authorization': 'Bearer ' + cloudconvertApiKey
    };
    var url = 'https://api.cloudconvert.com/process';
    var options = {
        'method': 'post'
        , 'headers': headers
        , 'payload': payload
    };
    var response = UrlFetchApp.fetch(url, options);
    var json = response.getContentText();
    // Receive Process URL
    var processURL = JSON.parse(json).url;
    Logger.log('Remaining Minutes (credits)' + JSON.parse(json).minutes);
  
      //Starting the conversion

    
    var payload = {
        'input': 'upload'
        , 'outputformat': 'jpg'
    };
    var headers = {
        'Authorization': 'Bearer ' + cloudconvertApiKey
    };
    var url = 'http:' + processURL;
    var options = {
        'method': 'post'
        , 'headers': headers
        , 'payload': payload
    };
    var response = UrlFetchApp.fetch(url, options);
    var json = response.getContentText();
    // Receive Process URL
    var processURL = 'http:' + JSON.parse(json).url;
    var uploadURL = 'http:' + JSON.parse(json).upload.url;
  
  //upload file
  
    var fileToUpload = DriveApp.getFilesByName('testpdfverymuchtest.pdf').next();
    fileToUpload.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    var fileToUploadUrlBlob = fileToUpload.getBlob();
  
    var payload = {
        'input': 'upload'
        , 'file': fileToUploadUrlBlob
    };
    var headers = {
        'Authorization': 'Bearer ' + cloudconvertApiKey
    };
    var options = {
        'method': 'post'
        , 'headers': headers
        , 'payload': payload
    };
    var response = UrlFetchApp.fetch(uploadURL, options);
    var json = response.getContentText();
  

}
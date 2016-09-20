function myFunction() {
    //show progressbar
    var html = HtmlService.createTemplateFromFile('loading').evaluate();
    DocumentApp.getUi().showModalDialog(html, 'Preparing Document...');
    //df
    var body = DocumentApp.getActiveDocument().getBody();
    //Empty page and set correct format and margins
    body.clear();
    body.setPageWidth(842);
    body.setPageHeight(595);
    body.setMarginLeft(28);
    body.setMarginBottom(28);
    body.setMarginRight(28);
    body.setMarginTop(28);
    //Make first row
    var table = body.appendTable();
    var row = table.appendTableRow().setMinimumHeight(480);
    row.appendTableCell();
    row.appendTableCell();
    table.setColumnWidth(0, 500);
    //Select 'Slides' folder which is in the same folder as the Google Doc
    var theDocument = DocumentApp.getActiveDocument();
    var docID = theDocument.getId();
    var theFile = DriveApp.getFileById(docID);
    var parents = theFile.getParents();
    var folder = parents.next();
    var slidesFolders = folder.getFoldersByName("Slides");
    var slidesFolder = slidesFolders.next();
    var files = slidesFolder.getFiles();
    //files have to be sorted alphabetically for this script to work properly
    var slides = sortFiles(files);
    for (var i = 0, len = slides.length; i < len; i++) {
        //Insert image in first column  
        var cell = row.getCell(0);
        cell.appendImage(slides[i]);
        //Calculate progress and set as ScriptProperty so that loading screen can read it
        var progress = i / slides.length * 100;
        PropertiesService.getScriptProperties().setProperty('convertingProgress', progress);
        Logger.log(progress);
        //If there is another slide, prepare cells for next slide
        if (typeof slides[i + 1] !== 'undefined') {
            var row = table.appendTableRow().setMinimumHeight(480);
            row.appendTableCell();
            row.appendTableCell();
        };
    }
    PropertiesService.getScriptProperties().setProperty('convertingProgress', 100);
}

function cloudConvertTest1() {
    // Create Process ID
    var payload = {
        'inputformat': 'pdf'
        , 'outputformat': 'jpg'
    };
    var headers = {
        'Authorization': 'Bearer ' + 'CLOUDCONVERT API KEY'
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
    var fileToUpload = DriveApp.getFilesByName('testpdfverymuchtest.pdf').next();
    fileToUpload.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    var fileToUploadUrl = fileToUpload.getDownloadUrl();
    Logger.log(fileToUploadUrl);
    var payload = {
        'input': 'download'
        , 'file': fileToUploadUrl
        , 'outputformat': 'jpg'
    };
    var headers = {
        'Authorization': 'Bearer ' + 'CLOUDCONVERT API KEY'
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
    var processURL = JSON.parse(json).url;
}

function sortFiles(files) {
    //http://stackoverflow.com/a/36942674
    // array to hold our data
    var data = [];
    // We loop on iterator and append results to an array
    while (files.hasNext()) {
        var file = files.next();
        // we append our data with result, we have now an array of files
        data.push(file);
    }
    // lets sort our array
    data = data.sort(function (file1, file2) {
        if (file1.getName().toLowerCase() < file2.getName().toLowerCase()) return -1;
        else if (file1.getName().toLowerCase() > file2.getName().toLowerCase()) return 1;
        else return 0;
    })
    return data;
}

function testHTML() {
    var html = HtmlService.createTemplateFromFile('Loading').evaluate();
    DocumentApp.getUi().showModalDialog(html, 'Preparing Document...');
}

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function progress(type) {
    if (type == "convert") {
        return PropertiesService.getScriptProperties().getProperty('convertingProgress');
    }
    else {
        return PropertiesService.getScriptProperties().getProperty('AddingProgress');
    };
}
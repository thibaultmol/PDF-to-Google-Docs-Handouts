function onOpen() {
  var ui = DocumentApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('PDF to Handouts')
      .addItem('Create handouts', 'mainFunction')
  .addToUi();
}

function mainFunction() {
    //show progressbar
  Logger.log("test");
    var html = HtmlService.createTemplateFromFile('Loading').evaluate();
    DocumentApp.getUi().showModalDialog(html, 'Preparing Document...');
    var body = DocumentApp.getActiveDocument().getBody();
    PropertiesService.getScriptProperties().setProperty('Progress', 0);
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
    var slideFolder;
  try {slideFolder = slidesFolders.next();}
  catch (e) {DocumentApp.getUi().alert('Folder "Slides" not found! \n The folder "Slides" must be in the same folder as the current document');
             throw ('error: Folder "Slides" not found!');}
    var files = slideFolder.getFiles();
  if(files.hasNext() === false)
{
    DocumentApp.getUi().alert('No slides are present in the "Slides" folder!');
             throw ('error: No slides are present in the "Slides" folder!');
}
    //files have to be sorted alphabetically for this script to work properly
    var slides = sortFiles(files);
    for (var i = 0, len = slides.length; i < len; i++) {
        //Insert image in first column  
        var cell = row.getCell(0);
        cell.appendImage(slides[i]);
        //Calculate progress and set as ScriptProperty so that loading screen can read it
        var progress = i / slides.length * 100;
        PropertiesService.getScriptProperties().setProperty('Progress', progress);
        Logger.log(progress);
        //If there is another slide, prepare cells for next slide
        if (typeof slides[i + 1] !== 'undefined') {
            var row = table.appendTableRow().setMinimumHeight(480);
            row.appendTableCell();
            row.appendTableCell();
        };
    }
    PropertiesService.getScriptProperties().setProperty('Progress', 100);
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

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function progress() {
        return PropertiesService.getScriptProperties().getProperty('Progress');
}
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
    body.setMarginLeft(17);
    body.setMarginBottom(17);
    body.setMarginRight(17);
    body.setMarginTop(17);
    //define formatting
    var styleImage = {};
    styleImage[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
     DocumentApp.HorizontalAlignment.CENTER;
    styleImage[DocumentApp.Attribute.FONT_SIZE] = 6;
    styleImage[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';
    styleImage[DocumentApp.Attribute.BORDER_WIDTH] = 1;
    styleImage[DocumentApp.Attribute.BORDER_COLOR] = '#000000';
    var styleText = {};
    styleText[DocumentApp.Attribute.FONT_SIZE] = 11;
    styleText[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';
    var styleOCRText = {};
    styleOCRText[DocumentApp.Attribute.FONT_SIZE] = 6;
    styleOCRText[DocumentApp.Attribute.FOREGROUND_COLOR] = '#FFAFFF';
    //get files
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
      var paras = body.getParagraphs();
        if(i===0){
          paras[0].appendInlineImage(slides[i]).getParent().setAttributes(styleImage);
                 } else {
                   body.appendImage(slides[i]).getParent().setAttributes(styleImage);
                 }
        //body.appendParagraph("").setAttributes(styleText);
        var progress = i / slides.length * 100;
        PropertiesService.getScriptProperties().setProperty('Progress', progress);
        Logger.log(progress);
        //If there is another slide, prepare cells for next slide
        if (typeof slides[i + 1] !== 'undefined') {
           var comments = body.appendParagraph("");
           comments.setAttributes(styleText);
           body.appendPageBreak();
          comments.getNextSibling().setAttributes(styleOCRText);
        }
      else {
      body.appendParagraph("").setAttributes(styleText);
      body.appendParagraph("").setAttributes(styleOCRText);
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
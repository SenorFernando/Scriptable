var sheetID = "YOURSHEETIDHERE"
var timezone = "GMT-5"

var plantsheet = SpreadsheetApp.openById(sheetID).getSheetByName('Sheet1');

function doGet(e) {
  
  var plant = JSON.parse(e.parameters.plant)
  var formattedDate = Utilities.formatDate(new Date(), timezone, "MM/dd/yyyy");
  plantsheet.appendRow([formattedDate,plant]);
}
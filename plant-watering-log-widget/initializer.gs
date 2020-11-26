var sheetID = "YOURSHEETIDHERE"
var mysheet = SpreadsheetApp.openById(sheetID).getSheetByName('Sheet1');

function doGet(request) {
  var today = "=TODAY()"
  
//  var plant1;
//  var plant2;
//  var plant3;
//  var plant4;
//  
//  var threshold1;
//  var threshold2;
//  var threshold3;
//  var threshold4;
  
  var query1 = "=IFERROR(QUERY(A$7:B, \"select A where B = '\"&C2&\"' order by A desc limit 1\"),\"Never\")"
  var query2 = "=IFERROR(QUERY(A$7:B, \"select A where B = '\"&C3&\"' order by A desc limit 1\"),\"Never\")"
  var query3 = "=IFERROR(QUERY(A$7:B, \"select A where B = '\"&C4&\"' order by A desc limit 1\"),\"Never\")"
  var query4 = "=IFERROR(QUERY(A$7:B, \"select A where B = '\"&C5&\"' order by A desc limit 1\"),\"Never\")"
  
  var days1 = "=IFERROR(DATEDIF(D2,today(),\"D\"),\"\")"
  var days2 = "=IFERROR(DATEDIF(D3,today(),\"D\"),\"\")"
  var days3 = "=IFERROR(DATEDIF(D4,today(),\"D\"),\"\")"
  var days4 = "=IFERROR(DATEDIF(D5,today(),\"D\"),\"\")"
  
  try{
   var plantNumber = JSON.parse(request.parameters.num)
  }
  catch (e){
    return;
  }
  
  // Populate dashboard headers
  mysheet.appendRow(["Today's date",today,"Plant Name","Last  Watered","Days Ago","Threshold"]);
  
  // Populate top table
  try{
    mysheet.appendRow(["","",JSON.parse(request.parameters.n1),query1,days1,JSON.parse(request.parameters.tr1)])
    mysheet.appendRow(["","",JSON.parse(request.parameters.n2),query2,days2,JSON.parse(request.parameters.tr2)])
    mysheet.appendRow(["","",JSON.parse(request.parameters.n3),query3,days3,JSON.parse(request.parameters.tr3)])
    mysheet.appendRow(["","",JSON.parse(request.parameters.n4),query4,days4,JSON.parse(request.parameters.tr4)])
  }
  catch (e){
   // Do nothing and hope for the best 
  }

  // Add needed blank extra rows for correct format
  var extra = 4 - plantNumber;
  for(var i = 0; i < extra; i++) {
    mysheet.appendRow([" "]);
  }
  
  // Try to change col D format to date
  try {
      var cell = mysheet.getRange("D2:D5");
      cell.setNumberFormat("MM/dd/yyyy");
  }
  catch (e) {
    // If you are reading this, I'm sorry
  }
    
  // Add log headers
  mysheet.appendRow(["Water Date","Plant Name"]);
}
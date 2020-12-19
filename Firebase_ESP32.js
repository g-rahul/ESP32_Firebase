function firebase() {
  var base = FirebaseApp.getDatabaseByUrl("https://fir-a92d1.firebaseio.com/", "ahqhO1svDsU8ImewZTSLBFejgE0yrDkwEZSYxrxg");
  Logger.log(base.getData());
  var sheet = SpreadsheetApp.openById("1AaL1c0An5g4sLtEpnfdrPdlJDFmEcQUnB7-FfV6yR70");
  var User = base.getData("User");
  sheet.getRange("A2").setValue(User);
  var chargingState = base.getData("Charging Status");
  sheet.getRange("C2").setValue(chargingState);
  var finishState = base.getData("Finished Charging");
  

  // Wait for chargingState to be 1
  while(chargingState == false)
  {
    chargingState = base.getData("Charging Status");
  }
    Utilities.sleep(7000);   // Wait for initial SOC to be updated in Firebase.
    var SOC = base.getData("SOC");
    sheet.getRange("E2").setValue(SOC);
    while(finishState == false)
    {
      SOC = base.getData("SOC");
      finishState = base.getData("Finished Charging");
    }
    sheet.getRange("D2").setValue(finishState);
    sheet.getRange("F2").setValue(SOC);
    var totalEnergy = ((sheet.getRange("F2").getValue() - sheet.getRange("E2").getValue())/100)*70;  // Total Energy in kWh
    sheet.getRange("G2").setValue(totalEnergy);

    // Call Billing function
      var sourceSpreadsheet = SpreadsheetApp.openById("1sKZDwOKsrdFiIvw-vyDpl4Mcw_wMOBlihmrpd6KrnZs");    // Template Invoice spreadsheet ID
      sourceSpreadsheet.getRange("D9").setValue(Utilities.formatDate(new Date(),"IST","dd-MM-yyyy"));
      sourceSpreadsheet.getRange("B12").setValue(User);
      sourceSpreadsheet.getRange("E19").setValue(totalEnergy);

    var pdfName = "Invoice_" + sheet.getRange("A2").getValue();
    
    // Generate pdf function
      // Get active sheet.
  var sheets = sourceSpreadsheet.getSheets();
  var sheetName = sourceSpreadsheet.getActiveSheet().getName();
  var sourceSheet = sourceSpreadsheet.getSheetByName(sheetName);
  
  // Set the output filename as SheetName.
  var pdfName = sheetName + "_" + sourceSpreadsheet.getRange("B12").getValue();

  // Get folder containing spreadsheet to save pdf in.
  var parents = DriveApp.getFileById(sourceSpreadsheet.getId()).getParents();
  if (parents.hasNext()) {
    var folder = parents.next();
  }
  else {
    folder = DriveApp.getRootFolder();
  }
  
  // Copy whole spreadsheet.
  var destSpreadsheet = SpreadsheetApp.open(DriveApp.getFileById(sourceSpreadsheet.getId()).makeCopy("tmp_convert_to_pdf", folder))

  // Delete redundant sheets.
  var sheets = destSpreadsheet.getSheets();
  for (i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetName() != sheetName){
      destSpreadsheet.deleteSheet(sheets[i]);
    }
  }
  
  var destSheet = destSpreadsheet.getSheets()[0];

  // Repace cell values with text (to avoid broken references).
  var sourceRange = sourceSheet.getRange(1,1,sourceSheet.getMaxRows(),sourceSheet.getMaxColumns());
  var sourcevalues = sourceRange.getValues();
  var destRange = destSheet.getRange(1, 1, destSheet.getMaxRows(), destSheet.getMaxColumns());
  destRange.setValues(sourcevalues);

  // Save to pdf.
  var theBlob = destSpreadsheet.getBlob().getAs('application/pdf').setName(pdfName);
  var newFile = folder.createFile(theBlob);

  // Delete the temporary sheet.
  DriveApp.getFileById(destSpreadsheet.getId()).setTrashed(true);

  // Mail the bill
    var filename = DriveApp.getFileById("1sKZDwOKsrdFiIvw-vyDpl4Mcw_wMOBlihmrpd6KrnZs").getAs("application/pdf");
    filename.setName(pdfName + ".pdf"); 
    var message = 'Dear ' + sheet.getRange("A2").getValue() + ", \n The bill for your charging session has been attached with this mail. \n Thank you for charging. Please visit again";
   var subject = 'Invoice for' + sheet.getRange("A2").getValue();
   GmailApp.sendEmail("rakshithjc.ec17@rvce.edu.in", subject,message,{attachments: [filename]});
  
}
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;

// Author: @SenorFernando
// Date: 2020/11/25
// Description: Scriptable widget to track days since last watered plants. This widget should be used in conjunction with the IOS Shortcut "Plant Water Log" found in the same repository and a specially formatted Google sheet, details on the same repo. Displays the date and number of days that have passed.

// Setup -----------
let fm = FileManager.iCloud()
let dir = "/private/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/PlantGoogleData.txt"

let sid= ""
let gid= ""

if (!fm.fileExists(dir)){
  let alert = new Alert()
  alert.title = "Please enter your Google sheet ID"
  alert.addTextField("Google sheet ID")
  alert.addAction("Submit")
  alert.addCancelAction("Cancel")
  let eventIdx = await alert.presentAlert()
  if (eventIdx == -1) {
    return
  }
  else {
    sid = alert.textFieldValue()
  }
  let alert2 = new Alert()
  alert2.title = "Please enter your Google API key"
  alert2.addTextField("Google API key")
  alert2.addAction("Submit")
  alert2.addCancelAction("Cancel")
  eventIdx = await alert2.presentAlert()
  if (eventIdx == -1) {
    return
  }
  else {
    gid = alert2.textFieldValue()
  }
  // Write to file
  fm.writeString(dir, sid + "\n" + gid)

  // Thanks Alert
  let alertThanks = new Alert()
  alertThanks.title = "Setup Complete"
  alertThanks.message = "You can now add a record to your log using the 'Plant Log Entry' Shortcut"
  alertThanks.addCancelAction("Finish Setup")
  eventIdx = await alertThanks.presentAlert()
  if (eventIdx == -1) {
    return
  }
}

// Credentials have been provided previously, read file
let dataread = fm.readString(dir)
let datas = dataread.replace(/\n/g, " ").split(" ")

// Google sheet ID
let sheetID = datas[0]
// Google API key
let APIkey = datas[1]


// ----------------
let url = "https://sheets.googleapis.com/v4/spreadsheets/" + sheetID + "/values/Sheet1!B1:F5?key=" + APIkey

// Widget
let widget = await createWidget();
Script.setWidget(widget);

async function createWidget() {
	let w = new ListWidget()
	w.backgroundColor = colorBG()

	// Auto refresh, not sure if it really works  
	var refreshDate = Date.now() + 1000*60*3 // 3 minutes
	w.refreshAfterDate = new Date(refreshDate)

	let Header = "Plant water log"  
	let titleTxt = w.addText(Header)
	titleTxt.textColor = colorTXT()
	titleTxt.font = new Font("Helvetica Bold", 14)

	let lastTxt = w.addText("Days since last wattering")
	lastTxt.font = new Font("Helvetica Light", 9)

	w.addSpacer(8)

	try {
		const req = new Request(url);
		const data = await req.loadJSON();
		let datarefresh = data.values[0][0]

		// Populate the widget. Tested with 4 rows
		for (var i = 1; i < data.values.length; i++) {
			let plantname = data.values[i][1]
			let plantdate = data.values[i][2]
			let plantdays = data.values[i][3]
			let plantthreshold = data.values[i][4]
	
			// Plant stack
			const h1 = w.addStack()
			h1.layoutHorizontally()
			h1.centerAlignContent()
	
			// name
			const n1 = h1.addText(plantname)
			n1.font = Font.boldSystemFont(11)
	
			// date
			h1.addSpacer()
			const p1 = h1.addText(plantdate)
			p1.font = Font.systemFont(8)
			p1.textOpacity = .40
			h1.addSpacer(6)
	
			// days
			const d1 = h1.addText(plantdays)
			d1.font = Font.boldSystemFont(11)
			d1.textColor = colorDay(plantdays, plantthreshold)  
		}

		w.addSpacer(10)
		// Data as of date
		const s1 = w.addStack()
		s1.layoutHorizontally()
		s1.centerAlignContent()
		
		let sheetsRefresh = s1.addText("Data as of: " + datarefresh)
		sheetsRefresh.textOpacity = .30
		sheetsRefresh.font = new Font("Helvetica Light", 8)
		
		s1.addSpacer(5)
	}
	catch (e) {
		w.addSpacer(4)
    let errTxt = w.addText("No Data Available")
    errTxt.font = Font.boldSystemFont(16)
    errTxt.textColor = new Color("#333333")
    errTxt.centerAlignText()
		w.addSpacer(4)
    let errTxt2 = w.addText("Check your Google Sheet ID or API key")
    errTxt2.font = Font.boldSystemFont(10)
    errTxt2.textColor = new Color("#333333")
    errTxt2.centerAlignText()
		w.addSpacer()
	}
		
	// Widget last update
	const l1 = w.addStack()
	l1.layoutHorizontally()
	l1.centerAlignContent()
	
	let refreshLabel = l1.addText("Last updated: " + new Date().toLocaleTimeString())
	refreshLabel.textOpacity = .30
	refreshLabel.font = new Font("Helvetica Light", 8)
	
	return w
	
	// Changes widget background color based on IOS dark / light mode
	function colorBG() {
		let darkC = new Color("#191919")
		let lightC = new Color("#fafafa")
		return Color.dynamic(lightC, darkC)
	}
	
	// Changes widget text color based on IOS dark / light mode
	function colorTXT() {
		let darkC = new Color("#ffffff")
		let lightC = new Color("#191919")
		return Color.dynamic(lightC, darkC)
	}
	
	// Chages day count color if number is past the threshold   
	function colorDay(days, treshold) {
		let goodC = colorTXT()
		let badColor = new Color("#ff0000")
		if (Number(days) <= Number(treshold)) {
			return goodC
		}
		else{
			return badColor
		}
	}
}
Script.complete()
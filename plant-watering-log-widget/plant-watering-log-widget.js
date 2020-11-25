// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;

// Author: @SenorFernando
// Date: 2020/11/22
// Description: Scriptable widget to track days since last watered plants. This widget should be used in conjunction with the IOS Shortcut "Plant Water Log" found in the same repository and a specially formatted Google sheet. Displays the date and number of days that have passed.

// Setup -----------
// Enter the URL of your Google sheet
let url = "<YOUR GOOGLE SHEETS URL >"


// Widget
let widget = await createWidget();
Script.setWidget(widget);

async function createWidget() {

	const req = new Request(url);
	const data = await req.loadJSON();
	let datarefresh = data.values[0][1]

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

	// Populate the widget. Tested with 4 rows
	for (var i = 2; i < data.values.length; i++) {
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

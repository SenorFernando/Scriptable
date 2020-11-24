// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;

// Author: @SenorFernando
// Date: 2020/11/24
// Description: Displays the humidity percentage and last watered record time stamp from a JSON

// Setup -----------
// Monitor URL
let url = "http://plantmonitor.local/json"
// Plant Name
let plantName = "PLANT"
// Threshold, if percentage under this, then red
let threshold = "10"


// Widget ----------
let widget = await createWidget();
Script.setWidget(widget);

async function createWidget() {
	let w = new ListWidget()
	w.backgroundColor = new Color("#4D8B31")
	var refreshDate = Date.now() + 1000*60*3 // 3 minutes
	w.refreshAfterDate = new Date(refreshDate)
	let Header = ""
	let Percentage = ""
	let TimeStamp = ""

	const h1 = w.addStack()
	h1.setPadding(5, 0, 5, 0)
	h1.size = new Size(130, 35)
	h1.cornerRadius = 5
	h1.layoutHorizontally()
	h1.backgroundColor = new Color("#ffffff")
	
	let title = h1.addText(plantName)
	title.font = new Font("Helvetica Bold", 22)
	title.textColor = new Color("000000")
	title.leftAlignText()
	// 	h1.addSpacer() //Aligns text left
	w.addSpacer(8)

	// Try / Catch, adding 5 second timeout, if no host found then print message
	try {
		const req = new Request(url);
		req.timeoutInterval = 5
		const data = await req.loadJSON();

		//Using custom data structure
		Percentage = data[0].data.T
		TimeStamp = data[0].data.H
		Header = "Last moisture reading:"

		let titleTxt = w.addText(Header)
		titleTxt.textColor = new Color("#ffffff")
		titleTxt.font = new Font("Helvetica Light", 11)
		w.addSpacer(5)

		const h2 = w.addStack()
		h2.setPadding(5, 0, 5, 0)
		h2.size = new Size(45, 25)
		h2.cornerRadius = 5
		h2.layoutHorizontally()

		h2.backgroundColor = colorAlert(Percentage)

		let percentageTxt = h2.addText(Percentage + " %")
		percentageTxt.textColor = new Color("#ffffff")
		percentageTxt.font = new Font("Helvetica Bold", 12)

		w.addSpacer(5)

		let bodyTxt = w.addText("Reading time stamp " + TimeStamp)
		bodyTxt.textColor = new Color("#ffffff")
		bodyTxt.font = new Font("Helvetica Light", 9)

		w.addSpacer(5)

		log("True")	
	}
	catch(error){
		log("outside network")
		w.addSpacer()
		Header = "Host Unreachable"

		let titleTxt = w.addText(Header)
		titleTxt.textColor = new Color("#ffffff")
		titleTxt.font = new Font("Helvetica Bold", 13)
		titleTxt.centerAlignText()
		w.addSpacer()
	}

	//Add widget refresh time stamp
	let refreshTxt = w.addText(new Date().toLocaleTimeString())
	refreshTxt.textOpacity = .35
	refreshTxt.font = new Font("Helvetica Light", 8)
	return w
}

function colorAlert(p) {
	let normalC = new Color("#579e38") //Green
	let alertC = new Color("#FF0000")  //Red
	if (p < threshold) {
		return alertC
	}
	else {
		return normalC
	}
}
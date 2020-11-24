// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;

// Author: @SenorFernando
// Date: 2020/11/23
// Description: Displays current external IP, IP City, IP ISP. Background and font color change dynamically with IOS dark / light modes

let widget = await createWidget();
Script.setWidget(widget);

async function createWidget() {
  const req = new Request("http://ipinfo.io/json");
  const data = await req.loadJSON();
  let IPHeader = "Current IP Address:"
  let IP = data.ip
  let Hostname = data.hostname
  let City = data.city
  let Org = data.org
  let w = new ListWidget()
  w.backgroundColor = colorBG()
  
  var refreshDate = Date.now() + 1000*60*3 // 3 minutes
  w.refreshAfterDate = new Date(refreshDate)
  
  w.addText("📡")
  w.addSpacer(10)
  
  let titleTxt = w.addText(IPHeader)
  titleTxt.textColor = colorTXT()
  titleTxt.font = new Font("Helvetica Bold", 12)
  
  let bodyTxt = w.addText(IP)
  bodyTxt.textColor = colorTXT()
  bodyTxt.font = new Font("Helvetica", 16)
  
  let cityTxt = w.addText(City)
  cityTxt.textColor = colorTXT()
  cityTxt.font = new Font("Helvetica", 18)
  
  w.addSpacer(5)
  
  let orgTxt = w.addText(Org)
  orgTxt.textOpacity = .5
  orgTxt.font = new Font("Helvetica Light", 8)
  
  w.addSpacer(5)
  
  let refreshTxt = w.addText(new Date().toLocaleTimeString())
  refreshTxt.textOpacity = .35
  refreshTxt.font = new Font("Helvetica Light", 8)
  return w
}

function colorBG() {
  let darkC = new Color("#191919")
  let lightC = new Color("#f2f2f2")
  return Color.dynamic(lightC, darkC)
}

function colorTXT() {
  let darkC = new Color("#ffffff")
  let lightC = new Color("#191919")
  return Color.dynamic(lightC, darkC)
}

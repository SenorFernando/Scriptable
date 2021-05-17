// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;

// Author: @SenorFernando
// Date: 2020/12/03
// Description: Displays current external IP for the NYC apartment, Apartment temperature and humidity. Background and font color change dynamically with IOS dark / light modes


/////////////////////////////////////////////////////////////////////////////////////////
//                          NOT INTENDED FOR PUBLIC RELEASE
/////////////////////////////////////////////////////////////////////////////////////////


// Settings
let tempSheetID = "1M1kD6gLxs5_ss-K6gnvQ8iTXrx4A6l6ycx5gEqRTU0o"
let ipSheetID = "1IBS-9kTCnM6ZO04Z1wWxEBSNsqxHTbeuihgEA3ALBwA"
let brownSheetID ="1g3wi4DFDPFzZnd7Ep6lyVyDcmSCt7WTKHc3AeVLE7d4"
let APIkey = "AIzaSyAxgiQuWUkLIZumC0l1l--XA7xKXWL9zoU"

let tempUrl = "https://sheets.googleapis.com/v4/spreadsheets/" + tempSheetID + "/values/Sheet1!A1246:E1246?key=" + APIkey
let ipUrl = "https://sheets.googleapis.com/v4/spreadsheets/" + ipSheetID + "/values/Sheet1!F4:G6?key=" + APIkey
let histUrl = "https://sheets.googleapis.com/v4/spreadsheets/" + tempSheetID + "/values/Sheet1!C270:C?key=" + APIkey
let brownUrl = "https://sheets.googleapis.com/v4/spreadsheets/" + brownSheetID + "/values/Sheet1!A2:B?key=" + APIkey

// Hours on chart
let hoursToShow = 48

// Widget
let widget = await createWidget();
Script.setWidget(widget);

async function createWidget() {
  let w = new ListWidget()
  w.backgroundColor = colorBG()

  var refreshDate = Date.now() + 1000*60*3 // 3 minutes
  w.refreshAfterDate = new Date(refreshDate)
  let Header = ""
  let Celsius = ""
  let Farenheit = ""
  let Humidity  = ""
  let Time = ""
  let IP = ""
  let ipDate = ""
  let ipSince = ""
  let hist = []

  Header = "NYC Apartment:"
  let titleTxt = w.addText(Header)
  titleTxt.textColor = colorTXT()
  w.addSpacer()


  //Check for data
  try{
    const req = new Request(tempUrl);
    const data = await req.loadJSON();
    Celsius = data.values[0][2]
    Farenheit = data.values[0][3]
    Humidity = data.values[0][4]
    Time = data.values[0][1]

    const req2 = new Request(ipUrl);
    const data2 = await req2.loadJSON();
    IP = data2.values[0][1]
    ipDate = data2.values[1][1]
    ipSince = data2.values[2][1]

    // Remove second decimal from Farenheit
    if(Farenheit.charAt(Farenheit.length -3) == "."){
      Farenheit = Farenheit.slice(0, -1)
    }

    const req3 = new Request(histUrl);
    hist = await req3.loadJSON();

    const req4 = new Request(brownUrl);
    drBrownData = await req4.loadJSON();
  }
  catch (e){
    let titleTxt = w.addText("No Network")
    titleTxt.textColor = new Color("#333333")
    titleTxt.font = Font.boldSystemFont(20)
    w.addSpacer()
    let refreshTxt = w.addText(new Date().toLocaleTimeString())
    refreshTxt.textOpacity = .4
    refreshTxt.font = Font.lightSystemFont(8)
    return w
  }

  // Detects widget size and displays layout accordingly | 
  if(config.widgetFamily == "small"){
    titleTxt.font = Font.boldSystemFont(16)
 
    let tempTxt = w.addText(Celsius + "° C  /  " + Farenheit + "° F")
    tempTxt.textColor = colorTXT()
    tempTxt.font = Font.systemFont(14)
        
    let humidityTxt = w.addText("Humidity: " + Humidity + "%")
    humidityTxt.textColor = colorTXT()
    humidityTxt.font = Font.systemFont(14)
    r4.addSpacer()

    let refreshTxt = w.addText("Data as of: " + Time)
    refreshTxt.textOpacity = .4
    refreshTxt.font = Font.lightSystemFont(8)
    w.addSpacer(1)
    
    // Add Row
    let lastRow = w.addStack()  
    let widgetRefreshTxt = lastRow.addText("Last updated" + new Date().toLocaleTimeString())
    widgetRefreshTxt.textOpacity = .4
    widgetRefreshTxt.font = Font.lightSystemFont(8)
    lastRow.addSpacer()
  }
  else { // Medium
    titleTxt.font = Font.boldSystemFont(20)
       
    let histData = adjustData(hist.values, hoursToShow)
    

    let r1 = w.addStack()
    let r2 = w.addStack()
    let r3 = w.addStack()
    let r4 = w. addStack()

    let r1c1 = r1.addStack()
    let r1c2 = r1.addStack()
    let r2c1 = r2.addStack()
    let r2c2 = r2.addStack()
    let r3c1 = r3.addStack()
    let r3c2 = r3.addStack()  // Second for hours
    let r3c3 = r3.addStack()  // Third stack for Graph
    let r4c1 = r4.addStack()
    let r4c2 = r4.addStack()


    let r1c1Txt = r1c1.addText("IP: " + IP)
    r1c1Txt.textColor = colorTXT()
    r1c1Txt.font = Font.systemFont(16)
    r1c1.addSpacer()

    let r2c1Txt = r2c1.addText(ipDate)
    r2c1Txt.textColor = colorTXT()
    r2c1Txt.font = Font.systemFont(10)
    r2c1Txt.textOpacity = .65
    r2c1.addSpacer()

    let r3c1Txt = r3c1.addText("Dr Brown last seen:")
    r3c1Txt.textColor = colorTXT()
    r3c1Txt.font = Font.systemFont(12)
    r3c1.addSpacer()

    let r4c1Txt = r4c1.addText(getLastSeenDateFromData(drBrownData) + " at " + getLastSeenTimeFromData(drBrownData))
    r4c1Txt.textColor = colorTXT()
    r4c1Txt.font = Font.systemFont(10)
    r4c1Txt.textOpacity = .65
    r4c1.addSpacer()

    let r1c2Txt = r1c2.addText(Celsius + "° C   /   " + Farenheit + "° F")
    r1c2Txt.textColor = colorTXT()
    r1c2Txt.font = Font.systemFont(12)
    r1c2.addSpacer()

    let r2c2Txt = r2c2.addText("Min: " + minTemp(histData) + "° C     Max: " + maxTemp(histData) + "° C")
    r2c2Txt.textColor = colorTXT()
    r2c2Txt.font = Font.systemFont(10)
    r2c2Txt.textOpacity = .65
    r2c2.addSpacer()
    
    // Add hours
    let r3c2Txt = r3c2.addText(hoursToShow.toString() + "H ")
    r3c2Txt.textColor = colorTXT()
    r3c2Txt.font = Font.boldSystemFont(12)
    r3c2Txt.textOpacity = .65
    r3c2.setPadding(3,4,2,0)
    r3c2.borderColor = new Color("#a5a5a5")
    r3c2.borderWidth = .8
    r3c2.cornerRadius = 6
    
    r3c3.addSpacer(4)

    // Add Graph
    let image = columnGraph(histData, imageToDeviceSize(), 18).getImage()
    let img = r3c3.addImage(image)
    img.resizable = false;
    img.rightAlignImage();


    

    let r4c2Txt = r4c2.addText("Humidity: " + Humidity + "%")
    r4c2Txt.textColor = colorTXT()
    r4c2Txt.font = Font.systemFont(10)
    r4c2Txt.textOpacity = .65
    r4c2.addSpacer()
    w.addSpacer()
    

    
    // Refresh labels
    let r1Txt = w.addText("Days with same IP: " + ipSince)
    r1Txt.textOpacity = .4
    r1Txt.font = Font.lightSystemFont(8)
    w.addSpacer(1)
    
    // Add Row
    let lastRow = w.addStack()  
    let lr1Txt = lastRow.addText("Last updated" + new Date().toLocaleTimeString())
    lr1Txt.textOpacity = .4
    lr1Txt.font = Font.lightSystemFont(8)
    lastRow.addSpacer()
  
    let lr2Txt = lastRow.addText("Data as of: " + Time)
    lr2Txt.textOpacity = .4
    lr2Txt.font = Font.lightSystemFont(8)
    lastRow.addSpacer(11)
  }
  return w
}


// FUNCTIONS
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

function adjustData(data, timeframe){
  let items = timeframe * 6
  let divisor = items / 48
  let dSize = data.length
  let nData = []
  let n = 0
  
  for (i = (dSize - items); i < dSize; i+= divisor) {
    nData[n] = data[i][0]

    n++
  }
  return nData
}

function maxTemp(data){
  let dSize = data.length
  let maxT = 0
  for (i = 0; i < dSize; i++) {
    if (data[i] > maxT){
      maxT = data[i]
    }
  }
  return maxT
}

function minTemp(data){
  let dSize = data.length
  let minT = data[dSize - 1]
  for (i = 0; i < dSize; i++) {
    if (data[i] < minT){
      minT = data[i]
    }
  }
  return minT
}

function imageToDeviceSize(){
    if(Device.isPhone()){
        return 110
    }
    else{
        return 117
    }
}

function getLastSeenTimeFromData(data){
  let lastRow = data.values.length
  let ans = data.values[lastRow-1][1]
  return ans
}

function getLastSeenDateFromData(data){
  let lastRow = data.values.length
  let ans = data.values[lastRow-1][0]
  return ans
}

// Graph
function columnGraph(data, width, height) {
  let context = new DrawContext()
  context.size = new Size(width, height)
  context.opaque = false
  let max = Math.max(...data)
  let min = Math.min(...data)
  data.forEach((value, index) => {
    context.setFillColor(new Color('#f2f2f2'))
    let w = (width / data.length) - 2
    let h = (value - min) / (max - min) * height
    let x = (w + 2) * index
    let y = height - h
    let rect = new Rect(x, y, w, h)
    context.fillRect(rect)
  })
  return context
}
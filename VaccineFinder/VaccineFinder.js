// Author: @SenorFernando
// Date: 2021/04/09
// Description: Prompts user for location, saves onto file and query's CVS and Walgreen's sites for appointment availability

// Declaring Directory, City, and State variables
let fm = FileManager.iCloud()
let dir = "/private/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/VaccineFinder/"
let locationFile = "LocationDetails.txt"

let searchCity = ""
let searchState = ""
let pasteAns = ""

// Setup -----------
// Check if location values have been stored
if (!fm.fileExists(dir) || !fm.fileExists(dir + locationFile)){
  let alert = new Alert()
  alert.title = "Please enter your City"
  alert.addTextField("City, ex. El Paso")
  alert.addAction("Submit")
  alert.addCancelAction("Cancel")
  let eventIdx = await alert.presentAlert()
  if (eventIdx == -1) {
    return
  }
  else {
    searchCity = alert.textFieldValue().toUpperCase().trim()
  }
  let alert2 = new Alert()
  alert2.title = "Please enter your state"
  alert2.addTextField("Using 2 letter abbreviation, ex. TX")
  alert2.addAction("Submit")
  alert2.addCancelAction("Cancel")
  eventIdx = await alert2.presentAlert()
  if (eventIdx == -1) {
    return
  }
  else {
    searchState = alert2.textFieldValue().toUpperCase().trim()
    // If state had more than 3 characters alert and exit setup
    if (searchState.length > 2) {
      let alertErr = new Alert()
      alertErr.title = "Error"
      alertErr.message = "Your state entry '" + searchState + "'' had more than 2 characters and we were expecting the abbreviation.\nPlease run the setup again"
      alertErr.addCancelAction("Exit")
      eventIdx = await alertErr.presentAlert()
      if (eventIdx == -1) {
        return
      }
    }
  }
  // Ask if pasteboard is wanted
  let alert3 = new Alert()
  alert3.title = "Pasteboard"
  alert3.message = "Would you like the widget to automatically copy the link for the vaccination provider once it becomes available?\n\nThis will happen even if you don't interact with the widget"
  alert3.addAction("Yes")
  alert3.addAction("No")
  alert3.addCancelAction("Cancel Setup")
  eventIdx = await alert3.presentAlert()
  if (eventIdx == -1) {
    return
  }
  else if (eventIdx == 1) { // Cancel Buton repurposed
    pasteAns = "NoCopy"
  }
  else {
    pasteAns = "Copy"
  }
  // Verify directory exists, if not, create one
  if(!fm.isDirectory(dir)){
    fm.createDirectory(dir)
  }
  // Write to file
  fm.writeString(dir + locationFile, searchCity + "\n" + searchState + "\n" + pasteAns)

  // Thanks Alert
  let alertThanks = new Alert()
  alertThanks.title = "Setup Complete"
  alertThanks.message = "If you need to change your location or pasteboard settings, open your Files app, go to iCloud Drive/Scriptable/VaccineFinder and delete the LocationDetails.txt file"
  alertThanks.addCancelAction("Finish Setup")
  eventIdx = await alertThanks.presentAlert()
  if (eventIdx == -1) {
    return
  }
}

// Read location data from file
let dataread = fm.readString(dir + locationFile)
let datas = dataread.split("\n")
// City
searchCity = datas[0]
// State
searchState = datas[1]
// Pasteboard
pasteAns = datas[2]

// URLs
let cvsURL = "https://www.cvs.com/immunizations/covid-19-vaccine.vaccine-status." + searchState + ".json?vaccineinfo"
let walURL = "https://www.walgreens.com/hcschedulersvc/svc/v1/immunizationLocations/availability"

let mapURL = "https://www.mapquestapi.com/geocoding/v1/address?key=lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24"


// Widget ----------
let widget = await createWidget();
Script.setWidget(widget);

async function createWidget() {
  let w = new ListWidget()
  w.backgroundColor = colorBG()
  // Not sure if refresh rate works but adding it anyways
  var refreshDate = Date.now() + 1000*60*3 // 3 minutes
  w.refreshAfterDate = new Date(refreshDate)

  let titleTXT = "Vaccine Finder"
  let t1 = w.addStack()
  let title = t1.addText(titleTXT)
  title.font = new Font("Helvetica Bold", 22)
  title.textColor = colorTXT()
  title.leftAlignText()    
  t1.addSpacer()

  let locale = t1.addText(searchCity + ", " + searchState)
  locale.font =  new Font("Helvetica Bold", 10)
  locale.textColor = colorTXT()
  locale.textOpacity = .35
  locale.leftAlignText()
  w.addSpacer(5)  

  try{
    const req = new Request(cvsURL);  
    req.headers = {"Referer": "https://www.cvs.com/immunizations/covid-19-vaccine?WT.ac=cvs-storelocator-covid-vaccine-searchpilot"};
    vax = await req.loadJSON();

    // Get today's date for walgreens data
    let todaydatedata = new Date().toISOString().split("T")
    let today = todaydatedata[0].split("-")
    let dateday = parseInt(today[2],10)+1
    let searchDate = today[0] + "-" + today[1] + "-" + datedayleading(dateday)

    // Get city lat & lon for Walgreens search
    const req3 = new Request(mapURL);
    req3.method = "post"
    req3.body = JSON.stringify({"options":{},"location":{"city":searchCity,"state":searchState,"adminArea1":"US"}})
    latlon = await req3.loadJSON()
    let latitude = latlon.results[0].locations[0].latLng.lat
    let longitude = latlon.results[0].locations[0].latLng.lng

    const req2 = new Request(walURL);
    req2.headers = {"Content-Type": "application/json; charset=utf-8", "X-XSRF-TOKEN": "B/vB2UvZfKksfg==.seg11OxSSlCX+YmBCAD4WNuHgW3IjeYj2b/gUZs7hDs=", "Referer": "https://www.walgreens.com/findcare/vaccination/covid-19/location-screening", "Cookie": "XSRF-TOKEN=5sexqFoeWRIzHw==.4/CBlBF6F8BFakNgwK28q2TB0QNZa0NbCTWNbCq2vls=; session_id=b430fd03-bd55-4d70-a1c2-337c153f4839; dtCookie=6$BD1F3AAC11606D012F0D99F8D2C1FAC7|0eed2717dafcc06d|1; ak_bmsc=92412C58EF77788760E2F491531B44E217DF23AC16290000AC2C6F60D8440B0F~plA28cYsbVna0Iz0sdB3PW75VN9qWv3kTeCTKez6OeJxTtz/Xrm4NmbImr2Q8yWn1ce8cEsZrs0aVqdD9FaLzQb/8rH7Cjyxs686ActvljOUow9xXzvrRYqR/jO3yIAVmphNPgnkMZUGBuZaARCix5n15hphNPgVQ7o1N6GcTrHQzHfZ+lRP8mmDT7iHhk2O9kyt54oMD6jlZaaR+9OYRUxM/2NEGBOY6ggR9TBPh1+tXbLm1tLroFEGbHGT2htSn1Te9wFnKDEs8VSyTQ9UiysnkzctygenzmURUGwzwF3mmoGRAM8dljjxGIok00eOWY; akavpau_walgreens=1617904651~id=0495ae6cb91d72b0dfa9ce569ea70dff; bm_sz=896D82520994094B9D48B5B25A1D4AD8~YAAQrCPfF6TYLqp4AQAAq4BGsgvCR8gdiBHSmEgx02WP7gUNOFJH7w7GcIdVMhoWE1Ge6fjo8gpWanfzEV1fwsqGA8pHc5Ocq21BV0uzoB6SF0rahdakU+a42W7XREhLw/bMK0zGzfU8191w4BzIZSXetfn28DR21RRkKJhSaZjoh1F21Y1ND5dDB+bQ5d4zH5mJ; _abck=FA2B09DB1DA51C4A76068900093788EA~0~YAAQrCPfF3SQL6p4AQAA6DmdsgVtNZlaqZh9S6Twe+RiH9KvKuAzTkVbtMwSgVTg8Tsrf4vaME5B2ShNmpFuLKiudfXGLa/wbQbx311xJy1oZ0wnFTrK0KC7JiV7XdAeSswiwCFn85HmnVASP/Jdao1w/mXvG1m/tcS+7LEzm7iZ+ORsreqgFBVo1uhnD0XxryxTO5/2l9tBasEotIOIrQR3Hf1X54OEm6hTnrp7n21l64I0ANeNOROiVVS1iWZBSC499suvy0gabJ4dOZNxEsJR85Kfks6efKtnqMfirpeGsttbmDT0xCyyVGwLSqmBvdlHSDYQIIS4G7jpGQuzmzjmuFHaNlIlfJyRTFzJRHxV5/8zuLeU6SBvIk6r9FliZ+cXbQZ8kgMnOZI7vWb7eQdd9IQSFqkDjrEgiw==~-1~||-1||~-1; bm_mi=375B4D85B4EE5FF9397DA4B1462FE98C~0dHMQCcq7UC1/N7H9SZlB2Q4kj+ZV76E8xHNZtwtRBhUi2XsHBrPKvFzUl8zP8aIqHNaPDRarvVQ1MX3Bwi5GHoSDKABefZXMSZbibK6zsF0z+HhyOJHquqzRQmDuQCd+AGVsNly0Reep5fCOKHz2NYdnktRtiZyKzk8dccODNIZJsgxt/FkoxaMGwqMMG27to1DiBYYxJYzPdvQFTN+fhzRzhe/NqLxsJ8wxKpdgXoRhOct2Y7MjVoK/YpVD2L7rS2LlQi4mSoSi02bpT+W2w==; bm_sv=CEF48300796D83EB2C1435872E3E84FB~wD6diyp2ytI3Z7gHntQNVHmQfM+L0IyVdYGVHVHycYZ+LdwFwsG6mjePmDH9JQKWRc3DGrwByClNBOqprIPWZjBg6426vXSuSrXxAQk9S1GDvXxTfbnDs6594XbBXZlCqMFxBq+79KJnNKNP3aAz+MHVr5lywfsC1YKY3JZgxmw=; wag_sid=wmudagvu2muusgtjfhkeoug8; uts=1617898668861; JSESSIONID=m1pf3eXIKG1ramB05xgr+FIP.p_dotcom86; wag_sc_ss_id=4648554244673452477; Adaptive=true; USER_LOC='sQbCfOufHNFU4+CadapqEUY+rdKMi30OHdfoSgMAWkzTo6c5I8JPZQrWuAua3Rz8EiSHN6+h+3YyljepDa4GcZqHcwTTXUqRMnXxDS8UoIQ4iZ7kJlUBzFu46ndQXp0SlgN8hmdKf6gpShE4lfn4rQ5nIc0MPjnwFmkqENsZ2y/2G+IGCDjc45o719stmmclRx56RV4y8ICmy8FY5MqoBUMLJL9uv0k/78GS+TJ/bORaLgw72sJgBTv5tIHYi3z1xMvhLjFqsLcPK5A7aYolCeCU3raxbxUSYo5VRCj7WZzlJ7vIYh4OU0zuIeiTPlLv9+0YUFL546FzdAnt3OL7FauawDOIRqUOsnHL+CfjxgnKzs7wNgANVg=='; gRxAlDis=N"}    
    req2.body = JSON.stringify({ "serviceId":"99","position":{"latitude":latitude,"longitude":longitude},"appointmentAvailability":{"startDateTime":searchDate},"radius":25});
    req2.method = "post"
    wal = await req2.loadJSON();
  }

  catch(e){
  title.font = Font.boldSystemFont(20)
    let titleMsg = w.addText("No Network  :(")
    titleMsg.textColor = new Color("#333333")
    titleMsg.font = Font.boldSystemFont(20)
    titleMsg.centerAlignText()
    w.addSpacer()
    let refreshTxt = w.addText("Last updated: " + new Date().toLocaleTimeString())
    refreshTxt.textOpacity = .35
    refreshTxt.font = Font.lightSystemFont(8)  
    console.error("Network related error, one of the requests is not working")
    return w
  }

  // Get data from CVS
  // Search for the city on the JSON file
  let cityID = 0
  for (i = 0; i < vax.responsePayloadData.data[searchState].length; i++) {
    if(String(vax.responsePayloadData.data[searchState][i].city) == String(searchCity)){
      cityID = i
    }
  }

  let city = vax.responsePayloadData.data[searchState][cityID].city
  let avail =  vax.responsePayloadData.data[searchState][cityID].status  
  let updated = vax.responsePayloadData.currentTime.split("T")
  let udate = updated[0]
  let utime = updated[1].split(".", 1)
  let uhm = utime[0].split(":", 2)
  let h = parseInt(uhm[0],10)+1
  let m = uhm[1]
  // GET data from Walgreens
  let wres = wal.appointmentsAvailable
  let walAvailable =wavail(wres)
  let radius = wal.radius
  let waldays = wal.days
  
  // Display CVS data
  let locstat = w.addStack()
  let loc = locstat.addText("CVS")
  loc.font = new Font("Helvetica Bold", 16)
  loc.textColor = colorTXT()  
  loc.leftAlignText()
  locstat.addSpacer(70)

  let stat = locstat.addText(avail)
  stat.font = new Font("Helvetica Bold", 16)
  stat.textColor = availcolor(avail)
  stat.leftAlignText()
  locstat.addSpacer()  

  let cons = w.addText("CVS update: " + h + ":" + m + " Mountain Time - City wide data")
  cons.font =  new Font("Helvetica", 10)
  cons.textColor = colorTXT()
  cons.textOpacity = .35
  cons.leftAlignText()  

  if(avail != "Fully Booked" && pasteAns == "Copy"){
    let amsg1 = w.addText("Registration link copied to clipboard")
    amsg1.font = new Font("Helvetica Bold", 10)
    amsg1.textColor = availcolor(avail)
    amsg1.leftAlignText()  
    Pasteboard.copyString("https://www.cvs.com/vaccine/intake/store/cvd-schedule?icid=coronavirus-lp-vaccine-sd-statetool")
    w.addSpacer()  
  }
  else {
    w.addSpacer(10)
  }

  // Display Walgreens data
  let locstat2 = w.addStack()
  let loc2 = locstat2.addText("Walgreens")
  loc2.font = new Font("Helvetica Bold", 16)
  loc2.textColor = colorTXT()  
  loc2.leftAlignText()
  locstat2.addSpacer(23)

  let stat2 = locstat2.addText(walAvailable)
  stat2.font = new Font("Helvetica Bold", 16)
  stat2.textColor = availcolor(walAvailable)
  stat2.leftAlignText()
  locstat2.addSpacer()  

  let wingo = w.addText("For the next " + waldays + " days in a " + radius + " mile radius. No timestamp data provided")
  wingo.font =  new Font("Helvetica", 10)
  wingo.textColor = colorTXT()
  wingo.textOpacity = .35
  wingo.leftAlignText()

  if(walAvailable != "Fully Booked" && pasteAns == "Copy"){
    let amsg2 = w.addText("Registration link copied to clipboard")
    amsg2.font = new Font("Helvetica Bold", 10)
    amsg2.textColor = availcolor(walAvailable)
    amsg2.leftAlignText()    
    Pasteboard.copyString("https://www.walgreens.com/findcare/vaccination/covid-19/location-screening")
    w.addSpacer()
  }
  else {
    w.addSpacer(10)
  }

  // Add widget refresh time stamp
  let refreshTxt = w.addText("Last updated: " + new Date().toLocaleTimeString())
  refreshTxt.textOpacity = .35
  refreshTxt.font = Font.lightSystemFont(8)

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

function datedayleading(dateday){
    if (dateday < 10){
    let m =String("0"+ dateday)
    return m
  }
  else{
    return dateday
  }
}

function wavail(wres){
  if(wres == true){
  return "Available"
  }
  else {
  return "Fully Booked"
  }
}

function availcolor(x) {
  if (x == "Fully Booked"){
  let booked = new Color("#696969")
    return booked
  }
  else {
  let available = new Color("#ffa500")  
  return available
  }
}
Script.complete()
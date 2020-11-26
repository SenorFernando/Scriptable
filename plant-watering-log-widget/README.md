# Plant Watering Log
This is an integration of a Scriptable widget, an IOS Shortcut and Google sheets. The objective is to keep a plant watering log and display the number of days that have passed since the plant was last wattered in a Scriptable widget. Once you physically water your plant, run the IOS shortcut to update the Google sheet

## Setup

You must complete the setup before downloading the Shortcut or running the Scriptable widget


### Google Stuff

##### Google Sheet
Assuming you already have a Google account, create a new empty sheet in [Google Sheets](sheets.google.com)
1. Give your sheet any , I named mine "Log"
2. Click on "Share" and click on "Anyone with the link", then click "Done". This will allow us to update the sheet using the Google scripts
3. Go to File / Spreadsheet settings / Calculation and change "Recalculation" to *On change and every hour*
4. Copy the **sheet ID**, you can find it in the URL. We will use it later
``
https://docs.google.com/spreadsheets/d/**YOURSHEETID**/edit#gid=0
``

**NOTE:** Make sure your Google sheets timezone matches where you are. To verify the correct timezone go to File / Spreadsheet settings

##### Google Script
Two Google scripts are needed for this integration, these scripts *write* on our Google sheet
The first script, *Initializer*, will set up the empty sheet we have created and the second script, *Logger*, will be the script that updates the sheet each time we use the IOS Shortcut

###### Initializer

1. Go to [Google Scripts](https://script.google.com)
2. Click "Create a new project"
3. Add a name to your script, I named it "initializer"
4. Repplace everything on the editor with the [initializer.gs](initializer.gs) code
5. Replace the **YOURSHEETIDHERE** with your Google sheet ID (Keep the quotation marks)
6. Click "Save"
7. Click "Publish" then "Deploy as web app" *It is really important to change the "Who has access to the app" to "Anyone, even anonymous" since this will be called by the IOS Shortcut*
8. Click "Deploy"

*Google will ask for Authorization, click "Review Permissions" and grant access. It might say the app has not been verified, this is expected, click "Advcanced / Go to initializer" and Allow*

8. Copy the web app URL and save the web app ID as we will need it later
``
https://script.google.com/macros/s/YOUR WEB APP ID GOES HERE/exec
``

###### Logger

We will basically follow the same steps as in the Initializer but now we will set up the Logger 

1. Go to [Google Scripts](https://script.google.com/)
2. Click "Create a new project"
3. Add a name to your script, I named it "logger"
4. Repplace everything on the editor with the [logger.gs](logger.gs) code
5. Replace the **YOURSHEETIDHERE** with your Google sheet ID (Keep the quotation marks)
*Note the timezone variable, GMT-5 is Eastern Time, adjust as needed*
6. Click "Save"
7. Click "Publish / Deploy" as web app *It is really important to change the "Who has access to the app" to "Anyone, even anonymous" since this will be called by the IOS Shortcut*

*Google will ask for Authorization, click "Review Permissions" and grant access. It might say the app has not been verified, this is expected, click "Advcanced / Go to logger" and Allow*

8. Copy the web app URL and save the web app ID as we will need it later
``
https://script.google.com/macros/s/YOUR WEB APP ID GOES HERE/exec
``

##### Google API

We will need an API key to *read* from the Google sheet. This requires setting up a OAuth 2.0 Client ID. All required steps are below:

1. Go to [Google API Console](https://console.developers.google.com)
2. If its your first time in the Google API Console, set your Country and agree to terms
2. Click "Create Project"
3. Give a name to your new project, I named it "Sheets" and left organization "No organization", then click "Create"
4. on "Dashboard", click on "Enable APIs and Services", search and select "Google Sheets"
5. Click "Enable"
6. Click "Create Credentials" on the top of the screen
7. Click "OAuth consent screen" on the sidebar
8. User Type: External, click "Create"
9. Add an App Name, I added "PlantLog"
10. Select your Google email address
11. Add a "Developer contact information" email, I added my same Google email as above
12. Click "Save and continue"
13. Click "Save and continue" again
14. Click "Save and continue" one more time
15. Click "Back to dashboard"
16. Click on "Dashboard" on the side bar and then click on "Google Sheets API" on the bottom of the screen
17. Click on "Create credentials" on the top of the screen, then select "Google sheets API" , Javascript and User data
18. Click on "What Credentials do I need"
19. Add a name, I selected "PlantLog"
20. Click "Create OAuth clientID", then click "Done"
21. Click "Create Credentials" on the top of ther screen, click API key

Copy your API key and save it somewhere handy, we will need it later

### Shortcut and Scriptable widget

Now to the easy part
**Note**, dont run the Scriptable widget, the Shortcut will run it the first time as part of the configuration 

* Download the [plant-watering-log-widget](plant-watering-log-widget.js)
* Download the [Plant log entry Shortcut](https://www.icloud.com/shortcuts/42d8fb36c95c4b18a0d47eda7ca9c867), have your initializer web app ID and logger ID handy, they are required during the shortcut Configration process

---

Finally, once you have completed the setup process, add a Scriptable widget and select the *plant-watering-log-widget* and select "Run Script" When Interacting, add a Shortcut and select the *Plant Log Entry* shortcut

The Scriptable widget will display "Alerts are not supported in a widget." disregard, it will clear once the setup is complete

Run the Shortcut to add your plant names and day thresholds, once done, the Shortcut will open the Scriptable widget initial configuration, have your sheet ID and API key at hand

---

## Resetting the Widget / Shortcut

There are several ways to reset the Widget / Shortcut. In order to clear everything to the *factory settings*, follow the [Data refresh](#Data-refresh) section and delte both the Shortcut and Widget

###### Data refresh
If for some reason you need to reset data from the widget, access the Google sheet and clear from **row 7**, the above rows are calculated automatically

###### Plant name and threshold refresh
If you need to refresh the plant names and thresholds then open the Files app, open the Shortcuts folder and delete the plantData.txt file. Run the "Plant Log Entry" Shortcut again

###### Sheet ID & API key
To refresh the Google shet ID and API key, open the Files app, open the Scriptable folder and delete the plantGoogleData.txt file. Run the Scriptable widget again

---

###### All links

[Google Sheets](sheets.google.com)
[Google Scripts](https://script.google.com)
[initializer.gs](initializer.gs)
[logger.gs](logger.gs)
[Google API Console](https://console.developers.google.com)
[plant-watering-log-widget](plant-watering-log-widget.js)
[Plant log entry Shortcut](https://www.icloud.com/shortcuts/42d8fb36c95c4b18a0d47eda7ca9c867) 

---

<img src="plant-watering-log-widget/Log.jpg" alt="Log example" >
<img src="plant-watering-log-widget/Threshold.jpg" alt="Over threshold" >
<img src="plant-watering-log-widget/NoData.jpg" alt="Key error" >
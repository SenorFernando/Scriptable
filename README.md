# Scriptable
Collection of widgets for Scriptable

## Widgets

* [IP Address Widget](#ip-address-widget)
* [Plant Monitor Widget](#plant-monitor-widget)
* [Plant Watering Log Widget](#plant-watering-log-widget)

---
### IP Address Widget
A widget that shows your current external IP Address, IP location city, ISP name.
IP in screenshot is only representative.

[Source](ip-address-widget/currentip.js) 

<img src="ip-address-widget/widget.JPG" alt="IP Address" width="200">

--- 
### Plant Monitor Widget
A widget that pulls information from a local IOT device via JSON and displays it in a widget. 

[Source](plant-monitor-widget/plant-monitor-widget.js) 


<img src="plant-monitor-widget/Good.jpg" alt="Above threshold" width="200"> <img src="plant-monitor-widget/Bad.jpg" alt="Under threshold" width="200"> <img src="plant-monitor-widget/Unreachable.jpg" alt="Host Unreachable" width="200">

--- 
### Plant Watering Log Widget
A widget to track days since last watered plants. This widget should be used in conjunction with the IOS Shortcut "Plant Watering Log" found in the same repository and a specially formatted Google sheet. Displays the date and number of days that have passed.

[Source](plant-watering-log-widget/plant-watering-log-widget.js) 

<img src="plant-watering-log-widget/Log.jpg" alt="Log example" width="200">

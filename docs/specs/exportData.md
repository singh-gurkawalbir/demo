#### selectors we need
```js
const exportStages = {
  parse: 'parse',
  transform: 'tx',
  filter: 'filter',
  sample: 'sample',
};

// stateName: The stage for which the data can be used in an editor. 
const getExportData = (resourceId, stageName) => {
  return {
    status: [requested|received|error],
    data,
  }

const rawData = getExportData('export123');
const rawData = getExportData('export123', exportStates.filter);
}
```

#### actions to dispatch
```js
const dataState =  getExportData('export123');
if (dataState.status !== 'received') {
  // this calls saga to start /api/preview call (in verbose mode)
   dispatch(actions.resource.fetchData(resourceId)); 
}
```



```
THUMB RULE : Work form Add mode and then EDIT Mode 

Rest/Http Cases
----------------
In creation: 
------------
 No raw data
 on click of refresh ... preview call is made with these form details and 'verbose' as true and runOffline options

if(rawData) {
  opts.json.runOfflineOptions = {
              runOffline: true,
              runOfflineSource:  'options',
              rawData: rawData
  }
} else {}
If no rawData ( initially ) we make preview call which hits the end point of export and fetches rawData as part of stages .
If not take parse data from stages as raw data 
Once we get rawData we pass runOfflineSource as 'options' and pass rawData as field
 Point: Rawdata can be JSON, XML, EDI ... 
 We populate rawData in form field 'rawData'
Before all these if user clicks on transform rules? there is no rawData
After preview ? 
Take this rawData field value make transformations , then filters 
On Save , pass rawData field so that it gives back in edit mode

In Edit: 
--------
Get this rawData field from export response which we pass on save before and populate the same in both raw and sampleData fields
If user changes/not rawData and hits preview as we have rawData now , will use runOffline options mode where we pass this custom rawData
if(rawData) {
  opts.json.runOfflineOptions = {
              runOffline: true,
              runOfflineSource:  'options',
              rawData: rawData
  }
} else {}

The above preview call may  include rules . So the output will be the final data after transformations
It will give back parsed data (stage  name: 'parse') which should be shown on 'sampleData' field

Doubts:
1. This infers the data coming from preview 'rawData' may be in any format ( JSON, XML, EDI and so on ). 
How do we show these formats and enable user to modify and play 

FTP Exports :
-----------

 In create Mode: 
 --------------

 User defines file type and uploads any type of file. On upload trigger processor/Processorname depends on the file type we select

 Question: What should we show in rawData and sample data

 In Edit Mode:
 ------------
 Other flow will be same, if we pass rawData on save in create mode. Once edited and saved with updated  rawData , that will be the rawData

 Doubt: What if user wants to get the main export's rawData


For other adapters:
------------------

  In create mode: 
  --------------
  Initially no rawData shown
  When user updates formfields and clicks on preview ( doesnot include raw data) so it talks to api and fetches rawData
  if(rawData) {
  opts.json.runOfflineOptions = {
              runOffline: true,
              runOfflineSource:  'options',
              rawData: rawData
  }
} else {}

In this case if no raw stage , take parse stage as our rawData and the end result will be the sample data field 

In Edit Mode: 
------------
For the first time use rawData field to populate and use in case of transformations
On preview click , update rawData 


Doubts: 
-------
How to differentiate b/w edit of raw data and normal preview on other form field changes - to pass runOfflineOptions

```
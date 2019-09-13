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
#### todo
```txt

1. Move S3 upload sagas into a separate folder with tests
2. Discuss regarding what to show incase of edit file definitions FTP export ( User          supported FDs)
3. Files to be looked - FileDefinition Editor and FileDefinition Select
4. Discuss with Surya on having multiple actions though does the same thing
5. Go through FileDefinition Sagas and Sample Data Sagas to clean up unwanted code
6. Go through different kind of exports in Ampersand and cross verify different fields       and impacts 
7. Play with Flow builder to get the gist of Sample data handling in Ampersand application
```
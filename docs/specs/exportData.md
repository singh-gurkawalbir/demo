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
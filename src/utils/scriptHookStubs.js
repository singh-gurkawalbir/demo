/*
 * Below are the set of Stubs injected into the Javascript Editor when requested for a specific hookStage
 * Supported Stubs are :
 * preSavePage,
 * preMap,
 * postMap,
 * postResponseMap,
 * postSubmit,
 * postAggregate,
 * contentBasedFlowRouter,
 * transform,
 * filter,
 * step,
 * update
 * handleRequest
 * router
 */

const preSavePageFunctionStub = `
/*
* preSavePageFunction stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one 'options' argument that has the following fields:
*   'data' - an array of records representing one page of data. A record can be an object {} or array [] depending on the data source.
*   'files' - file exports only. files[i] contains source file metadata for data[i]. i.e. files[i].fileMeta.fileName.
*   'errors' - an array of errors where each error has the structure {code: '', message: '', source: '', retryDataKey: ''}.
*   'retryData' - a dictionary object containing the retry data for all errors: {retryDataKey: { data: <record>, stage: '', traceKey: ''}}.
*   '_exportId' - the _exportId currently running.
*   '_connectionId' - the _connectionId currently running.
*   '_flowId' - the _flowId currently running.
*   '_integrationId' - the _integrationId currently running.
*   'pageIndex' - 0 based. context is the batch export currently running.
*   'lastExportDateTime' - delta exports only.
*   'currentExportDateTime' - delta exports only.
*   'settings' - all custom settings in scope for the export currently running.
*
* The function needs to return an object that has the following fields:
*   'data' - your modified data.
*   'errors' - your modified errors.
*   'abort' - instruct the batch export currently running to stop generating new pages of data.
*   'newErrorsAndRetryData' - return brand new errors linked to retry data: [{retryData: <record>, errors: [<error>]}].
* Throwing an exception will signal a fatal error and stop the flow.
*/
function preSavePage (options) {
  // sample code that simply passes on what has been exported
  return {
    data: options.data,
    errors: options.errors,
    abort: false,
    newErrorsAndRetryData: []
  }
}`;
const preMapFunctionStub = `/*
* preMapFunction stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one ‘options’ argument that has the following fields:
*   ‘data’ - an array of records representing the page of data before it has been mapped.  A record can be an object {} or array [] depending on the data source.
*   '_importId' - the _importId currently running.
*   '_connectionId' - the _connectionId currently running.
*   '_flowId' - the _flowId currently running.
*   '_integrationId' - the _integrationId currently running.
*   'settings' - all custom settings in scope for the import currently running.
*
* The function needs to return an array, and the length MUST match the options.data array length.
* Each element in the array represents the actions that should be taken on the record at that index.
* Each element in the array should have the following fields:
*   'data' - the modified/unmodified record that should be passed along for processing.
*   'errors' -  used to report one or more errors for the specific record.  Each error must have the following structure: {code: '', message: '', source: ‘’ }
* Returning an empty object {} for a specific record will indicate that the record should be ignored.
* Returning both 'data' and 'errors' for a specific record will indicate that the record should be processed but errors should also be logged.
* Throwing an exception will fail the entire page of records.
*/
function preMap (options) {
  return options.data.map((d) => {
    return {
      data: d
    }
  })
}`;
const postMapFunctionStub = `/*
* postMapFunction stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one argument ‘options’ that has the following fields:
*   ‘preMapData’ - an array of records representing the page of data before it was mapped.  A record can be an object {} or array [] depending on the data source.
*   ‘postMapData’ - an array of records representing the page of data after it was mapped.  A record can be an object {} or array [] depending on the data source.
*   '_importId' - the _importId currently running.
*   '_connectionId' - the _connectionId currently running.
*   '_flowId' - the _flowId currently running.
*   '_integrationId' - the _integrationId currently running.
*   'settings' - all custom settings in scope for the import currently running.
*
* The function needs to return an array, and the length MUST match the options.data array length.
* Each element in the array represents the actions that should be taken on the record at that index.
* Each element in the array should have the following fields:
*   'data' - the modified/unmodified record that should be passed along for processing.
*   'errors' - used to report one or more errors for the specific record.  Each error must have the following structure: {code: '', message: '', source: ‘’ }
* Returning an empty object {} for a specific record will indicate that the record should be ignored.
* Returning both 'data' and 'errors' for a specific record will indicate that the record should be processed but errors should also be logged.
* Throwing an exception will fail the entire page of records.
*/
function postMap (options) {
  return options.postMapData.map((d) => {
    return {
      data: d
    }
  })
}`;
const postSubmitFunctionStub = `/*
* postSubmitFunction stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one ‘options’ argument that has the following fields:
*  ‘preMapData’ - an array of records representing the page of data before it was mapped.  A record can be an object {} or array [] depending on the data source.
*  ‘postMapData’ - an array of records representing the page of data after it was mapped.  A record can be an object {} or array [] depending on the data source.
*  ‘responseData’ - an array of responses for the page of data that was submitted to the import application.  An individual response will have the following fields:
*    ‘statusCode’ - 200 is a success.  422 is a data error.  403 means the connection went offline.
*    ‘errors’ - [{code: '', message: '', source: ‘’}]
*    ‘ignored’ - true if the record was filtered/skipped, false otherwise.
*    ‘id’ - the id from the import application response.
*    ‘_json’ - the complete response data from the import application.
*    ‘dataURI’ - if possible, a URI for the data in the import application (populated only for errored records).
*  '_importId' - the _importId currently running.
*  '_connectionId' - the _connectionId currently running.
*  '_flowId' - the _flowId currently running.
*  '_integrationId' - the _integrationId currently running.
*  'settings' - all custom settings in scope for the import currently running.
*
* The function needs to return the responseData array provided by options.responseData. The length of the responseData array MUST remain unchanged.  Elements within the responseData array can be modified to enhance error messages, modify the complete _json response data, etc...
* Throwing an exception will fail the entire page of records.
*/
function postSubmit (options) {
  return options.responseData
}`;
const postAggregateFunctionStub = `/*
* postAggregateFunction stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one ‘options’ argument that has the following fields:
*   ‘postAggregateData’ - a container object with the following fields:
*     ‘success’ - true if data aggregation was successful, false otherwise.
*     ‘_json’ - information about the aggregated data transfer.  For example, the name of the aggregated file on the FTP site.
*     ‘code’ - error code if data aggregation failed.
*     ‘message’ - error message if data aggregation failed.
*     ‘source’ - error source if data aggregation failed.
*   '_importId' - the _importId currently running.
*   '_connectionId' - the _connectionId currently running.
*   '_flowId' - the _flowId currently running.
*    '_integrationId' - the _integrationId currently running.
*   'settings' - all custom settings in scope for the import currently running.
*
* The function doesn't need a return value.
* Throwing an exception will signal a fatal error.
*/

function postAggregate (options) {
}`;
const postResponseMapFunctionStub = `/*
* postResponseMapFunction stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one 'options' argument that has the following fields:
*    'postResponseMapData' - an array of records representing the page of data after response mapping is completed. A record can be an object {} or array [] depending on the data source.
*    'responseData' - the array of responses for the page of data.  An individual response will have the following fields:
*        'statusCode' - 200 is a success.  422 is a data error.  403 means the connection went offline.
*        'errors' - [{code: '', message: '', source: ''}]
*        'ignored' - true if the record was filtered/skipped, false otherwise.
*        'data' - exports only.  the array of records returned by the export application.
*        'id' - imports only.  the id from the import application response.
*        '_json' - imports only.  the complete response data from the import application.
*        'dataURI' - imports only.  a URI for the data in the import application (populated only for errored records).
*    'oneToMany' - as configured on your export/import resource.
*    'pathToMany' - as configured on your export/import resource.
*    '_exportId' - the _exportId currently running.
*    '_importId' - the _importId currently running.
*    '_connectionId' - the _connectionId currently running.
*    '_flowId' - the _flowId currently running.
*    '_integrationId' - the _integrationId currently running.
*    'settings' - all custom settings in scope for the export/import currently running.
*
* The function needs to return the postResponseMapData array provided by options.postResponseMapData.  The length of postResponseMapData MUST remain unchanged.  Elements within postResponseMapData can be changed however needed.

* Throwing an exception will signal a fatal error and fail the entire page of records.
*/

function postResponseMap (options) {
 return options.postResponseMapData
}`;
const contentBasedFlowRouterFunctionStub = `/*
* contentBasedFlowRouter stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one ‘options’ argument that has the following fields:
*   ‘httpHeaders’ - A JSON object containing the http headers received in the request from the trading partner.
*                   For example: { as2-from: 'OpenAS2_appA', as2-to: 'OpenAS2_appB' }
*   ‘mimeHeaders’ - A JSON object containing the mime headers from the mime part containing EDI message.
*                   For example: {  content-type:application/edi-x12, content-disposition: Attachment; filename=rfc1767.dat }
*   ‘rawMessageBody’ - A String containing unencrypted edi/xml content.
*
* The function needs to return an object containing '_flowId' and '_exportId' as properties of the flow that should be run.
* To signal a failure throw an exception.
*/
function contentBasedFlowRouter (options) {
  let returnObj = {
    _flowId: <_flowId>, // _flowId is mandatory for downstream processing, do not delete.
    _exportId: <_exportId> // the '_id' of the listener that should be run.
  }
  return returnObj
}`;
const transformFunctionStub = `/*
* transformFunction stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one 'options' argument that has the following fields:
*   'record' - object {} or array [] depending on the data source.
*   'settings' - all custom settings in scope for the transform currently running.
* The function needs to return the transformed record.
* Throwing an exception will return an error for the record.
*/
function transform (options) {
  return options.record
}`;
const filterFunctionStub = `/*
* filterFunction stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one 'options' argument that has the following fields:
*   'record' - object {} or array [] depending on the data source.
*   'pageIndex' - 0 based. context is the batch export currently running.
*   'lastExportDateTime' - delta exports only.
*   'currentExportDateTime' - delta exports only.
*   'settings' - all custom settings in scope for the filter currently running.
* The function needs to return true or false.  i.e. true indicates the record should be processed.
* Throwing an exception will return an error for the record.
*/
function filter (options) {
  return true
}`;
const stepFunctionStub = `/*
* step function stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one 'options' argument that has the following fields:
*   \`formSubmission\` - form steps only.
*   \`_connectionId\` - connection steps only.
*   'resource' - the resource being installed/uninstalled.
*   'license' - integration apps only. the license provisioned to the integration.
*
* The function does not need to return anything.
* Throwing an exception will signal an error.
*/
function step (options) {
  // your code
}`;
const updateFunctionStub = `/*
* update function stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one 'options' argument that has the following fields:
*   'resource' - the resource being updated.
*   'license' - integration apps only. the license provisioned to the integration.
*
* The function does not need to return anything.
* Throwing an exception will signal an error.
*/
function update (options) {
  // your code
}`;
const formInitFunctionStub = `/*
* formInit function stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one 'options' argument that has the following fields:
*   'resource' - the resource being viewed in the UI.
*   'parentResource' - the parent of the resource being viewed in the UI.
*   'grandparentResource': the grandparent of the resource being viewed in the UI.
*   'license' - integration apps only.  the license provisioned to the integration.
*   'parentLicense' - integration apps only. the parent of the license provisioned to the integration.
*   'sandbox' - boolean value indicating whether the script is invoked for sandbox.
*
* The function needs to return a form object for the UI to render.
* Throwing an exception will signal an error.
*/
function formInit (options) {
  return options.resource.settingsForm.form
}`;
const handleRequestFunctionStub = `/*
* handleRequest function stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one 'options' argument that has the following fields:
*   'method' - http request method (uppercase string).
*   'headers' - http request headers (object).
*   'queryString' - http request query string (object).
*   'body' - parsed http request body (object, or undefined if unable to parse).
*   'rawBody' - raw http request body (string).
*
* The function needs to return a response object that has the following fields:
*   ‘statusCode’ - http response status code (number).
*   'headers' - http response headers overrides (object, optional).
*   'body' - http response body (string or object).
* Throwing an exception will signal an error.
*/
function handleRequest (options) {
  return {
    statusCode: 200,
    headers: { },
    body: options.body
  }
}`;
const branchingFunctionStub = `/*
* branchingFunction stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one 'options' argument that has the following fields:
*   'record' - object {} or array [] depending on the data source.
*   'settings' - all custom settings in scope for the router currently running.
* The function needs to return an array of integers representing the branch indices that should process the record.
* Throwing an exception will return an error for the record.
*/
function branching (options) {
  return [0]
}
`;

export default {
  preSavePage: preSavePageFunctionStub,
  preMap: preMapFunctionStub,
  postMap: postMapFunctionStub,
  postSubmit: postSubmitFunctionStub,
  postAggregate: postAggregateFunctionStub,
  contentBasedFlowRouter: contentBasedFlowRouterFunctionStub,
  postResponseMap: postResponseMapFunctionStub,
  transform: transformFunctionStub,
  filter: filterFunctionStub,
  step: stepFunctionStub,
  update: updateFunctionStub,
  formInit: formInitFunctionStub,
  handleRequest: handleRequestFunctionStub,
  router: branchingFunctionStub,
};

export const HOOKS_IN_IMPORT_EXPORT_RESOURCE = [
  'preSavePage',
  'preMap',
  'postMap',
  'postSubmit',
  'postAggregate',
  'postResponseMap',
];

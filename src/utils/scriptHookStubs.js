/*
 * Below are the set of Stubs injected into the Javascript Editor when requested for a specific hookStage
 * Supported Stubs are :
 * preSavePage,
 * preMap,
 * postMap,
 * postResponseMap,
 * postSubmit,
 * postAggregate,
 * contentBasedFlowRouter
 */

const preSavePageFunctionStub = ` 
/*
* preSavePageFunction stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one 'options' argument that has the following fields:
* 'data' - an array of records representing one page of data. An individual record can be an object {}, or an array [] depending on the data source.
* 'errors' - an array of errors where each error has the structure {code: '', message: '', source: ''}.
* '_exportId' - the _exportId currently running.
* '_connectionId' - the _connectionId currently running.
* '_flowId' - the _flowId currently running.
* '_integrationId' - the _integrationId currently running.
* 'pageIndex' - 0 based. context is the batch export currently running.
* 'lastExportDateTime' - delta exports only.
* 'currentExportDateTime' - delta exports only.
* 'settings' - all the custom settings associated with the export currently running.
*
* The function needs to return an object that has the following structure: { data: [], errors: [{code: '', message: '', source: ''}], abort: true|false }
* 'data' - your modified data.
* 'errors' - your modified errors.
* 'abort' - instruct the batch export currently running to stop generating new pages of data.
* Throwing an exception will signal a fatal error and stop the flow.
*/
function preSavePageFunction (options) {
  // sample code that simply passes on what has been exported
  return {
    data: options.data,
    errors: options.errors,
    abort: false
  }
}`;
const preMapFunctionStub = `/*
* preMapFunction stub:
*
* The name of the function can be changed to anything you like.
* 
* The function will be passed one 'options' argument that has the following structure: { data: [], settings: {}, configuration: {} }
*     'data' - an array of records representing the page of data before it has been mapped.  An individual record can be an object {}, or an array [] depending on the data source.
*     'settings' - a container object for all the SmartConnector settings associated with the integration (applicable to SmartConnectors only).
*     'configuration' - an optional configuration object that can be set directly on the import resource (to further customize the hooks behavior).
*     '_importId' - the _importId of the import for which the hook is defined.
*     '_connectionId' - the _id of the connection linked to the import for which the hook is defined.
*     '_flowId' - the _id of the flow linked to the import for which the hook is defined.
*     '_integrationId' - the _id of the integration linked to the import for which the hook is defined.
*
* The function needs to return an array that has the following structure: [ { }, { }, ... ]
* The returned array length MUST match the options.data array length.
* Each element in the array represents the actions that should be taken on the record at that index.
* Each element in the array should have the following structure: { data: {}/[], errors: [{code: '', message: '', source: ''}] }
*     'data' - The modified (or unmodified) record that should be passed along for processing.  An individual record can be an object {} or an array [] depending on the data source.
*     'errors' -  Used to report one or more errors for the specific record.  Each error must have the following structure: {code: '', message: '', source: '' }
* Returning an empty object {} for a specific record will indicate to integrator.io that the record should be ignored.  
* Returning both 'data' and 'errors' for a specific record will indicate to integrator.io that the record should be processed but errors should also be logged on the job.
* Examples: {}, {data: {}}, {data: []}, {errors: [{code: '', message: '', source: ''}]}, {data: {}, errors: [{code: '', message: '', source: ''}]}
* Throwing an exception will fail the entire page of records.
*/
function preMapFunction(options) {
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
* The function will be passed one argument 'options' that has the following structure: { preMapData: [], postMapData: [], settings: {}, configuration: {} }
*     'preMapData' - an array of records representing the page of data before it was mapped.  An individual record can be an object {}, or an array [] depending on the data source.
*     'postMapData' - an array of records representing the page of data after it was mapped.  An individual record can be an object {}, or an array [] depending on the data source.
*     'settings' - a container object for all the SmartConnector settings associated with the integration (applicable to SmartConnectors only).
*     'configuration' - an optional configuration object that can be set directly on the import resource (to further customize the hooks behavior).
*     '_importId' - the _importId of the import for which the hook is defined.
*     '_connectionId' - the _id of the connection linked to the import for which the hook is defined.
*     '_flowId' - the _id of the flow linked to the import for which the hook is defined.
*     '_integrationId' - the _id of the integration linked to the import for which the hook is defined.
*
* The function needs to return an array that has the following structure: [ { }, { }, ... ]
* The returned array length MUST match the options.data array length.
* Each element in the array represents the actions that should be taken on the record at that index.
* Each element in the array should have the following structure: { data: {}/[], errors: [{code: '', message: '', source: ''}] }
*     'data' - The modified (or unmodified) record that should be passed along for processing.  An individual record can be an object {} or an array [] depending on the data source.
*     'errors' - Used to report one or more errors for the specific record.  Each error must have the following structure: {code: '', message: '', source: '' }
* Returning an empty object {} for a specific record will indicate to integrator.io that the record should be ignored. 
* Returning both 'data' and 'errors' for a specific record will indicate to integrator.io that the record should be processed but errors should also be logged on the job.
* Examples: {}, {data: {}}, {data: []}, {errors: [{code: '', message: '', source: ''}]}, {data: {}, errors: [{code: '', message: '', source: ''}]}
* Throwing an exception will fail the entire page of records.
*/
function postMapFunction(options) {
 return options.data.map((d) => {
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
* The function will be passed one 'options' argument that has the following structure: { preMapData: [], postMapData: [], responseData: [], settings: {}, configuration: {} }
*     'preMapData' - an array of records representing the page of data before it was mapped.  An individual record can be an object {}, or an array [] depending on the data source.
*     'postMapData' - an array of records representing the page of data after it was mapped.  An individual record can be an object {}, or an array [] depending on the data source.
*     'responseData' - an array of responses for the page of data that was submitted to the import application.  An individual response will have the following structure: { statusCode: 200/422/401, errors: [], ignored: true/false, id: '', _json: {}, dataURI: '' }
*         'statusCode' - 200 is a success.  422 is a data error.  401 means the connection went offline (typically due to an authentication or incorrect password issue).
*         'errors' - [{code: '', message: '', source: ''}]
*         'ignored' - true if the record was filtered/skipped, false otherwise.
*         'id' - the id from the import application response.
*         '_json' - the complete response data from the import application.
*         'dataURI' - if possible, a URI for the data in the import application (populated only for errored records).
*         'settings' - a container object for all the SmartConnector settings associated with the integration (applicable to SmartConnectors only).
*         'configuration' - an optional configuration object that can be set directly on the import resource (to further customize the hooks behavior).
*     '_importId' - the _importId of the import for which the hook is defined.
*     '_connectionId' - the _id of the connection linked to the import for which the hook is defined.
*     '_flowId' - the _id of the flow linked to the import for which the hook is defined.
*     '_integrationId' - the _id of the integration linked to the import for which the hook is defined.
*
* The function needs to return the responseData array provided by options.responseData. The length of the responseData array MUST remain unchanged.  Elements within the responseData array can be modified to enhance error messages, modify the complete _json response data, etc...
* Throwing an exception will fail the entire page of records.
*/
function postSubmitFunction(options) {
 return options.responseData
}`;
const postAggregateFunctionStub = `/*
* postAggregateFunction stub:
*
* The name of the function can be changed to anything you like.
* 
* The function will be passed one 'options' argument that has the following structure: { postAggregateData: {}, settings: {},  configuration: {} } 
*     'postAggregateData' - a container object with the following structure: { success: true/false, _json: {} }
*         'success' - true if data aggregation was successful, false otherwise.
*         '_json' - information about the aggregated data transfer.  For example, the name of the aggregated file on the FTP site.
*         'code' - error code if data aggregation failed. 
*         'message' - error message if data aggregation failed. 
*         'source' - error source if data aggregation failed. 
*     'settings' - a container object for all the SmartConnector settings associated with the integration (applicable to SmartConnectors only).
*     'configuration' - an optional configuration object that can be set directly on the export resource (to further customize the hooks behavior).
*     '_importId' - the _importId of the import for which the hook is defined.
*     '_connectionId' - the _id of the connection linked to the import for which the hook is defined.
*     '_flowId' - the _id of the flow linked to the import for which the hook is defined.
*     '_integrationId' - the _id of the integration linked to the import for which the hook is defined.
*
* The function doesn't need a return value.
* Throwing an exception will signal a fatal error.
*/
function postAggregateFunction(options) {
}`;
const postResponseMapFunctionStub = `/*
* postResponseMapFunction stub:
*
* The name of the function can be changed to anything you like.
*
* The function will be passed one 'options' argument that has the following structure: { postResponseMapData: [], responseData: [], oneToMany: true/false, pathToMany: '' }
*    'postResponseMapData' - an array of records representing the page of data after response mapping is completed. An individual record can be an object {}, or an array [] depending on the data source.
*    'responseData' - an array of responses for the page of data.  An individual response will have the following structure: { statusCode: 200/422/401, errors: [], ignored: true/false, data: [], id: '', _json: {}, dataURI: '' }.
*        'statusCode' - 200 is a success.  422 is a data error.  401 means the connection went offline (typically due to an authentication or incorrect password issue).
*        'errors' - [{code: '', message: '', source: ''}]
*        'ignored' - true if the record was filtered/skipped, false otherwise.
*        'data' - exports only.  the array of records returned by the export application.
*        'id' - imports only.  the id from the import application response.
*        '_json' - imports only.  the complete response data from the import application.
*        'dataURI' - imports only.  a URI for the data in the import application (populated only for errored records).
*    'oneToMany' - as configured on your export/import resource.
*    'pathToMany' - as configured on your export/import resource.  
*     '_importId' - the _importId of the import for which the hook is defined.
*     '_connectionId' - the _id of the connection linked to the import for which the hook is defined.
*     '_flowId' - the _id of the flow linked to the import for which the hook is defined.
*     '_integrationId' - the _id of the integration linked to the import for which the hook is defined.
*
* The function needs to return the postResponseMapData array provided by options.postResponseMapData.  The length of postResponseMapData MUST remain unchanged.  Elements within postResponseMapData can be changed however needed.
* Throwing an exception will signal a fatal error and fail the entire page of records.
*/
function postResponseMapFunction(options) {
 return options.postResponseMapData
}`;
const contentBasedFlowRouterFunctionStub = `/*
* contentBasedFlowRouter stub:
*
* The name of the function can be changed to anything you like.

* The function will be passed one ‘options’ argument that has the following structure: { httpHeaders: {}, mimeHeaders: {}, rawMessageBody: <string> }
*  httpHeaders - A JSON object containing the http headers received in the request from the trading partner. For example: { as2-from: 'OpenAS2_appA', as2-to: 'OpenAS2_appB' } 
*  mimeHeaders - A JSON object containing the mime headers from the mime part containing EDI message. For example: {  content-type:application/edi-x12, content-disposition: Attachment; filename=rfc1767.dat }
*  rawMessageBody - A String containing unencrypted edi/xml content.

* The function needs to return the '_id' of the flow that should be run.
* To signal a failure throw an exception.
*/
function contentBasedFlowRouter (options) {
  	let _id = null
	return _id
}`;
const transformFunctionStub = `/*
* transformFunction stub:
*
* The name of the function can be changed to anything you like.
* 
* The function will be passed a single record and simply needs to return a single record.
* Throwing an exception will return an error for the record.
*/
function transformFunction(record) {
 return record
}`;
const filterFunctionStub = `/*
* filterFunction stub:
*
* The name of the function can be changed to anything you like.
* 
* The function will be passed a single record and simply needs to return truthy or falsy.
* Truthy indicates the record should be processed, and falsy indicates the record should be ignored.
* Throwing an exception will return an error for the record.
*/
function filterFunction(record) {
 return true
}`;

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
};

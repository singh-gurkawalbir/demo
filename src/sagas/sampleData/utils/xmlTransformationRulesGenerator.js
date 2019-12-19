import { call, select, put } from 'redux-saga/effects';
import {
  resourceData,
  resourceFormState,
  getResourceSampleDataWithStatus,
} from '../../../reducers';
import { isFileAdaptor, adaptorTypeMap } from '../../../utils/resource';
import actions from '../../../actions';
import { generateTransformationRulesOnXMLData } from '../../../utils/sampleData';
import { parseFileData } from './fileParserUtils';
import { pageProcessorPreview, exportPreview } from './previewCalls';
import { getPreviewStageData } from '../../../utils/flowData';

/*
 * Incase of File adaptors XML type, fetch sampleData from the state that has uploaded XML file
 * Parse XML content to JSON to get sampleData
 */
function* getXmlFileAdaptorSampleData({ resource, newResourceId }) {
  const { data: sampleData } = yield select(
    getResourceSampleDataWithStatus,
    newResourceId,
    'raw'
  );

  if (!sampleData || !sampleData.body) return;
  const processedData = yield call(parseFileData, {
    sampleData: sampleData.body,
    resource,
  });

  // processor calls return data wrapped inside 'data' array
  return processedData && processedData.data && processedData.data[0];
}

/*
 * Incase of Http SuccessMediaType XML, we make a preview call and get sample data for the same
 */
function* getXmlHttpAdaptorSampleData({ resource, newResourceId }) {
  if (resource.isLookup) {
    // Make a pageProcessorPreview call incase of a lookup
    const { flowId } = yield select(
      resourceFormState,
      'exports',
      newResourceId
    );
    const pageProcessorPreviewData = yield call(pageProcessorPreview, {
      flowId,
      _pageProcessorId: newResourceId,
      previewType: 'raw',
      hidden: true,
    });

    return pageProcessorPreviewData;
  }

  // Basic Exports preview call to fetch sample data
  const exportPreviewData = yield call(exportPreview, {
    resourceId: newResourceId,
    hidden: true,
  });

  // parse stage of preview data contains JSON sample data
  return exportPreviewData && getPreviewStageData(exportPreviewData, 'parse');
}

/*
 * Patches transformation rules incase of either a XML File export / Http XML Media type Export
 */
export default function* patchTransformationRulesForXMLResource({
  resourceId: newResourceId,
}) {
  const { merged: resource = {} } = yield select(
    resourceData,
    'exports',
    newResourceId,
    'value'
  );
  const isXmlFileAdaptor =
    isFileAdaptor(resource) && resource.file.type === 'xml';
  const isXmlHttpAdaptor =
    adaptorTypeMap[resource.adaptorType] === 'http' &&
    resource.http.successMediaType === 'xml';

  if (!isXmlFileAdaptor && !isXmlHttpAdaptor) {
    return;
  }

  // Calls related saga for XML/FileAdaptor type
  // newResourceId is a temporary Id which is not part of 'resource' fetched from patches. So need to send explicitly
  const convertedXmlToJSON = isXmlFileAdaptor
    ? yield call(getXmlFileAdaptorSampleData, { resource, newResourceId })
    : yield call(getXmlHttpAdaptorSampleData, { resource, newResourceId });

  if (!convertedXmlToJSON) return;

  const value = {
    rules: generateTransformationRulesOnXMLData(convertedXmlToJSON),
    version: '1',
  };
  const patchSet = [{ op: 'replace', path: '/transform', value }];

  yield put(actions.resource.patchStaged(newResourceId, patchSet, 'value'));
}

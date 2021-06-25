import { call, select, put } from 'redux-saga/effects';
import { selectors } from '../../../reducers';
import { isFileAdaptor, adaptorTypeMap } from '../../../utils/resource';
import actions from '../../../actions';
import { generateTransformationRulesOnXMLData } from '../../../utils/sampleData';
import { parseFileData } from './fileParserUtils';
import { pageProcessorPreview, exportPreview } from './previewCalls';
import { getPreviewStageData } from '../../../utils/flowData';
import { SCOPES } from '../../resourceForm';
import { emptyObject } from '../../../utils/constants';

/*
 * Incase of File adaptors XML type, fetch sampleData from the state that has uploaded XML file
 * Parse XML content to JSON to get sampleData
 */
export function* _getXmlFileAdaptorSampleData({ resource, newResourceId }) {
  if (!resource || !newResourceId) return;

  const { data: sampleData } = yield select(
    selectors.getResourceSampleDataWithStatus,
    newResourceId,
    'raw'
  );

  if (!sampleData || !sampleData.body) return;
  const processedData = yield call(parseFileData, {
    sampleData: sampleData.body,
    resource,
  });

  // processor calls return data wrapped inside 'data' array
  return processedData?.data?.[0];
}

/*
 * Incase of Http SuccessMediaType XML, we make a preview call and get sample data for the same
 */
export function* _getXmlHttpAdaptorSampleData({ resource, newResourceId }) {
  if (!resource || !newResourceId) return;

  const { flowId } = yield select(
    selectors.resourceFormState,
    'exports',
    newResourceId
  );

  if (resource.isLookup) {
    // Make a pageProcessorPreview call incase of a lookup
    const pageProcessorPreviewData = yield call(pageProcessorPreview, {
      flowId,
      _pageProcessorId: resource._id,
      previewType: 'raw',
      hidden: true,
    });

    return pageProcessorPreviewData;
  }

  // Basic Exports preview call to fetch sample data
  const exportPreviewData = yield call(exportPreview, {
    resourceId: resource._id,
    hidden: true,
    flowId,
  });

  // parse stage of preview data contains JSON sample data
  return exportPreviewData && getPreviewStageData(exportPreviewData, 'parse');
}

/*
 * Patches transformation rules incase of either a XML File export / Http XML Media type Export
 */
export default function* saveTransformationRulesForNewXMLExport({
  resourceId,
  tempResourceId,
}) {
  const resource = (yield select(
    selectors.resourceData,
    'exports',
    resourceId,
    SCOPES.VALUE
  ))?.merged || emptyObject;

  const isXmlFileAdaptor =
    isFileAdaptor(resource) && resource.file?.type === 'xml';
  const isXmlHttpAdaptor =
    adaptorTypeMap[resource.adaptorType] === 'http' &&
    resource.http?.successMediaType === 'xml';

  // Other than XML File Adaptor / XML Http Adaptor , we don't need to patch
  // Also for Data loader flows no need to patch though XML file is uploaded
  if (!isXmlFileAdaptor && !isXmlHttpAdaptor) {
    return;
  }

  // Calls related saga for XML/FileAdaptor type
  // newResourceId is a temporary Id which is not part of 'resource' fetched from patches. So need to send explicitly
  const convertedXmlToJSON = isXmlFileAdaptor
    ? yield call(_getXmlFileAdaptorSampleData, {
      resource,
      newResourceId: tempResourceId,
    })
    : yield call(_getXmlHttpAdaptorSampleData, {
      resource,
      newResourceId: tempResourceId,
    });

  if (!convertedXmlToJSON) return;

  const value = {
    rules: generateTransformationRulesOnXMLData(convertedXmlToJSON),
    version: '1',
  };
  const patchSet = [{ op: 'replace', path: '/transform', value }];

  yield put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.VALUE));
  yield put(actions.resource.commitStaged('exports', resourceId, SCOPES.VALUE));
}

import { call, select, put } from 'redux-saga/effects';
import { evaluateExternalProcessor } from '../../../sagas/editor';
import { apiCallWithRetry } from '../../index';
import {
  resourceData,
  getResourceSampleDataWithStatus,
} from '../../../reducers';
import { isFileAdaptor } from '../../../utils/resource';
import actions from '../../../actions';
import { generateTransformationRulesOnXMLData } from '../../../utils/sampleData';
/*
 * Below sagas are Parser sagas for resource sample data
 */

const PARSERS = {
  csv: 'csvParser',
  xlsx: 'csvParser',
  xml: 'xmlParser',
};

export function* parseFileData({ sampleData, resource }) {
  const { file } = resource;
  const { type } = file;
  const options = file[type] || {};
  const processorData = {
    data: sampleData,
    processor: PARSERS[type],
    ...options,
  };

  try {
    const processedData = yield call(evaluateExternalProcessor, {
      processorData,
    });

    return processedData;
  } catch (e) {
    // Handle errors
    return {};
  }
}

/*
 * Given Sample data and fileDefinitionId , parses based on saved rules and returns JSON
 */
export function* parseFileDefinition({ sampleData, resource }) {
  const { file = {} } = resource;
  const { _fileDefinitionId } = file.fileDefinition || {};

  if (!_fileDefinitionId || !sampleData) return {};

  try {
    const parsedFileDefinitionData = yield call(apiCallWithRetry, {
      path: `/fileDefinitions/parse?_fileDefinitionId=${_fileDefinitionId}`,
      opts: {
        method: 'POST',
        body: {
          data: sampleData,
          _fileDefinitionId,
        },
      },
      message: `Fetching flows Preview`,
      hidden: true,
    });

    return parsedFileDefinitionData;
  } catch (e) {
    // Handle errors
    return {};
  }
}

/*
 * Patches transformation rules incase of a New XML Export
 */
export function* patchTransformationRulesForXMLResource({ resourceId }) {
  const { merged: resource } = yield select(
    resourceData,
    'exports',
    resourceId,
    'value'
  );

  // Return formValues as it is if the resource is not an xml resource
  if (!isFileAdaptor(resource) || resource.file.type !== 'xml') {
    return;
  }

  // For xml resource, get xml content from state
  // xml options from resource
  const { data: sampleData } = yield select(
    getResourceSampleDataWithStatus,
    resourceId,
    'raw'
  );

  if (!sampleData || !sampleData.body) return;
  const processedData = yield call(parseFileData, {
    sampleData: sampleData.body,
    resource,
  });
  const convertedXmlToJSON =
    processedData && processedData.data && processedData.data[0];

  if (!convertedXmlToJSON) return;
  const rules = generateTransformationRulesOnXMLData(convertedXmlToJSON);
  const value = {
    rules,
    version: '1',
  };
  const patchSet = [{ op: 'replace', path: '/transform', value }];

  yield put(actions.resource.patchStaged(resourceId, patchSet, 'value'));
}

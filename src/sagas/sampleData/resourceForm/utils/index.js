import { select, call } from 'redux-saga/effects';
import {
  constructResourceFromFormValues,
  constructSuiteScriptResourceFromFormValues,
} from '../../../utils';
import { selectors } from '../../../../reducers';
import { generateFileParserOptionsFromResource } from '../../utils/fileParserUtils';
import { safeParse } from '../../../../utils/string';
import { evaluateExternalProcessor } from '../../../editor';
import { getResource } from '../../../resources';

export const SUITESCRIPT_FILE_RESOURCE_TYPES = ['fileCabinet', 'ftp'];
export const FILE_DEFINITION_TYPES = ['filedefinition', 'fixed', 'delimited/edifact'];
const EXPORT_FILE_UPLOAD_SUPPORTED_FILE_TYPES = ['csv', 'xlsx', 'json', 'xml'];
export const IMPORT_FILE_UPLOAD_SUPPORTED_FILE_TYPES = ['csv', 'xlsx', 'json', 'xml'];
export const VALID_RESOURCE_TYPES_FOR_SAMPLE_DATA = ['exports', 'imports'];

function extractResourcePath(value, initialResourcePath) {
  if (value) {
    const jsonValue = safeParse(value) || {};

    return jsonValue.resourcePath;
  }

  return initialResourcePath;
}

export function* _fetchResourceInfoFromFormKey({ formKey }) {
  const formState = yield select(selectors.formState, formKey);
  const parentContext = (yield select(selectors.formParentContext, formKey)) || {};
  const { resourceId, resourceType, integrationId, ssLinkedConnectionId } = parentContext;

  if (ssLinkedConnectionId) {
    const ssResourceObj = (yield call(constructSuiteScriptResourceFromFormValues, {
      formValues: formState?.value || {},
      resourceId,
      resourceType,
      ssLinkedConnectionId,
      integrationId,
    })) || {};

    return {
      formState,
      ...parentContext,
      resourceObj: resourceType === 'exports' ? ssResourceObj.export : ssResourceObj.import,
    };
  }
  const resourceObj = (yield call(constructResourceFromFormValues, {
    formValues: formState?.value || {},
    resourceId,
    resourceType,
  })) || {};

  return {
    formState,
    ...parentContext,
    resourceObj,
  };
}

/**
 * Checks if the constructed body from formValues has same file type as saved resource
 * and if body has sampleData
 */
export function* _hasSampleDataOnResource({ formKey }) {
  const { resourceObj, resourceId, resourceType } = yield call(_fetchResourceInfoFromFormKey, { formKey });
  const resource = yield select(selectors.resource, resourceType, resourceId);

  if (!resource || !resourceObj?.sampleData) return false;
  const resourceFileType = resource?.file?.type;
  const bodyFileType = resourceObj?.file?.type;

  if (
    ['filedefinition', 'fixed', 'delimited/edifact'].includes(bodyFileType) &&
          resourceFileType === 'filedefinition'
  ) {
    return true;
  }

  return bodyFileType === resourceFileType;
}

// common code to fetch sample data for file adaptors goes here
// given a form key - it should return the sample data of the resource
//  it could be uploaded file / sample data on the resource
// it could be the data fetched from the selectors incase of file definitions
export function* extractFileSampleDataProps({ formKey }) {
  const { resourceObj: resourceInfo, resourceId, ssLinkedConnectionId } = yield call(_fetchResourceInfoFromFormKey, { formKey });

  const resourceObj = { ...resourceInfo };

  if (ssLinkedConnectionId && SUITESCRIPT_FILE_RESOURCE_TYPES.includes(resourceObj.type)) {
    resourceObj.file.type = 'csv';
  }
  const fileType = resourceObj?.file?.type;
  const fileProps = resourceObj.file[fileType] || {};
  const fileId = `${resourceId}-uploadFile`;
  const uploadedFileObj = yield select(selectors.getUploadedFile, fileId);
  const oldResourceDoc = yield select(selectors.resource, 'exports', resourceObj._id);
  const { file: uploadedFile } = uploadedFileObj || {};
  const hasSampleData = yield call(_hasSampleDataOnResource, { formKey });
  const parserOptions = generateFileParserOptionsFromResource(resourceObj, oldResourceDoc);

  if (FILE_DEFINITION_TYPES.includes(fileType)) {
    const fieldState = yield select(selectors.fieldState, formKey, 'file.filedefinition.rules');
    const {userDefinitionId, fileDefinitionResourcePath, value: fieldValue, options: fieldOptions} = fieldState || {};
    const { format, definitionId } = fieldOptions || {};
    const resourcePath = extractResourcePath(fieldValue, fileDefinitionResourcePath);

    const fileDefinitionData = yield select(selectors.fileDefinitionSampleData, {
      userDefinitionId,
      resourceType: 'exports',
      options: { format, definitionId, resourcePath },
    });

    return {
      sampleData: fileDefinitionData?.sampleData || resourceObj.sampleData,
      parserOptions: fieldValue || fileDefinitionData?.rule,
      fileProps: parserOptions,
    };
  }
  if (EXPORT_FILE_UPLOAD_SUPPORTED_FILE_TYPES.includes(fileType) && uploadedFile) {
    return { sampleData: uploadedFile, isNewSampleData: true, parserOptions };
  }
  if (hasSampleData) {
    return { sampleData: resourceObj.sampleData, fileProps, parserOptions};
  }

  return {};
}

export function* executeTransformationRules({ transform = {}, sampleData, isIntegrationApp }) {
  let hasNoRulesToProcess = false;
  let processorData;

  if (transform.type === 'expression') {
    const [rule] = transform.expression.rules || [];

    if (!(rule && rule.length)) {
      hasNoRulesToProcess = true;
    } else {
      processorData = {
        data: sampleData,
        rule,
        editorType: 'transform',
      };
    }
  } else if (transform.type === 'script') {
    const { _scriptId, function: entryFunction } = transform.script || {};

    if (_scriptId) {
      const script = !isIntegrationApp ? (yield call(getResource, {
        resourceType: 'scripts',
        id: _scriptId,
      })) : {};

      processorData = {
        data: { record: sampleData },
        rule: {
          code: script?.content,
          entryFunction,
          script: _scriptId,
        },
        editorType: 'javascript',
      };
    } else {
      hasNoRulesToProcess = true;
    }
  } else {
    hasNoRulesToProcess = true;
  }

  if (hasNoRulesToProcess) return { hasNoRulesToProcess };

  const processedData = yield call(evaluateExternalProcessor, {
    processorData,
  });

  if (processedData?.error) {
    // sends data as undefined as no data gets propagated for further stages
    return {};
  }

  if (processorData.editorType === 'javascript') {
    return { data: processedData?.data };
  }

  return { data: processedData?.data?.[0] };
}

export function* executeJavascriptHook({ hook = {}, sampleData, isIntegrationApp }) {
  let processorData;
  let hasNoRulesToProcess = false;

  if (hook._scriptId) {
    const scriptId = hook._scriptId;
    const script = !isIntegrationApp ? (yield call(getResource, {
      resourceType: 'scripts',
      id: scriptId,
    })) : {};
    const { content: code } = script;

    processorData = {
      data: { data: sampleData ? [sampleData] : []},
      rule: {
        code,
        entryFunction: hook.function,
        scriptId,
      },
      editorType: 'javascript',
    };
  } else {
    hasNoRulesToProcess = true;
  }
  if (hasNoRulesToProcess) return { hasNoRulesToProcess };

  const processedData = yield call(evaluateExternalProcessor, {
    processorData,
  });

  if (processedData?.error) {
    // sends data as undefined as no data gets propagated for further stages
    return {};
  }

  return {data: processedData?.data?.data?.[0] };
}

import React, { useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HttpRequestBodyEditorDialog from '../../AFE/HttpRequestBodyEditor/Dialog';
import UrlEditorDialog from '../../AFE/UrlEditor/Dialog';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import {
  getXMLSampleTemplate,
  getJSONSampleTemplate,
} from '../../AFE/HttpRequestBodyEditor/templateMapping';
import useFormContext from '../../Form/FormContext';
import CsvConfigEditorDialog from '../../AFE/CsvConfigEditor/Dialog';

const DynaEditorWithFlowSampleData = ({
  fieldId,
  editorType,
  flowId,
  resourceId,
  resourceType,
  disableEditorV2,
  rule,
  ...props
}) => {
  const formContext = useFormContext(props.formKey);
  const dispatch = useDispatch();
  const isEditorV2Supported = useSelector(state => {
    if (disableEditorV2) {
      return false;
    }

    return selectors.isEditorV2Supported(state, resourceId, resourceType);
  });
  const {
    data: sampleData,
    status: sampleDataRequestStatus,
    templateVersion,
  } = useSelector(state =>
    selectors.getEditorSampleData(state, {
      flowId,
      resourceId,
      fieldType: fieldId,
    })
  );
  const loadEditorSampleData = useCallback(
    version => {
      dispatch(
        actions.editorSampleData.request({
          flowId,
          resourceId,
          resourceType,
          stage: 'flowInput',
          formValues: formContext.value,
          fieldType: fieldId,
          isV2NotSupported: disableEditorV2,
          requestedTemplateVersion: version,
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disableEditorV2, dispatch, fieldId, flowId, resourceId, resourceType]
  );
  const handleEditorVersionToggle = useCallback(
    version => {
      loadEditorSampleData(version);
    },
    [loadEditorSampleData]
  );
  const formattedRule = useMemo(() => {
    if (editorType === 'httpRequestBody' && !rule && templateVersion === 1) {
      // load sample template when rule is not yet defined
      if (props.contentType === 'json') return getJSONSampleTemplate((sampleData && sampleData.data) || []);

      return getXMLSampleTemplate((sampleData && sampleData.data) || []);
    }

    return rule;
  }, [editorType, props.contentType, rule, sampleData, templateVersion]);

  useEffect(() => {
    if (flowId) {
      loadEditorSampleData();
    }
  }, [flowId, loadEditorSampleData]);

  return (
    <>
      {editorType === 'httpRequestBody' && (
        <HttpRequestBodyEditorDialog
          {...props}
          id={`${resourceId}-${fieldId}`}
          rule={formattedRule}
          data={JSON.stringify(sampleData, null, 2)}
          isSampleDataLoading={sampleDataRequestStatus === 'requested'}
          showVersionToggle={isEditorV2Supported}
          editorVersion={templateVersion}
          onVersionToggle={handleEditorVersionToggle}
        />
      )}
      {editorType === 'uri' && (
        <UrlEditorDialog
          {...props}
          id={`${resourceId}-${fieldId}`}
          rule={formattedRule}
          data={JSON.stringify(sampleData, null, 2)}
          showVersionToggle={isEditorV2Supported}
          isSampleDataLoading={sampleDataRequestStatus === 'requested'}
          editorVersion={templateVersion}
          onVersionToggle={handleEditorVersionToggle}
        />
      )}
      {editorType === 'csvGenerate' && (
        <CsvConfigEditorDialog
          {...props}
          /** rule to be passed as json */
          rule={formattedRule}
          title="CSV generator helper"
          id={`${resourceId}-${fieldId}`}
          mode="csv"
          data={JSON.stringify(sampleData, null, 2)}
          resourceType={resourceType}
          csvEditorType="generate"
          showVersionToggle={isEditorV2Supported}
          isSampleDataLoading={sampleDataRequestStatus === 'requested'}
          editorVersion={templateVersion}
          onVersionToggle={handleEditorVersionToggle}
      />
      )}
    </>
  );
};

export default DynaEditorWithFlowSampleData;

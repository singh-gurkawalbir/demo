import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import HttpRequestBodyEditorDrawer from '../../AFE/HttpRequestBodyEditor/Drawer';
import UrlEditorDrawer from '../../AFE/UrlEditor/Drawer';
import CsvConfigEditorDrawer from '../../AFE/CsvConfigEditor/Drawer';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import useFormContext from '../../Form/FormContext';

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
  const isPageGenerator = useSelector(state => selectors.isPageGenerator(state, flowId, resourceId, resourceType));

  const isEditorV2Supported = useSelector(state => {
    // no sample data for PGs except for dataURITemplate field
    if (disableEditorV2 || (isPageGenerator && fieldId !== 'dataURITemplate')) {
      return false;
    }

    return selectors.isEditorV2Supported(state, resourceId, resourceType);
  });
  const {
    data: sampleData,
    status: sampleDataRequestStatus,
    templateVersion,
  } = useSelector(state => {
    const sampleData = selectors.editorSampleData(state, { flowId, resourceId, fieldType: fieldId });

    return selectors.sampleDataWrapper(state, {
      sampleData,
      flowId,
      resourceId,
      resourceType,
      fieldType: fieldId,
      stage: editorType !== 'csvGenerate' ? 'flowInput' : undefined,
    });
  }, isEqual);
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
          isEditorV2Supported,
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

  useEffect(() => {
    if (flowId) {
      loadEditorSampleData();
    }
  }, [flowId, loadEditorSampleData]);

  return (
    <>
      {editorType === 'httpRequestBody' && (
        <HttpRequestBodyEditorDrawer
          {...props}
          id={`${resourceId}-${fieldId}`}
          rule={rule}
          data={JSON.stringify(sampleData, null, 2)}
          isSampleDataLoading={sampleDataRequestStatus === 'requested'}
          showVersionToggle={isEditorV2Supported}
          editorVersion={templateVersion}
          onVersionToggle={handleEditorVersionToggle}
        />
      )}
      {editorType === 'uri' && (
        <UrlEditorDrawer
          {...props}
          id={`${resourceId}-${fieldId}`}
          rule={rule}
          data={JSON.stringify(sampleData, null, 2)}
          showVersionToggle={isEditorV2Supported}
          isSampleDataLoading={sampleDataRequestStatus === 'requested'}
          editorVersion={templateVersion}
          onVersionToggle={handleEditorVersionToggle}
        />
      )}
      {editorType === 'csvGenerate' && (
        <CsvConfigEditorDrawer
          {...props}
          /** rule to be passed as json */
          rule={rule}
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

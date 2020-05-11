import FormContext from 'react-forms-processor/dist/components/FormContext';
import { useCallback, useMemo, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HttpRequestBodyEditorDialog from '../../../components/AFE/HttpRequestBodyEditor/Dialog';
import UrlEditorDialog from '../../../components/AFE/UrlEditor/Dialog';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import {
  getXMLSampleTemplate,
  getJSONSampleTemplate,
} from '../../AFE/HttpRequestBodyEditor/templateMapping';

const DynaEditorWithFlowSampleData = ({
  fieldId,
  editorType,
  formContext,
  flowId,
  resourceId,
  resourceType,
  enableEditorV2,
  rule,
  ...props
}) => {
  const dispatch = useDispatch();
  const isPageGenerator = useSelector(state =>
    selectors.isPageGenerator(state, flowId, resourceId, resourceType)
  );
  const isEditorV2Supported = useSelector(state => {
    if (enableEditorV2) {
      return selectors.isEditorV2Supported(state, resourceId, resourceType);
    }

    return false;
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
          isV2NotSupported: !enableEditorV2,
          requestedTemplateVersion: version,
        })
      );
    },
    [
      dispatch,
      enableEditorV2,
      fieldId,
      flowId,
      formContext.value,
      resourceId,
      resourceType,
    ]
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
      if (props.contentType === 'json')
        return getJSONSampleTemplate((sampleData && sampleData.data) || []);

      return getXMLSampleTemplate((sampleData && sampleData.data) || []);
    }

    return rule;
  }, [editorType, props.contentType, rule, sampleData, templateVersion]);

  useEffect(() => {
    if (flowId && !isPageGenerator) {
      loadEditorSampleData();
    }
  }, [
    dispatch,
    flowId,
    formContext.value,
    isPageGenerator,
    loadEditorSampleData,
    resourceId,
    resourceType,
  ]);

  return (
    <Fragment>
      {editorType === 'httpRequestBody' ? (
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
      ) : (
        <UrlEditorDialog
          {...props}
          id={`${resourceId}-${fieldId}`}
          data={JSON.stringify(sampleData, null, 2)}
          showVersionToggle={isEditorV2Supported}
          isSampleDataLoading={sampleDataRequestStatus === 'requested'}
          editorVersion={templateVersion}
          onVersionToggle={handleEditorVersionToggle}
        />
      )}
    </Fragment>
  );
};

export default function DynaEditorWithFlowSampleDataWrapper(props) {
  return (
    <FormContext.Consumer>
      {form => <DynaEditorWithFlowSampleData {...props} formContext={form} />}
    </FormContext.Consumer>
  );
}

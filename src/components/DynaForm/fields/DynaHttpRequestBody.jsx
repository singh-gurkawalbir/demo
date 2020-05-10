import { useState, useCallback, useEffect, useMemo, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormContext from 'react-forms-processor/dist/components/FormContext';
import Button from '@material-ui/core/Button';
import * as selectors from '../../../reducers';
import HttpRequestBodyEditorDialog from '../../../components/AFE/HttpRequestBodyEditor/Dialog';
import DynaLookupEditor from './DynaLookupEditor';
import {
  getXMLSampleTemplate,
  getJSONSampleTemplate,
} from '../../AFE/HttpRequestBodyEditor/templateMapping';
import actions from '../../../actions';
import ErroredMessageComponent from './ErroredMessageComponent';

const ManageLookup = props => {
  const {
    label = 'Manage lookups',
    lookupFieldId,
    value,
    onFieldChange,
    flowId,
    resourceType,
    resourceId,
    connectionId,
  } = props;

  return (
    <DynaLookupEditor
      id={lookupFieldId}
      label={label}
      value={value}
      onFieldChange={onFieldChange}
      flowId={flowId}
      resourceType={resourceType}
      resourceId={resourceId}
      connectionId={connectionId}
    />
  );
};

const DynaHttpRequestBody = props => {
  const {
    id,
    formContext,
    onFieldChange,
    options = {},
    value,
    label,
    title,
    resourceId,
    connectionId,
    resourceType,
    flowId,
    arrayIndex,
    enableEditorV2 = true,
  } = props;
  const { lookups: _lookupObj = {} } = options;
  const { fieldId: lookupFieldId, data: lookups } = _lookupObj;
  const contentType = options.contentType || props.contentType;
  const [showEditor, setShowEditor] = useState(false);
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
      fieldType: id,
    })
  );
  const sampleRule = useMemo(() => {
    if (templateVersion === 1) {
      // load sample template when rule is not yet defined
      if (contentType === 'json')
        return getJSONSampleTemplate((sampleData && sampleData.data) || []);

      return getXMLSampleTemplate((sampleData && sampleData.data) || []);
    }
  }, [contentType, sampleData, templateVersion]);
  const formattedRule = useMemo(() => {
    let rule = Array.isArray(value) ? value[arrayIndex] : value;

    if (!rule && templateVersion === 1) {
      // load sample template when rule is not yet defined
      if (contentType === 'json')
        rule = getJSONSampleTemplate((sampleData && sampleData.data) || []);
      else rule = getXMLSampleTemplate((sampleData && sampleData.data) || []);
    }

    return rule;
  }, [arrayIndex, contentType, sampleData, templateVersion, value]);
  const action = useMemo(() => {
    if (!lookupFieldId) return;

    return ManageLookup({
      lookupFieldId,
      value: lookups,
      onFieldChange,
      flowId,
      resourceType,
      resourceId,
      connectionId,
    });
  }, [
    connectionId,
    flowId,
    lookupFieldId,
    lookups,
    onFieldChange,
    resourceId,
    resourceType,
  ]);
  const loadEditorSampleData = useCallback(
    version => {
      dispatch(
        actions.editorSampleData.request({
          flowId,
          resourceId,
          resourceType,
          stage: 'flowInput',
          formValues: formContext.value,
          fieldType: id,
          requestedTemplateVersion: enableEditorV2 ? version : 1,
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, enableEditorV2, flowId, id, resourceId, resourceType]
  );
  const handleEditorClick = useCallback(() => {
    setShowEditor(!showEditor);
  }, [showEditor]);
  const handleEditorVersionToggle = useCallback(
    version => {
      loadEditorSampleData(version);
    },
    [loadEditorSampleData]
  );
  // TODO: break into different function. To be done across all editors
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      // TODO: Give better name for arrayIndex
      if (typeof arrayIndex === 'number' && Array.isArray(value)) {
        // save to array at position arrayIndex
        const valueTmp = value;

        valueTmp[arrayIndex] = template;
        onFieldChange(id, valueTmp);
      } else {
        // save to field
        onFieldChange(id, template);
      }
    }

    handleEditorClick();
  };

  useEffect(() => {
    if (flowId && !isPageGenerator) {
      loadEditorSampleData();
    }
  }, [
    dispatch,
    flowId,
    id,
    isPageGenerator,
    loadEditorSampleData,
    resourceId,
    resourceType,
  ]);

  return (
    <Fragment key={`${resourceId}-${id}`}>
      {showEditor && (
        <HttpRequestBodyEditorDialog
          contentType={contentType === 'json' ? 'json' : 'xml'}
          title={title || 'Build HTTP Request Body'}
          id={`${resourceId}-${id}`}
          rule={formattedRule}
          sampleRule={sampleRule}
          onFieldChange={onFieldChange}
          isSampleDataLoading={sampleDataRequestStatus === 'requested'}
          lookups={lookups}
          data={JSON.stringify(sampleData, null, 2)}
          onClose={handleClose}
          action={action}
          showVersionToggle={isEditorV2Supported}
          editorVersion={templateVersion}
          onVersionToggle={handleEditorVersionToggle}
        />
      )}
      <Button
        data-test={id}
        variant="outlined"
        color="secondary"
        onClick={handleEditorClick}>
        {label}
      </Button>
      <ErroredMessageComponent {...props} />
    </Fragment>
  );
};

export default function DynaHttpRequestBodyWrapper(props) {
  return (
    <FormContext.Consumer>
      {form => <DynaHttpRequestBody {...props} formContext={form} />}
    </FormContext.Consumer>
  );
}

import { useState, useCallback, useMemo, Fragment } from 'react';
import { useSelector } from 'react-redux';
import FormContext from 'react-forms-processor/dist/components/FormContext';
import Button from '@material-ui/core/Button';
import * as selectors from '../../../reducers';
import DynaLookupEditor from './DynaLookupEditor';
import ErroredMessageComponent from './ErroredMessageComponent';
import lookupUtil from '../../../utils/lookup';
import DynaEditorWithFlowSampleData from './DynaEditorWithFlowSampleData';

const ManageLookup = props => {
  const {
    label = 'Manage lookups',
    lookupFieldId,
    value,
    onFieldChange,
    flowId,
    resourceType,
    resourceId,
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
    supportLookup = true,
    enableEditorV2 = true,
  } = props;
  const contentType = options.contentType || props.contentType;
  const [showEditor, setShowEditor] = useState(false);
  const adaptorType = useSelector(state => {
    const { merged: resourceData = {} } = selectors.resourceData(
      state,
      'imports',
      resourceId
    );

    return resourceData && resourceData.adaptorType;
  });
  const formattedRule = useMemo(
    () => (Array.isArray(value) ? value[arrayIndex] : value),
    [arrayIndex, value]
  );
  const lookups =
    supportLookup &&
    lookupUtil.getLookupFromFormContext(formContext, adaptorType);
  const action = useMemo(() => {
    if (!supportLookup) {
      return;
    }

    const lookupFieldId = lookupUtil.getLookupFieldId(adaptorType);

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
    adaptorType,
    connectionId,
    flowId,
    lookups,
    onFieldChange,
    resourceId,
    resourceType,
    supportLookup,
  ]);
  const handleEditorClick = useCallback(() => {
    setShowEditor(!showEditor);
  }, [showEditor]);
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

  return (
    <Fragment key={`${resourceId}-${id}`}>
      {showEditor && (
        <DynaEditorWithFlowSampleData
          contentType={contentType === 'json' ? 'json' : 'xml'}
          title={title || 'Build HTTP request body'}
          fieldId={id}
          onFieldChange={onFieldChange}
          lookups={lookups}
          onClose={handleClose}
          action={action}
          editorType="httpRequestBody"
          flowId={flowId}
          resourceId={resourceId}
          resourceType={resourceType}
          enableEditorV2={enableEditorV2}
          rule={formattedRule}
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

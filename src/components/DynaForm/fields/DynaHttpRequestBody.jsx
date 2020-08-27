import React, { useMemo, Fragment } from 'react';
import { useSelector } from 'react-redux';
import FormContext from 'react-forms-processor/dist/components/FormContext';
import { Button, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../reducers';
import DynaLookupEditor from './DynaLookupEditor';
import ErroredMessageComponent from './ErroredMessageComponent';
import lookupUtil from '../../../utils/lookup';
import DynaEditorWithFlowSampleData from './DynaEditorWithFlowSampleData';
import FieldHelp from '../FieldHelp';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import usePushRightDrawer from '../../../hooks/usePushRightDrawer';

const useStyles = makeStyles({
  dynaHttpRequestBodyWrapper: {
    width: '100%',
  },
  dynaHttpRequestlabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaReqBodyBtn: {
    maxWidth: 100,
  },
  dynaHttpReqLabel: {
    marginBottom: 6,
  },
});
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
    resourceId,
    resourceType,
    flowId,
    arrayIndex,
    supportLookup = true,
    disableEditorV2 = false,
  } = props;
  const classes = useStyles();
  const handleOpenDrawer = usePushRightDrawer(id);
  const { merged: resourceData = {} } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  );
  const { adaptorType, _connectionId: connectionId } = resourceData;
  const connectionMediaType = useSelector(state => {
    const connection =
      selectors.resource(state, 'connections', connectionId) || {};

    return connection.type === 'http' ? connection.http?.mediaType : connection.rest?.mediaType;
  });
  const contentType = options.contentType || props.contentType || connectionMediaType;

  const formattedRule = useMemo(
    () => (Array.isArray(value) ? value[arrayIndex] : value),
    [arrayIndex, value]
  );
  const lookups =
    supportLookup &&
    resourceType === 'imports' &&
    lookupUtil.getLookupFromFormContext(formContext, adaptorType);
  const action = useMemo(() => {
    if (!supportLookup || resourceType !== 'imports') {
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
  // TODO: break into different function. To be done across all editors
  const handleSave = (shouldCommit, editorValues) => {
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
  };

  return (
    <Fragment key={`${resourceId}-${id}`}>
      <DynaEditorWithFlowSampleData
        contentType={contentType === 'json' ? 'json' : 'xml'}
        title={`${
          contentType === 'json'
            ? 'Build JSON Document'
            : 'Build XML Document'
        }`}
        fieldId={id}
        onFieldChange={onFieldChange}
        lookups={lookups}
        onSave={handleSave}
        action={action}
        editorType="httpRequestBody"
        flowId={flowId}
        resourceId={resourceId}
        resourceType={resourceType}
        disableEditorV2={disableEditorV2}
        rule={formattedRule}
        path={id}
        />
      <div className={classes.dynaHttpRequestBodyWrapper}>
        <div className={classes.dynaHttpRequestlabelWrapper}>
          <FormLabel className={classes.dynaHttpReqLabel}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.dynaReqBodyBtn}
          onClick={handleOpenDrawer}>
          Launch
        </Button>
      </div>
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

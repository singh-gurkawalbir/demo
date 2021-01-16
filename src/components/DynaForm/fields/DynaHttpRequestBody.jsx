import { FormLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React, { useMemo, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import usePushRightDrawer from '../../../hooks/usePushRightDrawer';
import { selectors } from '../../../reducers';
import lookupUtil from '../../../utils/lookup';
import useFormContext from '../../Form/FormContext';
import FieldHelp from '../FieldHelp';
import DynaEditorWithFlowSampleData from './DynaEditorWithFlowSampleData';
import DynaLookupEditor from './DynaLookupEditor';
import FieldMessage from './FieldMessage';

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
    enableEditorV2 = false,
    formKey,
  } = props;
  const classes = useStyles();
  const formContext = useFormContext(formKey);
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
        formKey={formKey}
        contentType={contentType === 'json' ? 'json' : 'xml'}
        title={label}
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
        enableEditorV2={enableEditorV2}
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
      <FieldMessage {...props} />
    </Fragment>
  );
};

export default DynaHttpRequestBody;

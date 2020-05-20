import { FormLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import lookupUtil from '../../../utils/lookup';
import useFormContext from '../../Form/FormContext';
import FieldHelp from '../FieldHelp';
import DynaEditorWithFlowSampleData from './DynaEditorWithFlowSampleData';
import DynaLookupEditor from './DynaLookupEditor';
import ErroredMessageComponent from './ErroredMessageComponent';

const useStyles = makeStyles(theme => ({
  dynaHttpRequestBodyWrapper: {
    flexDirection: `row !important`,
    width: '100%',
    alignItems: 'center',
  },
  dynaReqBodyBtn: {
    marginRight: theme.spacing(0.5),
  },
  dynaHttpReqLabel: {
    marginBottom: 0,
    marginRight: 12,
    maxWidth: '50%',
    wordBreak: 'break-word',
  },
}));
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
    title,
    resourceId,
    resourceType,
    flowId,
    arrayIndex,
    supportLookup = true,
    disableEditorV2 = false,
    formKey,
  } = props;
  const classes = useStyles();
  const formContext = useFormContext(formKey);
  const contentType = options.contentType || props.contentType;
  const [showEditor, setShowEditor] = useState(false);
  const { adaptorType, connectionId } = useSelector(state => {
    const { merged: resourceData = {} } = selectors.resourceData(
      state,
      resourceType,
      resourceId
    );
    const { adaptorType, _connectionId: connectionId } = resourceData;

    return { adaptorType, connectionId };
  }, shallowEqual);
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
          disableEditorV2={disableEditorV2}
          rule={formattedRule}
        />
      )}
      <div className={classes.dynaHttpRequestBodyWrapper}>
        <FormLabel className={classes.dynaHttpReqLabel}>
          {label ? `${label}:` : ''}
        </FormLabel>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.dynaReqBodyBtn}
          onClick={handleEditorClick}>
          {label}
        </Button>
        <FieldHelp {...props} />
      </div>
      <ErroredMessageComponent {...props} />
    </Fragment>
  );
};

export default DynaHttpRequestBody;

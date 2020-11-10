/* eslint-disable react/jsx-pascal-case */
import { FormLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React, { useMemo, Fragment, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import usePushRightDrawer from '../../../hooks/usePushRightDrawer';
import { selectors } from '../../../reducers';
import lookupUtil from '../../../utils/lookup';
import useFormContext from '../../Form/FormContext';
import FieldHelp from '../FieldHelp';
import DynaLookupEditor from './DynaLookupEditor';
import ErroredMessageComponent from './ErroredMessageComponent';
import actions from '../../../actions';
import _HandlebarsEditor_ from '../../AFE/HandlebarsEditor/new';
import _AFE2EditorDrawer_ from '../../AFE/AFE2Editor/new';

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

export default function _DynaHttpRequestBody_(props) {
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
    layout,
    disabled,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const formContext = useFormContext(formKey);
  const handleOpenDrawer = usePushRightDrawer();
  const { merged: resourceData = {} } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  );
  const isEditorV2Supported = useSelector(state => {
    if (disableEditorV2) {
      return false;
    }

    return selectors.isEditorV2Supported(state, resourceId, resourceType, flowId, enableEditorV2);
  });
  const editorDataVersion = useSelector(state => selectors._editorDataVersion(state, id));
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
    useMemo(() => supportLookup &&
    resourceType === 'imports' &&
    lookupUtil.getLookupFromFormContext(formContext, adaptorType), [adaptorType, formContext, resourceType, supportLookup]);

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

  const handleSave = editorValues => {
    const { rule } = editorValues;

    // TODO: Give better name for arrayIndex
    if (typeof arrayIndex === 'number' && Array.isArray(value)) {
      // save to array at position arrayIndex
      const valueTmp = value;

      valueTmp[arrayIndex] = rule;
      onFieldChange(id, valueTmp);
    } else {
      // save to field
      onFieldChange(id, rule);
    }
  };

  const handleEditorClick = useCallback(() => {
    dispatch(actions._editor.init(id, 'handlebars', {
      rule: typeof formattedRule === 'string' ? formattedRule : JSON.stringify(formattedRule, null, 2),
      resultMode: contentType === 'json' ? 'json' : 'xml',
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: 'flowInput',
      isEditorV2Supported,
    }));
    // get Helper functions when the editor initializes
    dispatch(actions._editor.refreshHelperFunctions());

    handleOpenDrawer(id);
  }, [dispatch, id, formattedRule, contentType, formKey, flowId, resourceId, resourceType, isEditorV2Supported, handleOpenDrawer]);

  return (
    <Fragment key={`${resourceId}-${id}`}>
      <_AFE2EditorDrawer_
        flowId={flowId}
        title={label}
        onFieldChange={onFieldChange}
        onSave={handleSave}
        action={action}
        path={id}
        id={id}
        disabled={disabled}
        showVersionToggle={isEditorV2Supported}
        editorVersion={editorDataVersion}
        layout={layout || 'compact'}>
        <_HandlebarsEditor_
          lookups={lookups}
          disabled={disabled}
          ruleMode="handlebars"
          dataMode="json"
          layout={layout || 'compact'}
          enableAutocomplete
          />
      </_AFE2EditorDrawer_>

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
          onClick={handleEditorClick}>
          Launch
        </Button>
      </div>
      <ErroredMessageComponent {...props} />
    </Fragment>
  );
}

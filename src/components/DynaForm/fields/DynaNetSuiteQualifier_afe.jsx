/* eslint-disable camelcase */
import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, FormControl, FormLabel } from '@material-ui/core';
import OpenInNewIcon from '../../icons/FilterIcon';
import FieldHelp from '../FieldHelp';
import FieldMessage from './FieldMessage';
import ActionButton from '../../ActionButton';
import { getValidRelativePath } from '../../../utils/routePaths';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import isLoggableAttr from '../../../utils/isLoggableAttr';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  textField: {
    width: '100%',
  },
  dynaNetsuiteQWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },
  editorButtonNetsuiteQ: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing(1),
  },
  dynaNetsuiteLabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
}));

export default function DynaNetSuiteQualifier_afe(props) {
  const classes = useStyles();
  const {
    defaultValue,
    errorMessages,
    id,
    isValid,
    name,
    onFieldChange,
    placeholder = 'Define criteria',
    required,
    formKey,
    flowId,
    resourceId,
    resourceType,
    value,
    label,
    options,
    isLoggable,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);
  const [isDefaultValueChanged, setIsDefaultValueChanged] = useState(false);

  const netsuiteAPIVersion = useSelector(state => selectors.fieldState(state, formKey, 'netsuite.distributed.frameworkVersion'))?.value === 'suiteapp2.0';

  useEffect(() => {
    onFieldChange(id, []);
  }, [netsuiteAPIVersion]);

  useEffect(() => {
    if (options.commMetaPath) {
      setIsDefaultValueChanged(true);
    }
  }, [options.commMetaPath]);

  useEffect(() => {
    if (isDefaultValueChanged) {
      if (options.resetValue) {
        onFieldChange(id, [], true);
      } else if (defaultValue) {
        onFieldChange(id, defaultValue, true);
      }

      setIsDefaultValueChanged(false);
    }
  }, [
    defaultValue,
    id,
    isDefaultValueChanged,
    onFieldChange,
    options.resetValue,
  ]);

  const handleSave = useCallback(editorValues => {
    const { rule } = editorValues;

    onFieldChange(id, Array.isArray(rule) ? JSON.stringify(rule) : rule);
  }, [id, onFieldChange]);

  const handleEditorClick = useCallback(() => {
    dispatch(actions.editor.init(editorId, 'netsuiteQualificationCriteria', {
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      onSave: handleSave,
      // we don't need sample data here,
      // hence adding dummy data to stop the saga from requesting the same
      data: 'dummy data',
      customOptions: options,
    }));

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, id, formKey, flowId, resourceId, resourceType, handleSave, history, match.url, editorId, options]);

  return (
    <div className={classes.dynaNetsuiteQWrapper}>
      <FormControl className={classes.textField}>
        <div className={classes.dynaNetsuiteLabelWrapper}>
          <FormLabel htmlFor={id} required={required} error={!isValid}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>
        <TextField
          key={id}
          name={name}
          {...isLoggableAttr(isLoggable)}
          fullWidth
          placeholder={placeholder}
          disabled
          required={required}
          error={!isValid}
          // eslint-disable-next-line no-nested-ternary
          value={Array.isArray(value) ? JSON.stringify(value) : (value === null ? placeholder : value)}
          variant="filled"
        />
        <FieldMessage
          isValid={isValid}
          errorMessages={errorMessages}
        />
      </FormControl>
      <ActionButton
        data-test={id}
        onClick={handleEditorClick}
        className={classes.editorButtonNetsuiteQ}>
        <OpenInNewIcon />
      </ActionButton>
    </div>
  );
}

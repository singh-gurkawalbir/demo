/* eslint-disable camelcase */
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import makeStyles from '@mui/styles/makeStyles';
import { TextField, FormControl, FormLabel } from '@mui/material';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ActionButton from '../../ActionButton';
import FilterIcon from '../../icons/FilterIcon';
import FieldHelp from '../FieldHelp';
import FieldMessage from './FieldMessage';
import { getValidRelativePath } from '../../../utils/routePaths';
import isLoggableAttr from '../../../utils/isLoggableAttr';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  dynaNetsuiteLookupFormControl: {
    width: '100%',
  },
  dynaNetsuiteLookupLabelWrapper: {
    width: '100%',
  },
  dynaNetsuiteFieldLookupWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaNetsuiteLookupField: {
    width: '100%',
  },
  dynaNetsuiteLookupActionBtn: {
    marginTop: theme.spacing(1),
  },
}));

export default function DynaNetSuiteLookup_afe(props) {
  const classes = useStyles();
  const {
    errorMessages,
    id,
    isValid,
    name,
    onFieldChange,
    placeholder,
    required,
    value,
    resourceId,
    flowId,
    label,
    options = {},
    recordTypeFieldId = 'netsuite_da.recordType',
    formKey,
    resourceType,
    isLoggable,
    disableFetch,
  } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);

  const recordTypeField = useSelector(state => selectors.formState(state, formKey)?.fields?.[recordTypeFieldId]);

  const customOptions = useMemo(() => {
    if (!isEmpty(options)) return options;

    return {
      disableFetch: !recordTypeField?.value,
      commMetaPath: recordTypeField
        ? `netsuite/metadata/suitescript/connections/${recordTypeField.connectionId}/recordTypes/${recordTypeField.value}/searchFilters?includeJoinFilters=true`
        : '',
      resetValue: [],
    };
  }, [options, recordTypeField]);

  const handleSave = useCallback(editorValues => {
    const { rule } = editorValues;

    // We don't want to allow saving the form when the field is required but it is an empty array
    if (Array.isArray(rule) && rule.length === 0) {
      onFieldChange(id, '');

      return;
    }

    onFieldChange(id, JSON.stringify(rule));
  }, [id, onFieldChange]);

  const handleEditorClick = useCallback(() => {
    if (resourceType) {
      dispatch(actions.editor.init(editorId, 'netsuiteLookupFilter', {
        formKey,
        flowId,
        resourceId,
        resourceType,
        fieldId: id,
        stage: 'importMappingExtract',
        onSave: handleSave,
        customOptions,
      }));

      history.push(buildDrawerUrl({
        path: drawerPaths.EDITOR,
        baseUrl: match.url,
        params: { editorId },
      }));
    }
  }, [dispatch, id, formKey, flowId, resourceId, resourceType, handleSave, history, match.url, editorId, customOptions]);

  return (
    <>
      <FormControl className={classes.dynaNetsuiteLookupFormControl}>
        <div className={classes.dynaNetsuiteLookupLabelWrapper}>
          <FormLabel htmlFor={id} required={required} error={!isValid}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>

        <div className={classes.dynaNetsuiteFieldLookupWrapper}>
          <div className={classes.dynaNetsuiteLookupField}>
            <TextField
              {...isLoggableAttr(isLoggable)}
              key={id}
              name={name}
              className={classes.dynaNetsuiteLookupField}
              placeholder={placeholder}
              disabled
              value={value}
              variant="filled"
            />
            <FieldMessage
              isValid={isValid}
              description=""
              errorMessages={errorMessages}
            />
          </div>
          <ActionButton
            disabled={customOptions?.disableFetch || disableFetch}
            data-test={id}
            onClick={handleEditorClick}
            tooltip="Define lookup criteria"
            className={classes.dynaNetsuiteLookupActionBtn}>
            <FilterIcon />
          </ActionButton>
        </div>
      </FormControl>
    </>
  );
}

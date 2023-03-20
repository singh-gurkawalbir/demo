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
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  lookupFieldWrapper: {
    display: 'flex',
  },
  lookupField: {
    width: '100%',
  },
  exitButton: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
  dynaTextFormControl: {
    width: '100%',
  },
}));

export default function DynaSalesforceLookup_afe(props) {
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
    resourceType,
    resourceId,
    flowId,
    label,
    multiline,
    formKey,
    options = {},
    sObjectTypeFieldId = 'salesforce.sObjectType',
  } = props;
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);
  const dispatch = useDispatch();
  const sObjectTypeField = useSelector(state => selectors.formState(state, formKey)?.fields?.[sObjectTypeFieldId]);

  const customOptions = useMemo(() => {
    if (!isEmpty(options)) return options;

    return {
      disableFetch: !sObjectTypeField?.value,
      commMetaPath: sObjectTypeField
        ? `salesforce/metadata/connections/${sObjectTypeField.connectionId}/sObjectTypes/${sObjectTypeField.value}`
        : '',
      resetValue: [],
    };
  }, [options, sObjectTypeField]);

  const isFilterIconDisabled = customOptions?.disableFetch || false;

  const handleSave = useCallback(editorValues => {
    const { rule } = editorValues;

    onFieldChange(id, rule);
  }, [id, onFieldChange]);
  const handleEditorClick = useCallback(() => {
    dispatch(actions.editor.init(editorId, 'salesforceLookupFilter', {
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
  }, [dispatch, id, formKey, flowId, resourceId, resourceType, handleSave, history, match.url, editorId, customOptions]);

  return (
    <>
      <FormControl variant="standard" className={classes.dynaTextFormControl}>
        <div className={classes.dynaTextLabelWrapper}>
          <FormLabel htmlFor={id} required={required} error={!isValid}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>
        <div className={classes.lookupFieldWrapper}>
          <div className={classes.lookupField}>
            <TextField
              key={id}
              name={name}
              multiline={multiline}
              placeholder={placeholder}
              className={classes.lookupField}
              disabled
              value={value}
              variant="filled"
          />
            <FieldMessage
              isValid={isValid}
              errorMessages={errorMessages}
          />
          </div>
          <ActionButton
            data-test={id}
            onClick={handleEditorClick}
            className={classes.exitButton}
            disabled={isFilterIconDisabled}>
            <FilterIcon />
          </ActionButton>
        </div>
      </FormControl>
    </>
  );
}

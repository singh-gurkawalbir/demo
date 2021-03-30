/* eslint-disable camelcase */
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, FormControl, FormLabel } from '@material-ui/core';
import actions from '../../../actions';
import ActionButton from '../../ActionButton';
import FilterIcon from '../../icons/FilterIcon';
import FieldHelp from '../FieldHelp';
import FieldMessage from './FieldMessage';
import { getValidRelativePath } from '../../../utils/routePaths';

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

export default function DynaSalesforceLookup_afe2(props) {
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
  } = props;
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);
  const dispatch = useDispatch();
  const handleSave = useCallback(editorValues => {
    const { rule } = editorValues;

    onFieldChange(id, rule);
  }, [id, onFieldChange]);
  const handleEditorClick = useCallback(() => {
    dispatch(actions._editor.init(editorId, 'salesforceLookupFilter', {
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: 'importMappingExtract',
      onSave: handleSave,
    }));

    history.push(`${match.url}/editor/${editorId}`);
  }, [dispatch, id, formKey, flowId, resourceId, resourceType, handleSave, history, match.url, editorId]);

  return (
    <>
      <FormControl className={classes.dynaTextFormControl}>
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
            className={classes.exitButton}>
            <FilterIcon />
          </ActionButton>
        </div>
      </FormControl>
    </>
  );
}

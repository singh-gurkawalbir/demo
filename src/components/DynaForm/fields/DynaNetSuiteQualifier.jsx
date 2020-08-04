import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, FormControl, FormLabel } from '@material-ui/core';
import OpenInNewIcon from '../../icons/FilterIcon';
import NetSuiteQualificationCriteriaEditor from '../../AFE/NetSuiteQualificationCriteriaEditor';
import FieldHelp from '../FieldHelp';
import ErroredMessageComponent from './ErroredMessageComponent';
import ActionButton from '../../ActionButton';

const useStyles = makeStyles(theme => ({
  textField: {
    width: '100%',
  },
  dynaNetsuiteQWrapper: {
    flexDirection: 'row !important',
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

export default function DynaNetSuiteQualifier(props) {
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const {
    // disabled,
    errorMessages,
    id,
    isValid,
    name,
    onFieldChange,
    placeholder = 'Define criteria',
    required,
    defaultValue,
    value,
    label,
    options,
  } = props;
  const [isDefaultValueChanged, setIsDefaultValueChanged] = useState(false);

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
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleSave = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;

      onFieldChange(id, Array.isArray(rule) ? JSON.stringify(rule) : rule);
    }
  };

  let rule = [];

  if (value) {
    try {
      rule = JSON.parse(value);
    } catch (e) {
      rule = value;
    }
  }

  return (
    <div className={classes.dynaNetsuiteQWrapper}>
      <FormControl className={classes.textField}>
        <div className={classes.dynaNetsuiteLabelWrapper}>
          <FormLabel htmlFor={id} required={required} error={!isValid}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>
        {showEditor && (
          <NetSuiteQualificationCriteriaEditor
            title="Field specific qualification criteria"
            id={id}
            value={rule}
            onSave={handleSave}
            onClose={handleEditorClick}
            // disabled={disabled}
            options={options}
          />
        )}

        <TextField
          key={id}
          name={name}
          className={classes.textField}
          placeholder={placeholder}
          disabled
          required={required}
          error={!isValid}
          // eslint-disable-next-line no-nested-ternary
          value={Array.isArray(value) ? JSON.stringify(value) : (value === null ? placeholder : value)}
          variant="filled"
        />

        <ErroredMessageComponent
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

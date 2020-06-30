import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, FormControl, FormLabel } from '@material-ui/core';
import SalesforceEditorDialog from '../../AFE/SalesforceQualificationCriteriaEditor';
import ActionButton from '../../ActionButton';
import ExitIcon from '../../icons/FilterIcon';
import ErroredMessageComponent from './ErroredMessageComponent';
import FieldHelp from '../FieldHelp';

const useStyles = makeStyles(theme => ({
  dynaslsforceFormControl: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
  },
  exitButtonsalsForceQualifier: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
  },
  dynaSalesforceQualifierWrapper: {
    flexDirection: 'row !important',
  },
  textField: {
    width: '100%',
  },
  dynaSalesforceQualifierlabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
}));

export default function DynaSalesforceQualifier(props) {
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const {
    // disabled,
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
    options,
  } = props;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;

      onFieldChange(id, rule);
    }

    handleEditorClick();
  };

  return (
    <div className={classes.dynaSalesforceQualifierWrapper}>
      {showEditor && (
        <SalesforceEditorDialog
          title="Field specific qualification criteria"
          id={id}
          value={value}
          resourceId={resourceId}
          flowId={flowId}
          onClose={handleClose}
          // disabled={disabled}
          options={options}
        />
      )}
      <div className={classes.textField}>
        <div className={classes.dynaSalesforceQualifierlabelWrapper}>
          <FormLabel htmlFor={id} required={required} error={!isValid}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
          {/* TODO (Sravan) :Field Help is not rendering */}
        </div>
        <FormControl className={classes.dynaslsforceFormControl}>
          <TextField
            key={id}
            name={name}
            className={classes.textField}
            placeholder={placeholder}
            disabled
            required={required}
            error={!isValid}
            value={value || ''}
            variant="filled"
          />
          <ErroredMessageComponent
            isValid={isValid}
            errorMessages={errorMessages}
          />
        </FormControl>
      </div>
      <ActionButton
        data-test={id}
        onClick={handleEditorClick}
        className={classes.exitButtonsalsForceQualifier}>
        <ExitIcon />
      </ActionButton>
    </div>
  );
}

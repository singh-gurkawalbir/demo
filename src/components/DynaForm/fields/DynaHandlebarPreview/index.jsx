/* eslint-disable react/jsx-pascal-case */
import clsx from 'clsx';
import React from 'react';
import { makeStyles, FormLabel } from '@material-ui/core';
import CodeEditor from '../../../CodeEditor2';
import FieldHelp from '../../FieldHelp';
import FieldMessage from '../FieldMessage';
import ActionButton from '../../../ActionButton';
import AfeIcon from '../../../icons/AfeIcon';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  editorBorder: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: 82,
    flexGrow: 1,
  },
  editorContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
  },
  afeButton: {
    marginTop: theme.spacing(0.75),
  },
  errorBtn: {
    color: theme.palette.error.dark,
  },
}));

export default function DynaHandlebarPreview({
  id,
  label,
  value,
  required,
  helpText,
  helpKey,
  resourceContext,
  onFieldChange,
  onEditorClick,
  description,
  errorMessages,
  isValid,
  disabled,
  dataTest,
}) {
  const classes = useStyles();

  const onChange = value => onFieldChange(id, value);

  return (
    <>
      <div className={classes.root}>
        <div className={classes.labelContainer}>
          <FormLabel required={required}>
            {label}
          </FormLabel>
          <FieldHelp {...{ id, label, helpText, helpKey, resourceContext}} />
        </div>
        <div className={classes.editorContainer}>
          <div className={classes.editorBorder}>
            <CodeEditor
              name={id}
              value={value}
              mode="handlebars"
              readOnly={disabled}
              onChange={onChange}
          />
          </div>
          <ActionButton
            data-test={dataTest || id}
            tooltip="Open handlebars editor"
            className={clsx(classes.afeButton, { [classes.errorBtn]: !isValid})}
            variant="outlined"
            color="secondary"
            onClick={onEditorClick}>
            <AfeIcon />
          </ActionButton>
        </div>
      </div>
      <FieldMessage {...{description, errorMessages, isValid}} />
    </>
  );
}

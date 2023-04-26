/* eslint-disable react/jsx-pascal-case */
import clsx from 'clsx';
import React from 'react';
import { FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CodeEditor from '../../../CodeEditor2';
import FieldHelp from '../../FieldHelp';
import FieldMessage from '../FieldMessage';
import ActionButton from '../../../ActionButton';
import AfeIcon from '../../../icons/AfeIcon';
import isLoggableAttr from '../../../../utils/isLoggableAttr';

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
    '& .ace_gutter': {
      zIndex: 1,
    },
  },
  editorContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
  },
  afeButton: {
    paddingTop: theme.spacing(0.75),
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
  noApi,
  resourceContext,
  onFieldChange,
  onEditorClick,
  description,
  errorMessages,
  isValid,
  disabled,
  dataTest,
  isLoggable,
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
          <FieldHelp {...{ id, label, helpText, helpKey, noApi, resourceContext}} />
        </div>
        <div className={classes.editorContainer}>
          <div className={classes.editorBorder} {...isLoggableAttr(isLoggable)}>
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
            placement="bottom"
            className={clsx(classes.afeButton, { [classes.errorBtn]: !isValid})}
            onClick={onEditorClick}>
            <AfeIcon />
          </ActionButton>
        </div>
      </div>
      <FieldMessage {...{description, errorMessages, isValid}} />
    </>
  );
}

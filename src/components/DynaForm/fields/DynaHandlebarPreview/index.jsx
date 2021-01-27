/* eslint-disable react/jsx-pascal-case */
import clsx from 'clsx';
import React from 'react';
import isObject from 'lodash/isObject';
import { makeStyles, FormLabel } from '@material-ui/core';
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
  previewContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
  },
  preview: {
    flexGrow: 1,
    minHeight: 40,
    maxHeight: 100,
    overflow: 'auto',
    border: `1px solid ${theme.palette.secondary.lightest}`,
    backgroundColor: theme.palette.background.paper2,
    padding: theme.spacing(0, 1),
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
  onEditorClick,
  description,
  errorMessages,
  isValid,
}) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <div className={classes.labelContainer}>
          <FormLabel required={required}>
            {label}
          </FormLabel>
          <FieldHelp {...{ id, label, helpText, helpKey, resourceContext}} />
        </div>
        <div className={classes.previewContainer}>
          <div className={classes.preview}>
            <pre>{isObject(value) ? JSON.stringify(value) : value}</pre>
          </div>
          <ActionButton
            data-test={id}
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

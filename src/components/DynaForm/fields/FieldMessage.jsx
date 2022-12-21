import React from 'react';
import { FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ErrorIcon from '../../icons/ErrorIcon';
import WarningIcon from '../../icons/WarningIcon';
import RawHtml from '../../RawHtml';

const useStyles = makeStyles(theme => ({
  descriptionWrapper: {
    marginTop: theme.spacing(0.5),
    lineHeight: '20px',
    '&:empty': {
      display: 'none',
    },
  },
  error: {
    display: 'flex',
    alignItems: 'top',
    color: theme.palette.error.main,
  },
  warning: {
    display: 'flex',
    alignItems: 'top',
    color: theme.palette.warning.main,
  },
  icon: {
    marginTop: 2,
    marginRight: 3,
    fontSize: theme.spacing(2),
    verticalAlign: 'text-bottom',
  },
  description: {
    display: 'flex',
    alignItems: 'top',
    color: theme.palette.text.hint,
    '& a': {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
    },
  },
}));

export default function FieldMessage({ description, errorMessages, warningMessages, isValid, className }) {
  const classes = useStyles();
  const shownError = isValid ? description : errorMessages;

  return description || errorMessages || warningMessages ? (
    <FormHelperText
      error={!isValid}
      className={clsx(classes.descriptionWrapper, className)}
      component="div">
      {description && isValid && (
      <div className={classes.description}>
        {/<\/?[a-z][\s\S]*>/i.test(description) ? (
          <RawHtml html={description} options={{allowedTags: ['a'], escapeUnsecuredDomains: true}} />
        ) : (description)}
      </div>
      )}
      {warningMessages && (
      <div className={classes.warning}>
        {warningMessages && !isValid && <WarningIcon className={classes.icon} />}
        {/<\/?[a-z][\s\S]*>/i.test(warningMessages) ? (
          <RawHtml html={warningMessages} options={{allowedTags: ['a'], escapeUnsecuredDomains: true}} />
        ) : (warningMessages)}
      </div>
      )}
      {errorMessages && (
      <div className={classes.error}>
        {errorMessages && !isValid && <ErrorIcon className={classes.icon} />}
        {/<\/?[a-z][\s\S]*>/i.test(shownError) ? (
          <RawHtml html={shownError} options={{allowedTags: ['a'], escapeUnsecuredDomains: true}} />
        ) : (shownError)}
      </div>
      )}
    </FormHelperText>
  ) : null;
}

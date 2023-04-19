import React from 'react';
import { FormHelperText } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
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
  stack: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  error: {
    color: theme.palette.error.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  icon: {
    marginTop: 2,
    marginRight: theme.spacing(0.5),
    fontSize: theme.spacing(2),
    verticalAlign: 'text-bottom',
  },
  description: {
    color: theme.palette.text.hint,
    '& a': {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
    },
  },
}));

const ShowInfo = type => (
  <>
    {/<\/?[a-z][\s\S]*>/i.test(type) ? (
      <RawHtml html={type} options={{allowedTags: ['a'], escapeUnsecuredDomains: true}} />
    ) : (type)}
  </>
);
export default function FieldMessage({ description, errorMessages, warningMessages, isValid, className }) {
  const classes = useStyles();
  const shownError = isValid ? description : errorMessages;

  return description || errorMessages || warningMessages ? (
    <FormHelperText
      error={!isValid}
      className={clsx(classes.stack, classes.descriptionWrapper, className)}
      component="div">
      {description && isValid && (
      <div className={clsx(classes.stack, classes.description)}>
        {ShowInfo(description)}
      </div>
      )}
      {warningMessages && (
      <div className={clsx(classes.stack, classes.warning)}>
        {warningMessages && !isValid && <WarningIcon className={classes.icon} />}
        {ShowInfo(warningMessages)}
      </div>
      )}
      {errorMessages && (
      <div className={clsx(classes.stack, classes.error)}>
        {errorMessages && !isValid && <ErrorIcon className={classes.icon} />}
        {ShowInfo(shownError)}
      </div>
      )}
    </FormHelperText>
  ) : null;
}

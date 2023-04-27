import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import ExitIcon from '../icons/ExitIcon';
import CeligoDivider from '../CeligoDivider';
import WarningIcon from '../icons/WarningIcon';
import InfoIcon from '../icons/InfoIcon';

const useStyles = makeStyles(theme => ({
  messageWithlinkWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  partition: {
    margin: theme.spacing(0, 2),
  },
  icon: {
    marginRight: theme.spacing(1),
    fontSize: theme.spacing(2.5),
  },
  info: {
    '& >  svg': {
      color: theme.palette.primary.main,
    },
  },
  warning: {
    '& >  svg': {
      color: theme.palette.warning.main,
    },
  },
  message: {
    fontSize: theme.spacing(2),
    display: 'flex',
    alignItems: 'flex-start',
  },
  bold: {
    fontWeight: 600,
  },
  linksWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(4),
    marginTop: theme.spacing(1),
  },
  continueLink: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const NotificationMessage = ({variant, type, className, children}) => {
  const classes = useStyles();

  const variantIcon = {
    warning: WarningIcon,
    info: InfoIcon,
  };
  const Icon = variantIcon[variant];

  return (
    <Typography component="div" id="client-snackbar" className={clsx(classes.message, {[classes.bold]: type === 'bold'}, classes[variant], className)}>
      <Icon className={clsx(classes.icon, classes.iconVariant)} />
      {children}
    </Typography>
  );
};

export default function MessageWithLink(
  {
    type,
    variant = 'info',
    message,
    link,
    linkText,
    instructionsLink,
    className,
  }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.messageWithlinkWrapper, className)}>
      <NotificationMessage variant={variant} type={type}>
        {message}
      </NotificationMessage>

      <div className={classes.linksWrapper}>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          data-test="viewMarketplace"
          className={clsx(classes.continueLink, {[classes.bold]: type === 'bold'})}
        >
          <ExitIcon className={classes.icon} /> {linkText}
        </a>
        {
          instructionsLink &&
        (
        <>
          <CeligoDivider height="medium" className={classes.partition} />
          <a href={instructionsLink} target="_blank" rel="noreferrer">
            View instructions
          </a>
        </>
        )
        }
      </div>
    </div>
  );
}

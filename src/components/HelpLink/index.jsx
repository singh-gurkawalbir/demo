import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';

const useStyles = makeStyles({
  helpLink: {
    marginLeft: 'auto',
  },
});

export default function HelpLink({helpLink, className}) {
  const classes = useStyles();

  if (!helpLink) return null;

  return (
    <a className={clsx(classes.helpLink, className)} href={helpLink} rel="noreferrer" target="_blank">
      Can&apos;t find?
    </a>
  );
}

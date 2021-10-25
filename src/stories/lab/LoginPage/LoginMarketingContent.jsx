import React from 'react';
import { makeStyles } from '@material-ui/core';

const domainUrl = 'https://staging.celigo.com/company/about-us';
const useStyles = makeStyles(theme => ({
  loginMarketingContentWrapper: {
    width: '100%',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    height: '100%',
    '& > iframe': {
      width: '100%',
      height: '100%',
      border: 'none',
    },
  },
}));
export default function LoginMarketingContent() {
  const classes = useStyles();

  return (
    <div className={classes.loginMarketingContentWrapper}>
      <iframe src={domainUrl} title="Celigo" />
    </div>
  );
}

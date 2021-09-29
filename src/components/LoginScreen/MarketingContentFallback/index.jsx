import React from 'react';
import { makeStyles } from '@material-ui/core';

const useFallBackIframe = makeStyles(theme => ({
  fallBackWrapper: {
    background: `center / contain no-repeat url('https://integrator-staging-ui-resources.s3.amazonaws.com/react/static/images/public-pages.svg'), ${theme.palette.background.default}`,
    padding: theme.spacing(2),
    backgroundOrigin: 'content-box, padding-box',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

export default function MarketingContentFallback() {
  const classes = useFallBackIframe();

  return (
    <div className={classes.fallBackWrapper} />

  );
}

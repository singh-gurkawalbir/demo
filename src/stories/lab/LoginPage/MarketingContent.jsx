import React from 'react';
import { makeStyles } from '@material-ui/core';

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
  gridImgWrapper: {
    background: `center / contain no-repeat url(''), ${theme.palette.background.default}`,
    padding: theme.spacing(2),
    backgroundOrigin: 'content-box, padding-box',

    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));
export default function MarketingContent({contentUrl}) {
  const fallBackUrl = 'https://integrator-staging-ui-resources.s3.amazonaws.com/react/static/images/public-pages.svg';
  const classes = useStyles();

  return (
    <div className={classes.loginMarketingContentWrapper}>
      {contentUrl ? <iframe src={contentUrl} title="Celigo" />
        : <iframe src={fallBackUrl} title="Celigo" />}
    </div>
  );
}

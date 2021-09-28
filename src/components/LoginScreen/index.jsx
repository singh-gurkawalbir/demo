import React from 'react';
import { makeStyles } from '@material-ui/core';
import LoginForm from './LoginForm';
import MarketingContentWithImages from './MarketingContentWithImages';
import MarketingContentWithIframe from './MarketingContentWithIframe';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'grid',
    gridTemplateColumns: '30% 70%',
    height: '100vh',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '100%',
    },
  },
}));
export default function LoginScreen(props) {
  const { backgroundImageUrl,
    foregroundImageUrl,
    contentUrl,
    targetUrl,
    direction,
    size} = props;

  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <LoginForm />
      {contentUrl && <MarketingContentWithIframe contentUrl={contentUrl} />}
      {!contentUrl && (backgroundImageUrl && foregroundImageUrl) && (
        <MarketingContentWithImages
          backgroundImageUrl={backgroundImageUrl}
          foregroundImageUrl={foregroundImageUrl}
          targetUrl={targetUrl}
          direction={direction}
          size={size} />
      )}
    </div>
  );
}

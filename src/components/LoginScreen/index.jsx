import React from 'react';
import { makeStyles } from '@material-ui/core';
import { MarketingContentWithIframe, MarketingContentWithImages } from './MarketingContent/index';
import LoginForm from './LoginForm';

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
export default function LoginTemplate(props) {
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
      {contentUrl &&
      <MarketingContentWithIframe contentUrl={contentUrl} />}
      {
        (backgroundImageUrl && foregroundImageUrl) && (
          <MarketingContentWithImages
            backgroundImageUrl={backgroundImageUrl}
            foregroundImageUrl={foregroundImageUrl}
            targetUrl={targetUrl}
            direction={direction}
            size={size} />
        )
    }
    </div>
  );
}

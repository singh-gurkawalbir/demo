import React from 'react';
import { makeStyles } from '@material-ui/core';
import { MarketingContentWithIframe, MarketingContentWithImages } from '../../../../components/LoginScreen/MarketingContent';
import LoginForm from '../../../../components/LoginScreen/LoginForm';

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
  const { backgroundImageUrl, foregroundImageUrl, contentUrl, targetUrl} = props;

  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <LoginForm />
      {/* render when we want to show marketing promotion using an Iframe */}
      {contentUrl &&
      <MarketingContentWithIframe contentUrl={contentUrl} />}
      {
        (backgroundImageUrl && foregroundImageUrl) && (
          <MarketingContentWithImages
            backgroundImageUrl={backgroundImageUrl}
            foregroundImageUrl={foregroundImageUrl}
            targetUrl={targetUrl}
            direction="center"
            size="small" />
        )
    }
    </div>
  );
}

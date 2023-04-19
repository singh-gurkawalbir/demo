import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import LoginForm from './LoginForm';
import MarketingContentWithImages from './MarketingContentWithImages';
import MarketingContentWithIframe from './MarketingContentWithIframe';
import MarketingContentFallback from './MarketingContentFallback';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'grid',
    gridTemplateColumns: '30% 70%',
    height: '100vh',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '100%',
    },
  },
}));
export default function LoginScreen(props) {
  const {
    backgroundImageUrl,
    foregroundImageUrl,
    targetUrl,
    direction,
    contentUrl,
    size,
  } = props;
  const classes = useStyles();

  if (contentUrl) {
    return (
      <div className={classes.wrapper}>
        <LoginForm />
        <MarketingContentWithIframe contentUrl={contentUrl} />
      </div>
    );
  }

  return (
    <div className={classes.wrapper}>
      <LoginForm />
      {(backgroundImageUrl && foregroundImageUrl) ? (
        <MarketingContentWithImages
          backgroundImageUrl={backgroundImageUrl}
          foregroundImageUrl={foregroundImageUrl}
          targetUrl={targetUrl}
          direction={direction}
          size={size} />
      ) : (<MarketingContentFallback />)}
    </div>
  );
}

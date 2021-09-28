import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStylesImages = makeStyles(theme => ({
  loginMarketingContentWrapper: {
    background: props => `center / 95% no-repeat url(${props.backgroundImageUrl}), ${theme.palette.background.default}`,
    padding: theme.spacing(2),
    backgroundOrigin: 'content-box, padding-box',
    position: 'relative',
  },
  leftPosition: {
    position: 'absolute',
    zIndex: theme.zIndex.appBar + 1,
  },
  right: {
    right: '5%',
    top: '5%',
  },
  center: {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  left: {
    left: '5%',
    top: '5%',
  },
  small: {
    maxWidth: 250,
  },
  medium: {
    maxWidth: 450,
  },
  large: {
    maxWidth: 650,
  },
  gridImgWrapper: {
    background: `center / contain no-repeat url('https://integrator-staging-ui-resources.s3.amazonaws.com/react/static/images/public-pages.svg'), ${theme.palette.background.default}`,
    padding: theme.spacing(2),
    backgroundOrigin: 'content-box, padding-box',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));
const useStylesIframe = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    '& > iframe': {
      width: '100%',
      height: '100%',
      border: 'none',
    },
  },
}));
export function MarketingContentWithImages(props) {
  const classes = useStylesImages(props);
  const {
    backgroundImageUrl,
    foregroundImageUrl,
    targetUrl,
    direction = 'left',
    size = 'small',
  } = props;

  return (
    <>
      {(backgroundImageUrl && foregroundImageUrl) ? (
        <div className={clsx({[classes.loginMarketingContentWrapper]: foregroundImageUrl})}>
          <div direction={direction}>
            <a
              href={targetUrl}
              target="blank"
              rel="noopener noreferer"
              data-test="loginMarketingContent"
              title={targetUrl}>
              <img
                src={foregroundImageUrl}
                alt="Information"
                className={
                clsx(
                  classes.leftPosition,
                  {[classes[size]]: size},
                  {[classes[direction]]: direction}
                )
}
                data-test="loginMarketingContent" />
            </a>
          </div>
        </div>
      )
        : <div className={classes.gridImgWrapper}>No Images</div>}

    </>

  );
}
export function MarketingContentWithIframe({contentUrl}) {
  const classes = useStylesIframe();

  return (
    <div className={classes.container}>
      <iframe src={contentUrl} title="Marketing Content" />
    </div>
  );
}

MarketingContentWithIframe.propTypes = {
  contentUrl: PropTypes.string.isRequired,
};
MarketingContentWithImages.propTypes = {
  backgroundImageUrl: PropTypes.string.isRequired,
  foregroundImageUrl: PropTypes.string.isRequired,
  targetUrl: PropTypes.string.isRequired,
};

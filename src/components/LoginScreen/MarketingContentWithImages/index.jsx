import React from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
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
}));
export default function MarketingContentWithImages(props) {
  const {
    backgroundImageUrl,
    foregroundImageUrl,
    targetUrl,
    direction = 'left',
    size = 'small',
  } = props;
  const classes = useStylesImages(props);

  return (
    <>
      <div className={clsx({[classes.loginMarketingContentWrapper]: backgroundImageUrl})}>
        <div direction={direction}>
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
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
    </>
  );
}

MarketingContentWithImages.propTypes = {
  backgroundImageUrl: PropTypes.string.isRequired,
  foregroundImageUrl: PropTypes.string.isRequired,
  targetUrl: PropTypes.string.isRequired,
};

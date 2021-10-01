import React from 'react';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

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
export default function MarketingContentWithIframe({contentUrl}) {
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

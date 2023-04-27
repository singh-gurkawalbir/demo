import React from 'react';
import Iframe from 'react-iframe';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));
export default function MarketingContentWithIframe({contentUrl}) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Iframe
        url={contentUrl}
        title="Announcement"
        width="100%"
        height="100%"
        frameBorder={0} />
    </div>
  );
}

MarketingContentWithIframe.propTypes = {
  contentUrl: PropTypes.string.isRequired,
};

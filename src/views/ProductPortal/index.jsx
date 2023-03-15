import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import Iframe from 'react-iframe';

const useStyles = makeStyles({
  container: {
    width: '100%',
    height: '100%',
  },
});
export default function ProductPortal() {
  const classes = useStyles();

  // eslint-disable-next-line no-undef
  const contentUrl = PORTAL_URL;

  return (
    <div className={classes.container}>
      <Iframe
        url={contentUrl}
        title="Product portal"
        width="100%"
        height="100%"
        frameBorder={0} />
    </div>
  );
}

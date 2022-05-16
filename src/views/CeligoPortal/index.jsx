import { makeStyles } from '@material-ui/core';
import React from 'react';
import Iframe from 'react-iframe';
import CeligoPageBar from '../../components/CeligoPageBar';
import messageStore from '../../utils/messageStore';
import { getDomain } from '../../utils/resource';

const useStyles = makeStyles({
  container: {
    width: '100%',
    height: '100%',
  },
});
export default function CeligoPortal() {
  const classes = useStyles();

  // eslint-disable-next-line no-undef
  const contentUrl = (getDomain() === 'eu.integrator.io' ? IO_LOGIN_PROMOTION_URL_EU : IO_LOGIN_PROMOTION_URL);

  return (
    <>
      <CeligoPageBar title="Celigo portal" infoText={messageStore('MARKETPLACE_HELPINFO')} />
      <div className={classes.container}>
        <Iframe
          url={contentUrl}
          title="Announcement"
          width="100%"
          height="100%"
          frameBorder={0} />
      </div>
    </>
  );
}

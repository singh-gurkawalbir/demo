import React from 'react';
import { Typography } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import NotificationToaster from '../NotificationToaster';

export default function GenericAdaptorNotification({className, onClose}) {
  return (
    <NotificationToaster className={className} variant="info" size="large" onClose={onClose}>
      <Typography variant="h6">
        We haven’t created a simplified form for this application yet. Please use our universal HTTP connector in the meantime.{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:product_feedback@celigo.com">
          <u>Let us know</u>
        </a>
        {' '}to prioritize this too!
      </Typography>
    </NotificationToaster>);
}

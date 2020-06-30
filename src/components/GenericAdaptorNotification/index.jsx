import React from 'react';
import { Typography } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import NotificationToaster from '../NotificationToaster';

export default function GenericAdaptorNotification({assistantName, className}) {
  return (
    <NotificationToaster className={className} variant="info" size="large">
      <Typography variant="h6">
        We haven’t created a simplified form for your {assistantName} app yet. Don’t worry! We’ve got you covered. Use our universal HTTP connector to configure your source.{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:product_feedback@celigo.com">
          <u>Let us know</u>
        </a>
        {' '}to prioritize this!
      </Typography>
    </NotificationToaster>);
}

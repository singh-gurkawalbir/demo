import React from 'react';
import { connectorsList } from '../../constants/applications';
import LogoStrip from '../LogoStrip';

export default function ApplicationImgCell({ applications }) {
  const connectors = connectorsList();

  // we are rendering max of 4 logos as of now
  const apps = applications.slice(0, 4).map(application => {
    const connector = connectors.find(connector => connector.value === application);

    if (!connector) {
      // eslint-disable-next-line no-console
      console.warn('Invalid application', application);

      return null;
    }

    return connector;
  });
  const appsShow = apps.map(app => app?.value || '');

  return <LogoStrip applications={appsShow} logoSize="medium" />;
}

import { Fragment } from 'react';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import StatusCircle from '../StatusCircle';
import { getApp } from '../../constants/applications';
import { getResourceSubType } from '../../utils/resource';

export const getResourceLink = (resourceType, resource, location = {}) => (
  <Fragment>
    <Link
      to={
        resourceType === 'connectorLicenses'
          ? `${location.pathname}/edit/connectorLicenses/${resource._id}`
          : `${location.pathname}/edit/${resourceType}/${resource._id}`
      }>
      {resourceType === 'connectorLicenses'
        ? resource.user && resource.user.email
        : resource.name || resource._id}
    </Link>
    <Typography>{resource.shared ? 'Shared' : ''}</Typography>
  </Fragment>
);

export const getConnectorName = resource => {
  const { type, assistant, resourceType } = getResourceSubType(resource);
  let app;

  if (type === 'rdbms') {
    if (resourceType === 'connections') {
      app = getApp(resource.rdbms.type);
    } else {
      return 'RDBMS';
    }
  } else {
    app = getApp(type, assistant);
  }

  return app.name;
};

export const formatLastModified = lastModified => (
  <TimeAgo date={lastModified} />
);

export const onlineStatus = r => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <StatusCircle size="small" variant={r.offline ? 'error' : 'success'} />
    {r.offline ? 'Offline' : 'Online'}
  </div>
);

export default {
  formatLastModified,
  getConnectorName,
  getResourceLink,
  onlineStatus,
};

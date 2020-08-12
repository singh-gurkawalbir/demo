import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import StatusCircle from '../StatusCircle';

export const getResourceLink = (resourceType, resource, location = {}) => (
  <>
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
    {resource.shared && <Typography>Shared</Typography>}
  </>
);

export const onlineStatus = r => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <StatusCircle size="small" variant={r.offline ? 'error' : 'success'} />
    {r.offline ? 'Offline' : 'Online'}
  </div>
);

export default {
  getResourceLink,
  onlineStatus,
};

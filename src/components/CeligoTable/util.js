import { Fragment } from 'react';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
// TODO: @Azhar, this status circle seems to be used more than just in
// the homepage card. Can you move it under /components, pls?
import StatusCircle from '../HomePageCard/Header/Status/StatusCircle';
import getRoutePath from '../../utils/routePaths';
import { getApp } from '../../constants/applications';
import { getResourceSubType } from '../../utils/resource';

export const getResourceLink = (resourceType, resource) => (
  <Fragment>
    <Link
      to={getRoutePath(
        `/${resourceType}/edit/${resourceType}/${resource._id}`
      )}>
      {resource.name || resource._id}
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

export const formatLastModified = lastModified => {
  const formatter = (value, unit, suffix) => `${value}${unit} ${suffix}`;

  return <TimeAgo formatter={formatter} date={lastModified} />;
};

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

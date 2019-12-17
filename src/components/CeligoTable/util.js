import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import { Typography } from '@material-ui/core';
import StatusCircle from '../StatusCircle';
import { getApp } from '../../constants/applications';
import { getResourceSubType } from '../../utils/resource';
import * as selectors from '../../reducers';
import LoadResources from '../LoadResources';

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
    {resource.shared && <Typography>Shared</Typography>}
  </Fragment>
);

export const GetResourceReferenceLink = ({ r }) => {
  const { name, id, resourceType } = r;
  const routePath = useSelector(state =>
    selectors.getResourceEditUrl(state, resourceType, id)
  );

  return (
    <LoadResources resources={[resourceType]}>
      <Link to={routePath}>{name || id}</Link>
    </LoadResources>
  );
};

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

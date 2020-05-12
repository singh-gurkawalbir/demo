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

export const useGetConnectorName = resource => {
  const { type, assistant, resourceType } = getResourceSubType(resource);
  const { _connectionId } = resource;
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', _connectionId)
  );

  if (type !== 'rdbms') {
    return getApp(type, assistant).name;
  }

  if (resourceType === 'exports' || resourceType === 'imports') {
    return getApp(connection && connection.rdbms && connection.rdbms.type).name;
  } else if (resource && resource.rdbms && resource.rdbms.type) {
    return getApp(resource.rdbms.type).name;
  }

  return 'RDBMS';
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
  useGetConnectorName,
  getResourceLink,
  onlineStatus,
};

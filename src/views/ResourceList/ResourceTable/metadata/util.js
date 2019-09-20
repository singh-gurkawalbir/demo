import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import StatusCircle from '../../../../components/HomePageCard/Header/Status/StatusCircle';
import getRoutePath from '../../../../utils/routePaths';
import { getApp } from '../../../../constants/applications';
import { getResourceSubType } from '../../../../utils/resource';

export const getResourceLink = (resourceType, resource) => (
  <Link
    to={getRoutePath(`/${resourceType}/edit/${resourceType}/${resource._id}`)}>
    {resource.name}
  </Link>
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
  const formatter = (value, unit, suffix) => `${value}${unit[0]} ${suffix}`;

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

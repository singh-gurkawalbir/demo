import moment from 'moment';

export const showDownloadLogs = conn => {
  let toReturn = false;

  if (conn.debugDate) {
    if (moment() <= moment(conn.debugDate)) {
      toReturn = true;
    } else {
      toReturn = moment().diff(moment(conn.debugDate), 'days') < 1;
    }
  }

  // TODO check whats different in the context of flow builder.
  // return toReturn && this.parent.type !== 'flowBuilder';
  return toReturn;
};

export const isConnectionEditable = (conn, integrationId) => {
  let editable = false;

  if (
    conn &&
    conn.permissions &&
    (conn.permissions.accessLevel === 'owner' ||
      conn.permissions.accessLevel === 'manage')
  ) {
    editable = true;
  }

  if (
    integrationId &&
    conn &&
    conn.permissions &&
    conn.permissions.accessLevel === 'tile' &&
    conn.permissions.integrations &&
    conn.permissions.integrations[integrationId] &&
    conn.permissions.integrations[integrationId].connections
  ) {
    editable = conn.permissions.integrations[integrationId].connections.create;
  }

  return editable;
};

export default { showDownloadLogs };

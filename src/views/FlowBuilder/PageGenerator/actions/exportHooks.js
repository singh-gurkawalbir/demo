import React from 'react';
import { useRouteMatch, Redirect } from 'react-router-dom';
import Icon from '../../../../components/icons/HookIcon';
import { drawerPaths, buildDrawerUrl } from '../../../../utils/rightDrawer';

function ExportHooks(props) {
  const { open, onClose, resourceType, resourceId } = props;
  const match = useRouteMatch();

  if (!open) return null;

  onClose();

  return (
    <Redirect
      push to={buildDrawerUrl({
        path: drawerPaths.FLOW_BUILDER.HOOKS,
        baseUrl: match.url,
        params: { resourceType, resourceId },
      })} />
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'exportHooks',
  position: 'right',
  Icon,
  helpKey: 'fb.pg.exports.hooks',
  Component: ExportHooks,
};

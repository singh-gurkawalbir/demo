import React from 'react';
import { useRouteMatch, Redirect } from 'react-router-dom';
import Icon from '../../../../components/icons/HookIcon';
import { DRAWER_URL_PREFIX } from '../../../../utils/drawerURLs';

function PageProcessorHooks(props) {
  const { open, onClose, resourceType, resourceId } = props;
  const match = useRouteMatch();

  if (!open) return null;

  onClose();

  return <Redirect push to={`${match.url}/${DRAWER_URL_PREFIX}/hooks/${resourceType}/${resourceId}`} />;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'pageProcessorHooks',
  position: 'middle',
  Icon,
  Component: PageProcessorHooks,
};

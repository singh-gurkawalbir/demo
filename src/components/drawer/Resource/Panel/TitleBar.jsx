import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router-dom';
import DrawerHeader from '../../Right/DrawerHeader';
import CloseButton from './CloseButton';
import { isNewId, convertResourceLabelToLowercase } from '../../../../utils/resource';
import { selectors } from '../../../../reducers';
import TitleActions from './TitleActions';
import DynaHTTPFrameworkBubbleFormView from '../../../DynaForm/fields/DynaHTTPFrameworkBubbleFormView';
import DynaConnectionFormView from '../../../DynaForm/fields/DynaConnectionFormView';
import DynaIclientFormView from '../../../DynaForm/fields/DynaIcielntFormView';
import { CONNECTORS_TO_IGNORE, emptyObject } from '../../../../constants';
import { useSelectorMemo } from '../../../../hooks';
import { applicationsList } from '../../../../constants/applications';

const getTitle = ({ resourceType, resourceLabel, opTitle }) => {
  if (resourceType === 'eventreports') {
    return 'Run report';
  }
  if (resourceType === 'pageGenerator') {
    return 'Create source';
  }

  if (['accesstokens', 'apis', 'connectors'].includes(resourceType)) {
    return `${opTitle} ${resourceLabel}`;
  }

  if (!resourceLabel) { return ''; }

  return `${opTitle} ${convertResourceLabelToLowercase(resourceLabel)}`;
};

const ResourceTitle = ({ flowId }) => {
  const location = useLocation();
  const match = useRouteMatch();
  const { id, resourceType } = match.params || {};
  const resourceLabel = useSelector(state =>
    selectors.getCustomResourceLabel(state, {
      resourceId: id,
      resourceType,
      flowId,
    })
  );
  const title = useMemo(
    () =>
      getTitle({
        resourceType,
        queryParamStr: location.search,
        resourceLabel,
        opTitle: isNewId(id) ? 'Create' : 'Edit',
      }),
    [id, location.search, resourceLabel, resourceType]
  );

  return title;
};

export default function TitleBar({ flowId, formKey, onClose }) {
  const match = useRouteMatch();
  const location = useLocation();
  const { id, resourceType } = match.params || {};
  const ResourceCloseButton = <CloseButton formKey={formKey} />;
  const checkIclient = match.path.search(/\/connections/) !== -1;
  const checkEditIclient = location.pathname.search(/\/iClients/) !== -1;

  const resource = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    id
  )?.merged || emptyObject;
  const applications = applicationsList().filter(app => !CONNECTORS_TO_IGNORE.includes(app.id));
  let app;

  if (resource?._httpConnectorId) {
    // existing iClinet
    app = applications.find(a => a._httpConnectorId === resource?._httpConnectorId) || {};
  } else if (resource?.http?._httpConnectorId) {
    // existing connection and new iclient
    app = applications.find(a => a._httpConnectorId === resource?.http?._httpConnectorId) || {};
  } else if (resource?.assistant) {
    // new connection and new Iclient
    app = applications.find(a => a.id === resource?.assistant) || {};
  }
  const refreshIclient = resourceType === 'iClients' || (resourceType === 'connections' && checkEditIclient);

  return (
    <DrawerHeader
      title={<ResourceTitle flowId={flowId} />}
      CloseButton={ResourceCloseButton}
      handleBack={onClose} >
      {['imports', 'exports'].includes(resourceType) && (
      <DynaHTTPFrameworkBubbleFormView
        formKey={formKey} resourceType={resourceType} resourceId={id} flowId={flowId}
        defaultValue="false"
        isTitleBar />
      )}
      {resourceType === 'connections' && (
      <DynaConnectionFormView
        formKey={formKey} resourceType={resourceType} resourceId={id} defaultValue="false"
        sourceForm="title" />
      ) }
      {refreshIclient && checkIclient && (app?._httpConnectorId) && (
        <DynaIclientFormView
          formKey={formKey} resourceType={resourceType} resourceId={id} defaultValue="false"
          sourceForm="title" />
      ) }
      <TitleActions flowId={flowId} />
    </DrawerHeader>
  );
}

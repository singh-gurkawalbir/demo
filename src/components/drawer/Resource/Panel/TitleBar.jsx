import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router-dom';
import DrawerHeader from '../../Right/DrawerHeader';
import CloseButton from './CloseButton';
import { isNewId } from '../../../../utils/resource';
import { selectors } from '../../../../reducers';
import TitleActions from './TitleActions';
import DynaHTTPFrameworkBubbleFormView from '../../../DynaForm/fields/DynaHTTPFrameworkBubbleFormView';
import DynaConnectionFormView from '../../../DynaForm/fields/DynaConnectionFormView';

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

  return `${opTitle} ${resourceLabel.toLowerCase()}`;
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
  const { id, resourceType } = match.params || {};
  const ResourceCloseButton = <CloseButton formKey={formKey} />;

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
      {resourceType === 'connections' && <DynaConnectionFormView formKey={formKey} resourceType={resourceType} resourceId={id} defaultValue="false" /> }
      <TitleActions flowId={flowId} />
    </DrawerHeader>
  );
}

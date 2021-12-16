import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import DrawerHeader from '../../Right/DrawerHeader';
import CloseButton from './CloseButton';
import { isNewId } from '../../../../utils/resource';
import { selectors } from '../../../../reducers';
import TitleActions from './TitleActions';

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

export default function TitleBar({ resourceType, id, flowId, isNew, formKey }) {
  const location = useLocation();
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
  const ResourceCloseButton = <CloseButton formKey={formKey} />;

  return (
    <DrawerHeader title={title} CloseButton={ResourceCloseButton}>
      <TitleActions id={id} resourceType={resourceType} flowId={flowId} isNew={isNew} />
    </DrawerHeader>
  );
}

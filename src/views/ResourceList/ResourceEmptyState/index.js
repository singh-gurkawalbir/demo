import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FilledButton, TextButton } from '../../../components/Buttons';
import EmptyState from '../../../components/EmptyState';
import resourceTypeMetaData from '../../../components/EmptyState/metadata';
import NoResultTypography from '../../../components/NoResultTypography';
import { generateNewId } from '../../../utils/resource';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import LoadResources from '../../../components/LoadResources';

export default function ResourceEmptyState({resourceType}) {
  const resource = resourceTypeMetaData[resourceType];
  const location = useLocation();

  const createResourceUrl = buildDrawerUrl({
    path: drawerPaths.RESOURCE.ADD,
    baseUrl: location.pathname,
    params: { resourceType, id: generateNewId() },
  });

  return (
    <LoadResources required resources={resourceType}>
      {resource?.type ? (
        <EmptyState
          title={resource.title}
          subTitle={resource.subTitle}
          type={resource.type}
        >
          <FilledButton
            component={Link}
            data-test={resource.type === 'integrations' ? 'create flow' : 'addNewResource'}
            to={resource.type === 'integrations'
              ? '/integrations/none/flowBuilder/new'
              : createResourceUrl} >
            {resource.buttonLabel}
          </FilledButton>
          <TextButton
            data-test="openResourceDocLink"
            underline
            href={resource.link}
            target="_blank">
            {resource.linkLabel}
          </TextButton>

        </EmptyState>
      ) : (
        <NoResultTypography>You don&apos;t have any {resourceType === 'apis' ? 'APIs' : resourceType} .</NoResultTypography>
      )}
    </LoadResources>

  );
}

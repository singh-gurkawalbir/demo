import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FilledButton, TextButton } from '@celigo/fuse-ui';
import EmptyState from '../../EmptyState';
import resourceTypeMetaData from '../../EmptyState/metadata';
import NoResultTypography from '../../NoResultTypography';
import { generateNewId } from '../../../utils/resource';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import LoadResources from '../../LoadResources';

export default function ResourceEmptyState({resourceType, className, integrationId = 'none', sectionId}) {
  const resource = resourceTypeMetaData[resourceType];
  const location = useLocation();
  let createResourceUrl;

  if (resource?.type === 'integrations') {
    createResourceUrl = '/integrations/none/flowBuilder/new';
  } else if (resource?.type === 'flows') {
    if (sectionId) {
      createResourceUrl = `/integrations/${integrationId}/flows/sections/${sectionId}/flowBuilder/new`;
    } else {
      createResourceUrl = `/integrations/${integrationId}/flowBuilder/new`;
    }
  } else {
    createResourceUrl = buildDrawerUrl({
      path: drawerPaths.RESOURCE.ADD,
      baseUrl: location.pathname,
      params: { resourceType, id: generateNewId() },
    });
  }

  return (
    <LoadResources required resources={resourceType}>
      {resource?.type ? (
        <EmptyState
          title={resource.title}
          subTitle={resource.subTitle}
          type={resource.type}
          className={className}
        >
          <FilledButton
            component={Link}
            data-test={resource.type === 'integrations' ? 'create flow' : 'addNewResource'}
            to={createResourceUrl} >
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

import React from 'react';
import { useLocation } from 'react-router-dom';
import { FilledButton, TextButton } from '../../../components/Buttons';
import EmptyState from '../../../components/EmptyState';
import resourceTypeMetaData from '../../../components/EmptyState/metadata';
import NoResultMessageWrapper from '../../../components/NoResultMessageWrapper';
import { generateNewId } from '../../../utils/resource';

export default function ResourceEmptyState({resourceType}) {
  const resource = resourceTypeMetaData[resourceType];
  const location = useLocation();

  return (
    <>
      {resource?.type ? (
        <EmptyState
          title={resource.title}
          subTitle={resource.subTitle}
          type={resource.type}
        >
          <FilledButton
            data-test={resource.type === 'integrations' ? 'create flow' : 'addNewResource'}
            href={resource.type === 'integrations' ? '/integrations/none/flowBuilder/new' : `${location.pathname}/add/${resourceType}/${generateNewId()}`} >
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
        <NoResultMessageWrapper>You don&apos;t have any {resourceType}.</NoResultMessageWrapper>
      )}
    </>

  );
}

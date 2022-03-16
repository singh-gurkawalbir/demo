import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../../../reducers';
import ResourceTable from '../../../../../../ResourceTable';
import ErrorInfoDrawer from '../ErrorInfoDrawer';

export default function ErrorTable({ integrationId, revisionId }) {
  const revisionErrors = useSelector(state => selectors.revisionErrors(state, integrationId, revisionId));

  if (!revisionErrors?.length) {
    return <div> No errors </div>;
  }

  return (
    <>
      <ResourceTable resourceType="revisionErrors" resources={revisionErrors} />
      <ErrorInfoDrawer integrationId={integrationId} revisionId={revisionId} />
    </>
  );
}

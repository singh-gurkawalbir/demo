import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import ResourceDiffContent from '../../components/ResourceDiffContent';

export default function ResourcesChanged({ integrationId, revisionId }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.integrationLCM.compare.revisionChanges(integrationId, revisionId));

    return () => dispatch(actions.integrationLCM.compare.clear(integrationId));
  }, [dispatch, integrationId, revisionId]);

  return <ResourceDiffContent integrationId={integrationId} />;
}

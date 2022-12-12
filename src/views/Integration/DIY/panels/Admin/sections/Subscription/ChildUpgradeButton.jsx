import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Spinner from '../../../../../../../components/Spinner';
import FilledButton from '../../../../../../../components/Buttons/FilledButton';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import TextButton from '../../../../../../../components/Buttons/TextButton';
import { useSelectorMemo } from '../../../../../../../hooks';
import { buildDrawerUrl, drawerPaths } from '../../../../../../../utils/rightDrawer';

export default function ChildUpgradeButton({ resource }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const { id, changeEditionId } = resource;
  const [isInProgress, setIsInProgress] = useState(false);
  const [isInQueue, setIsInQueue] = useState(false);
  const status = useSelector(state => selectors.getStatus(state, id)?.status);
  const changeEditionSteps = useSelectorMemo(selectors.mkIntegrationAppSettings, id)?.changeEditionSteps;
  const showWizard = useSelector(state => selectors.getStatus(state, id)?.showWizard);
  const inQueue = useSelector(state => selectors.getStatus(state, id)?.inQueue);
  const currentChild = useSelector(state => selectors.currentChildUpgrade(state));

  useEffect(() => {
    if (status === 'done' && inQueue) {
      dispatch(actions.integrationApp.upgrade.setStatus(id, { inQueue: false }));
    }

    if (showWizard && inQueue) {
      dispatch(actions.integrationApp.upgrade.setStatus(id, { status: 'done', inQueue: false }));
    } else if (showWizard && !inQueue) {
      history.push(buildDrawerUrl({
        path: drawerPaths.UPGRADE.INSTALL,
        baseUrl: match.url,
        params: { currentIntegrationId: id},
      }));
    }

    if (status === 'inProgress') {
      setIsInProgress(true);
    } else {
      setIsInProgress(false);
    }

    if (inQueue) {
      setIsInQueue(true);
    } else {
      setIsInQueue(false);
    }
  }, [dispatch, history, id, inQueue, match.url, showWizard, status]);

  useEffect(() => {
    if (currentChild === id) {
      dispatch(actions.integrationApp.settings.integrationAppV2.upgrade(id));
    }
  }, [dispatch, currentChild, id]);

  const onClickHandler = useCallback(() => {
    if (changeEditionSteps?.length) {
      dispatch(actions.integrationApp.upgrade.getSteps(id));
    } else {
      dispatch(actions.integrationApp.settings.integrationAppV2.upgrade(id));
    }
    dispatch(actions.integrationApp.upgrade.setStatus(id, { inQueue: false }));
  }, [changeEditionSteps?.length, dispatch, id]);

  if (isInQueue) {
    return (
      <>
        {isInProgress ? (
          <TextButton
            startIcon={<Spinner size="small" />}
          >
            Upgrading...
          </TextButton>
        ) : (
          <TextButton
            startIcon={<Spinner size="small" />}
          >
            Waiting in Queue...
          </TextButton>
        )}
      </>
    );
  }

  return (
    <FilledButton
      disabled={!changeEditionId}
      onClick={onClickHandler}
    >
      Upgrade
    </FilledButton>
  );
}

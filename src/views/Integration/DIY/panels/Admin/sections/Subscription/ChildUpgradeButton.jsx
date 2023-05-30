import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Spinner, FilledButton, TextButton } from '@celigo/fuse-ui';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import { useSelectorMemo } from '../../../../../../../hooks';
import { buildDrawerUrl, drawerPaths } from '../../../../../../../utils/rightDrawer';
import messageStore from '../../../../../../../utils/messageStore';
import useEnqueueSnackbar from '../../../../../../../hooks/enqueueSnackbar';
import ErrorContent from '../../../../../../../components/ErrorContent';

export default function ChildUpgradeButton({ resource }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const { id, changeEditionId, name } = resource;
  const status = useSelector(state => selectors.getStatus(state, id)?.status);
  const changeEditionSteps = useSelectorMemo(selectors.mkIntegrationAppSettings, id)?.changeEditionSteps;
  const showWizard = useSelector(state => selectors.getStatus(state, id)?.showWizard);
  const inQueue = useSelector(state => selectors.getStatus(state, id)?.inQueue);
  const errMessage = useSelector(state => selectors.getStatus(state, id)?.errMessage);
  const currentChild = useSelector(state => selectors.currentChildUpgrade(state));
  const accessLevel = useSelector(
    state => selectors.resourcePermissions(state, 'integrations', id).accessLevel
  );

  useEffect(() => {
    if (status === 'done') {
      dispatch(actions.integrationApp.upgrade.deleteStatus(id));
    }

    if (status === 'error') {
      dispatch(actions.integrationApp.upgrade.deleteStatus(id));
      enquesnackbar({
        message: <ErrorContent
          error={messageStore('SUBSCRIPTION.CHILD_UPGRADE_ERROR_MESSAGE',
            {
              childName: name,
              errorMessage: errMessage,
            }
          )} />,
        variant: 'error',
      });
    }

    if (showWizard && inQueue) {
      dispatch(actions.integrationApp.upgrade.setStatus(id, {
        showWizard: false,
        inQueue: false,
      }));
    } else if (showWizard && !inQueue) {
      dispatch(actions.integrationApp.upgrade.setStatus(id, {
        showWizard: false,
      }));
      history.push(buildDrawerUrl({
        path: drawerPaths.UPGRADE.INSTALL,
        baseUrl: match.url,
        params: { currentIntegrationId: id, type: 'child'},
      }));
    }

    if (showWizard) {
      dispatch(actions.integrationApp.upgrade.setStatus('successMessageFlags', { showChildLeftMessageFlag: true }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, inQueue, showWizard, status]);

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

  if ((status === 'inProgress') || (status === 'done' && inQueue)) {
    return (
      <TextButton
        startIcon={<Spinner size="small" />}
      >
        Upgrading...
      </TextButton>
    );
  }
  if (inQueue) {
    return (
      <TextButton
        startIcon={<Spinner size="small" />}
      >
        Waiting in Queue...
      </TextButton>
    );
  }

  return (
    <FilledButton
      disabled={!changeEditionId || accessLevel === 'monitor'}
      onClick={onClickHandler}
      data-test="childUpgrade"
      bold
      sx={!changeEditionId && {
        '&:disabled': {
          background: 'secondary.lightest',
          color: 'text.hint',
        },
      }}
    >
      Upgrade
    </FilledButton>
  );
}

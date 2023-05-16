import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Spinner, FilledButton, TextButton } from '@celigo/fuse-ui';
import ButtonWithTooltip from '../../../../../../../components/Buttons/ButtonWithTooltip';
import { selectors } from '../../../../../../../reducers';
import { buildDrawerUrl, drawerPaths } from '../../../../../../../utils/rightDrawer';
import actions from '../../../../../../../actions';

export default function ParentUpgradeButton(props) {
  const {
    id,
    onClick,
    nextPlan,
    changeEditionId,
    accessLevel,
  } = props;
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const status = useSelector(state => selectors.getStatus(state, id)?.status);
  const showWizard = useSelector(state => selectors.getStatus(state, id)?.showWizard);

  useEffect(() => {
    if (showWizard) {
      dispatch(actions.integrationApp.upgrade.setStatus(id, { showWizard: false }));
      history.push(buildDrawerUrl({
        path: drawerPaths.UPGRADE.INSTALL,
        baseUrl: match.url,
        params: { currentIntegrationId: id, type: 'parent' },
      }));
    }
  }, [dispatch, history, id, match.url, showWizard]);

  if (status === 'inProgress') {
    return (
      <TextButton
        startIcon={<Spinner size="small" />}
      >
        Upgrading...
      </TextButton>
    );
  }

  return (
    <ButtonWithTooltip
      tooltipProps={{title: `Upgrade to a ${nextPlan} plan`}}
      >
      <FilledButton
        sx={{margin: 1}}
        onClick={onClick}
        disabled={!changeEditionId || accessLevel === 'monitor'}
        data-test="upgrade"
        >
        Upgrade
      </FilledButton>
    </ButtonWithTooltip>
  );
}

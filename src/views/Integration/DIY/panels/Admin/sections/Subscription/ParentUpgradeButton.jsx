import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Spinner from '../../../../../../../components/Spinner';
import FilledButton from '../../../../../../../components/Buttons/FilledButton';
import ButtonWithTooltip from '../../../../../../../components/Buttons/ButtonWithTooltip';
import { selectors } from '../../../../../../../reducers';
import { buildDrawerUrl, drawerPaths } from '../../../../../../../utils/rightDrawer';
import TextButton from '../../../../../../../components/Buttons/TextButton';

export default function ParentUpgradeButton(props) {
  const {
    id,
    className,
    onClick,
    nextPlan,
    changeEditionId,
  } = props;
  const history = useHistory();
  const match = useRouteMatch();
  const [isInProgress, setIsInProgress] = useState(false);
  const status = useSelector(state => selectors.getStatus(state, id)?.status);
  const showWizard = useSelector(state => selectors.getStatus(state, id)?.showWizard);

  useEffect(() => {
    if (status === 'inProgress') {
      setIsInProgress(status);
    } else {
      setIsInProgress(false);
    }
  }, [status]);

  useEffect(() => {
    if (showWizard === true) {
      history.push(buildDrawerUrl({
        path: drawerPaths.UPGRADE.INSTALL,
        baseUrl: match.url,
        params: { currentIntegrationId: id},
      }));
    }
  });

  // Next all the logic for upgrade button will be written
  if (isInProgress) {
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
        className={className}
        onClick={onClick}
        disabled={!changeEditionId}
      >
        Upgrade
      </FilledButton>
    </ButtonWithTooltip>
  );
}

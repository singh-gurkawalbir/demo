import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../../../actions';
import FilledButton from '../../../../../../../components/Buttons/FilledButton';
import RawHtml from '../../../../../../../components/RawHtml';
import useEnqueueSnackbar from '../../../../../../../hooks/enqueueSnackbar';
import { selectors } from '../../../../../../../reducers';
import messageStore from '../../../../../../../utils/messageStore';
import ParentUpgradeButton from './ParentUpgradeButton';

export default function RequestUpgradeButton(props) {
  const {
    id,
    className,
    license,
    isLicenseExpired,
    istwoDotZeroFrameWork,
    handleUpgrade,
    handleUpgradeEdition,
    childIntegrationsCount,
  } = props;

  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const status = useSelector(state => selectors.getStatus(state, id)?.status);
  const showMessage = useSelector(state => selectors.getStatus(state, id)?.showMessage);
  const showFinalMessage = useSelector(state => selectors.getStatus(state, id)?.showFinalMessage);
  const isChildLicenseInUpgrade = useSelector(state => selectors.isChildLicenseInUpgrade(state, id));
  const accessLevel = useSelector(
    state => selectors.resourcePermissions(state, 'integrations', id).accessLevel
  );
  const currentChild = useSelector(state => selectors.currentChildUpgrade(state));

  const {
    upgradeText,
    upgradeRequested,
    nextPlan,
    _changeEditionId: changeEditionId,
  } = license;
  const disabledRequestUpgrade = (
    (istwoDotZeroFrameWork && accessLevel === 'monitor') ||
    upgradeRequested ||
    isLicenseExpired
  );

  useEffect(() => {
    if (status === 'done') {
      childIntegrationsCount
        ? enquesnackbar({message: <RawHtml html={messageStore('PARENT_WITH_CHILD_UPGRADE_MESSAGE', {plan: nextPlan})} />, variant: 'success'})
        : enquesnackbar({message: <RawHtml html={messageStore('PARENT_WITHOUT_CHILD_UPGRADE_MESSAGE', {plan: nextPlan})} />, variant: 'success'});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enquesnackbar, status]);

  useEffect(() => {
    if (showMessage && currentChild === 'none') {
      enquesnackbar({message: <RawHtml html={messageStore('CHILD_UPGRADE_LEFT_MESSAGE')} />, variant: 'success'});
      dispatch(actions.integrationApp.upgrade.setStatus(id, { showMessage: false }));
    }
  }, [currentChild, dispatch, enquesnackbar, id, showMessage]);

  useEffect(() => {
    if (showFinalMessage && !isChildLicenseInUpgrade) {
      enquesnackbar({message: <RawHtml html={messageStore('PARENT_AND_CHILD_FINAL_MESSAGE', {plan: nextPlan})} />, variant: 'success'});
      dispatch(actions.integrationApp.upgrade.setStatus(id, { showFinalMessage: false }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, enquesnackbar, isChildLicenseInUpgrade, showFinalMessage]);

  if (isChildLicenseInUpgrade) {
    return (
      <FilledButton
        className={className}
        disabled
        data-test="requestUpgrade"
      >
        Upgrade
      </FilledButton>
    );
  }
  if (upgradeText === '' && istwoDotZeroFrameWork) {
    return (
      <FilledButton
        className={className}
        disabled
        data-test="requestUpgrade"
      >
        Request upgrade
      </FilledButton>
    );
  }
  if (upgradeText && upgradeText === 'upgradeEdition') {
    return (
      <ParentUpgradeButton
        id={id}
        className={className}
        onClick={handleUpgradeEdition}
        nextPlan={nextPlan}
        changeEditionId={changeEditionId}
        accessLevel={accessLevel}
      />
    );
  }
  if (upgradeText && upgradeText !== 'upgradeEdition') {
    return (
      <FilledButton
        className={className}
        disabled={disabledRequestUpgrade}
        onClick={handleUpgrade}
        data-test="requestUpgrade"
      >
        {upgradeText}
      </FilledButton>
    );
  }
}

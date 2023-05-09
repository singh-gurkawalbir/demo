import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FilledButton } from '@celigo/fuse-ui';
import actions from '../../../../../../../actions';
import ErrorContent from '../../../../../../../components/ErrorContent';
import RawHtml from '../../../../../../../components/RawHtml';
import useEnqueueSnackbar from '../../../../../../../hooks/enqueueSnackbar';
import { selectors } from '../../../../../../../reducers';
import messageStore from '../../../../../../../utils/messageStore';
import ParentUpgradeButton from './ParentUpgradeButton';

export default function RequestUpgradeButton(props) {
  const {
    id,
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
  const errMessage = useSelector(state => selectors.getStatus(state, id)?.errMessage);
  const showMessage = useSelector(state => selectors.getStatus(state, 'successMessageFlags')?.showMessage);
  const showFinalMessage = useSelector(state => selectors.getStatus(state, 'successMessageFlags')?.showFinalMessage);
  const showChildLeftMessageFlag = useSelector(state => selectors.getStatus(state, 'successMessageFlags')?.showChildLeftMessageFlag);
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
    isHighestPlan,
  } = license;
  const disabledRequestUpgrade = (
    (istwoDotZeroFrameWork && accessLevel === 'monitor') ||
    upgradeRequested ||
    isLicenseExpired
  );

  useEffect(() => {
    if (status === 'done') {
      if (childIntegrationsCount) {
        enquesnackbar({message: <RawHtml html={messageStore('SUBSCRIPTION.ARENT_WITH_CHILD_UPGRADE_MESSAGE', {plan: nextPlan})} />, variant: 'success'});
      } else if (isHighestPlan) {
        enquesnackbar({message: <RawHtml html={messageStore('SUBSCRIPTION.PARENT_WITHOUT_CHILD_UPGRADE_MESSAGE_WITH_NO_FURTHER_PLANS', {plan: nextPlan})} />, variant: 'success'});
      } else {
        enquesnackbar({message: <RawHtml html={messageStore('SUBSCRIPTION.PARENT_WITHOUT_CHILD_UPGRADE_MESSAGE', {plan: nextPlan})} />, variant: 'success'});
      }
      dispatch(actions.integrationApp.upgrade.deleteStatus(id));
    }

    if (status === 'error') {
      dispatch(actions.integrationApp.upgrade.setStatus(id, {
        status: 'hold',
      }));
      enquesnackbar({
        message: <ErrorContent
          error={messageStore('SUBSCRIPTION.PARENT_UPGRADE_ERROR_MESSAGE',
            {
              plan: nextPlan,
              errorMessage: errMessage,
            }
          )} />,
        variant: 'error',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (showMessage && currentChild === 'none' && showChildLeftMessageFlag) {
      enquesnackbar({message: <RawHtml html={messageStore('SUBSCRIPTION.HILD_UPGRADE_LEFT_MESSAGE')} />, variant: 'success'});
      dispatch(actions.integrationApp.upgrade.setStatus('successMessageFlags', { showMessage: false, showChildLeftMessageFlag: false }));
    }
  }, [currentChild, dispatch, enquesnackbar, id, showChildLeftMessageFlag, showMessage]);

  useEffect(() => {
    if (showFinalMessage && !isChildLicenseInUpgrade) {
      isHighestPlan
        ? enquesnackbar({message: <RawHtml html={messageStore('SUBSCRIPTION.PARENT_AND_CHILD_FINAL_MESSAGE_WITH_NO_FURTHER_PLANS', {plan: nextPlan})} />, variant: 'success'})
        : enquesnackbar({message: <RawHtml html={messageStore('SUBSCRIPTION.PARENT_AND_CHILD_FINAL_MESSAGE', {plan: nextPlan})} />, variant: 'success'});
      dispatch(actions.integrationApp.upgrade.setStatus('successMessageFlags', { showFinalMessage: false }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, enquesnackbar, isChildLicenseInUpgrade, showFinalMessage]);

  if (isChildLicenseInUpgrade && !changeEditionId) {
    return (
      <FilledButton
        sx={{margin: 1}}
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
        sx={{margin: 1}}
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
        sx={{margin: 1}}
        disabled={disabledRequestUpgrade}
        onClick={handleUpgrade}
        data-test="requestUpgrade"
      >
        {upgradeText}
      </FilledButton>
    );
  }
}

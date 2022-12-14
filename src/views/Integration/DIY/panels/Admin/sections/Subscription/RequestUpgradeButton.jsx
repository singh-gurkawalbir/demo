import React from 'react';
import { useSelector } from 'react-redux';
import FilledButton from '../../../../../../../components/Buttons/FilledButton';
import { selectors } from '../../../../../../../reducers';
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
  } = props;

  const isChildLicenseInUpgrade = useSelector(state => selectors.isChildLicenseInUpgrade(state, id));
  const accessLevel = useSelector(
    state => selectors.resourcePermissions(state, 'integrations', id).accessLevel
  );

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

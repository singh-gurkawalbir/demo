import React from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import DynaCheckbox from './DynaCheckbox';
import { USER_ACCESS_LEVELS } from '../../../../utils/constants';

export default function DynaCheckboxForResetFields(props) {
  const licenseActionDetails = useSelector(state =>
    selectors.platformLicenseWithMetadata(state)
  );
  const accessLevel = useSelector(
    state => selectors.resourcePermissions(state).accessLevel
  );
  const environment = useSelector(
    state => selectors.userPreferences(state).environment
  );
  const isSandbox = environment === 'sandbox';
  let enabled = false;
  if (
    [
      USER_ACCESS_LEVELS.ACCOUNT_OWNER,
      USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
    ].includes(accessLevel)
  ) {
    if (isSandbox) {
      enabled = licenseActionDetails?.type === 'endpoint' && licenseActionDetails?.totalNumberofSandboxTradingPartners > 0;
    } else {
      enabled = licenseActionDetails?.type === 'endpoint' && licenseActionDetails?.totalNumberofProductionTradingPartners > 0;
    }
  }

  return <DynaCheckbox {...props} disabled={!enabled} />;
}

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
  let enabled = false;
  if (
    [
      USER_ACCESS_LEVELS.ACCOUNT_OWNER,
      USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
    ].includes(accessLevel)
  ) {
    enabled = licenseActionDetails?.type === 'endpoint' && licenseActionDetails?.totalNumberofTradingPartners > 0;
  }

  return <DynaCheckbox {...props} disabled={!enabled} />;
}

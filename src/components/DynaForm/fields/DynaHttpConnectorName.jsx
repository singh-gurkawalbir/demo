import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { emptyObject } from '../../../constants';
import { applicationsList } from '../../../constants/applications';
import { useSelectorMemo } from '../../../hooks';
import { selectors } from '../../../reducers';
import DynaText from './DynaText';

export default function DynaHttpConnectorName(props) {
  const {
    isApplicationPlaceholder = false,
    isVanConnector = false,
    placeholder,
    disabled,
    disableText = false,
  } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const match = isApplicationPlaceholder || isVanConnector ? useRouteMatch() : {};
  const { id: resourceId, resourceType } = match.params || {};
  let dataResourceType;
  const { merged } =
  useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  ) || {};

  const staggedResource = merged || emptyObject;
  const connection = useSelector(
    state =>
      selectors.resource(state, 'connections', (staggedResource?._connectionId || staggedResource?._id)) ||
      emptyObject
  );
  const applications = applicationsList().filter(app => app?._httpConnectorId);
  const app = applications.find(a => a._httpConnectorId === (connection?.http?._httpConnectorId || connection?._httpConnectorId)) || {};

  if (resourceType === 'connections') {
    dataResourceType = 'connection';
  } else {
    dataResourceType = (merged?.isLookup === true) ? 'lookup' : resourceType?.slice(0, 6);
  }

  const applicationPlaceholder = isApplicationPlaceholder ? `${(merged.application || app.name)} ${dataResourceType}` : '';

  const updatedLabel = `Name your ${dataResourceType}`;
  const resource = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  )?.merged || emptyObject;

  const licenseActionDetails = useSelector(state =>
    selectors.platformLicenseWithMetadata(state)
  );
  const isVanLicenseAbsent = (isVanConnector && licenseActionDetails.van === false);

  const finalPlaceHolder = isApplicationPlaceholder && (merged?.http?._httpConnectorId || merged?.isHttpConnector || merged?._httpConnectorId || merged?.http?._httpConnectorResourceId) ? applicationPlaceholder : placeholder;
  const disableUpdate = resource.type === 'van' ? isVanLicenseAbsent : disabled || disableText;

  return (
    <DynaText
      {...props} placeholder={finalPlaceHolder} label={updatedLabel} disabled={disableUpdate}
/>
  );
}

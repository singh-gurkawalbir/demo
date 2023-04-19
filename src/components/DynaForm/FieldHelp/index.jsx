import React from 'react';
import { useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { selectors } from '../../../reducers';
import Help from '../../Help';

export default function FieldHelp({
  id,
  label,
  helpText,
  helpKey,
  resourceContext,
  escapeUnsecuredDomains,
  noApi = false,
  disablePortal,
}) {
  const { developer } = useSelector(state => selectors.userProfile(state));

  return (
    <Help
      data-test={`help-${id}`}
      title={label || 'Field help'}
      fieldPath={developer && !noApi && helpKey}
      helpKey={helpKey}
      helpText={helpText}
      fieldId={id}
      resourceType={resourceContext && resourceContext.resourceType}
      escapeUnsecuredDomains={escapeUnsecuredDomains}
      disablePortal={disablePortal}
      sx={{
        ml: 0.5,
        padding: '3px',
      }}
    />
  );
}

import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import DynaSelectOptionsGenerator from '../DynaRefreshableSelect';

export default function DynaSalesforceSObject(props) {
  const {connectionId} = props;

  const isIAResource = useSelector(state => {
    const resource =
      selectors.resource(state, 'connections', connectionId) || {};

    return !!(resource?._connectorId);
  });
  // For sObject field, the value is not shown if the sObject is not triggerable
  // For IA's, as the sObject field is configured and cLocked, to show the sObject we are not filtering them based on triggerable value
  const filterKey = isIAResource ? 'salesforce-sObjects' : 'salesforce-sObjects-triggerable';

  return (
    <DynaSelectOptionsGenerator
      {...props}
      filterKey={filterKey}
  />
  );
}

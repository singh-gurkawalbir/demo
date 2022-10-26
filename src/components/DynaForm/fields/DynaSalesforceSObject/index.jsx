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
  const filterKey = isIAResource ? 'salesforce-sObjects' : 'salesforce-sObjects-triggerable';

  return (
    <DynaSelectOptionsGenerator
      {...props}
      filterKey={filterKey}
  />
  );
}

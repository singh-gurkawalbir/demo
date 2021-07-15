import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import Tabs from './Tabs';
import LoadResources from '../../components/LoadResources';
import CeligoPageBar from '../../components/CeligoPageBar';

export default function Dashboard() {
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

  if (!isUserInErrMgtTwoDotZero) {
    return null;
  }

  return (
    <LoadResources required resources="flows,integrations"><CeligoPageBar
      title="Dashboard" />
      <Tabs />
    </LoadResources>
  );
}

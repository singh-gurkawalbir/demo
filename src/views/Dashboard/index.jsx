import React from 'react';
import Tabs from './Tabs';
import LoadResources from '../../components/LoadResources';
import CeligoPageBar from '../../components/CeligoPageBar';

export default function Dashboard() {
  return (
    <LoadResources required resources="flows,integrations"><CeligoPageBar
      title="Dashboard" />
      <Tabs />
    </LoadResources>
  );
}

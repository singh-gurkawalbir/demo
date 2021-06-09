import React from 'react';
import Tabs from './Tabs';
import CeligoPageBar from '../../components/CeligoPageBar';

export default function Dashboard() {
  return (
    <><CeligoPageBar
      title="Dashboard" />
      <Tabs />
    </>
  );
}

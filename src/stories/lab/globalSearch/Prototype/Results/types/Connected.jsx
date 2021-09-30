import React from 'react';
import GenericRow from './Generic';
import OnlineStatus from '../../../../../../components/OnlineStatus';

export default function Connected(props) {
  return (
    <GenericRow {...props}>
      <OnlineStatus offline={!props.result.isOnline} />
    </GenericRow>
  );
}


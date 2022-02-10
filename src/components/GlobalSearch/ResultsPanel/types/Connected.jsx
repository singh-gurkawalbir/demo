import React from 'react';
import GenericRow from './Generic';
import OnlineStatus from '../../../OnlineStatus';

export default props => (
  <GenericRow {...props}>
    <OnlineStatus offline={!props.result.isOnline} />
  </GenericRow>
);


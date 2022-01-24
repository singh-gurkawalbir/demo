import React from 'react';
import GenericRow from './Generic';
import OnlineStatus from '../../../../../../components/OnlineStatus';

export default React.forwardRef((props, ref) => (
  <GenericRow ref={ref} {...props}>
    <OnlineStatus offline={!props.result.isOnline} />
  </GenericRow>
));


import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { useState, Fragment, useCallback } from 'react';
// import FlowSchedule from '../../../../FlowSchedule';
import MapDataIcon from '../../../../icons/MapDataIcon';
// import ModalDialog from '../../../../ModalDialog';
import * as selectors from '../../../../../reducers';

export default function MappingCell(props) {
  const [showMapping, setShowMapping] = useState(false);
  const handleClick = useCallback(() => {
    setShowMapping(!showMapping);
  }, [showMapping]);
  const allowSchedule = useSelector(state =>
    selectors.flowAllowsScheduling(state, props._id)
  );

  if (!allowSchedule) return null;

  return (
    <Fragment>
      <IconButton onClick={handleClick}>
        <MapDataIcon />
      </IconButton>
      {showMapping && 'on'}
    </Fragment>
  );
}

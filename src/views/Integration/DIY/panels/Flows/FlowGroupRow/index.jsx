import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import SortableHandle from '../../../../../../components/Sortable/SortableHandle';
import { selectors } from '../../../../../../reducers';
import FlowSectionTitle from '../../../../common/FlowSectionTitle';

export default function FlowGroupRow({
  rowData,
  integrationId,
  classes,
  isDragInProgress = false,
  isRowDragged = false,
}) {
  const { sectionId, title } = rowData;
  const [showGripper, setShowGripper] = useState(false);
  const errorCountByFlowGroup = useSelector(
    state =>
      selectors.integrationErrorsPerFlowGroup(state, integrationId)
  );

  const handleOnMouseEnter = useCallback(() => {
    if (!isDragInProgress) {
      setShowGripper(true);
    }
  }, [isDragInProgress]);
  const handleOnMouseLeave = useCallback(() => {
    setShowGripper(false);
  }, []);

  useEffect(() => {
    if (isRowDragged) {
      setShowGripper(true);
    }
  }, [isRowDragged]);

  if (!sectionId) {
    return null;
  }

  return (
    <>
      <div
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        className={classes.rowContainer}>
        <SortableHandle isVisible={showGripper} />
        <NavLink
          data-public
          className={classes.listItem}
          activeClassName={classes.activeListItem}
          to={sectionId}
          data-test={sectionId}>
          <FlowSectionTitle title={title} errorCount={errorCountByFlowGroup[sectionId]} />
        </NavLink>
      </div>
    </>
  );
}

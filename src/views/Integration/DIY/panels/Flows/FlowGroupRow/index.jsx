import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import SortableHandle from '../../../../../../components/Sortable/SortableHandle';
import { selectors } from '../../../../../../reducers';
import { UNASSIGNED_SECTION_ID } from '../../../../../../utils/constants';
import FlowSectionTitle from '../../../../common/FlowSectionTitle';

const useStyles = makeStyles(theme => ({
  rowContainer: {
    display: 'flex',
    minHeight: 42,
    alignItems: 'center',
    position: 'relative',
    '&>div': {
      paddingTop: 0,
      minWidth: theme.spacing(3),
    },
    '&>a': {
      color: theme.palette.text.primary,
      padding: theme.spacing(1, 0),
      '&>span': {
        gridTemplateColumns: theme.spacing(12, 7),
      },
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    '&:before': {
      content: '""',
      width: '3px',
      top: 0,
      height: '100%',
      position: 'absolute',
      background: 'transparent',
      left: '0px',
    },
    '&:hover': {
      '&:before': {
        background: theme.palette.primary.main,
      },
    },
  },
  active: {
    '&>a': {
      color: theme.palette.primary.main,
    },
  },
}));
export default function FlowGroupRow({
  rowData,
  integrationId,
  className,
  isDragInProgress = false,
  isRowDragged = false,
  hasUnassignedSection,
  flows,
}) {
  const { params } = useRouteMatch();
  const { sectionId, title } = rowData;
  const [showGripper, setShowGripper] = useState(false);
  const groupHasNoFlows = sectionId === UNASSIGNED_SECTION_ID ? false : !flows.find(flow => flow._flowGroupingId === sectionId);
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
  const classes = useStyles();

  useEffect(() => {
    if (isRowDragged) {
      setShowGripper(true);
    }
  }, [isRowDragged]);

  if (!sectionId) {
    return null;
  }

  if (sectionId === UNASSIGNED_SECTION_ID && !hasUnassignedSection) return null;

  return (
    <div
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      className={clsx(classes.rowContainer, params?.sectionId === sectionId ? classes.active : '', className)}>
      <SortableHandle isVisible={showGripper} />
      <NavLink
        data-public
        className={classes.listItem}
        activeClassName={classes.activeListItem}
        to={sectionId}
        data-test={sectionId}>
        <FlowSectionTitle title={title} errorCount={errorCountByFlowGroup[sectionId]} groupHasNoFlows={groupHasNoFlows} />
      </NavLink>
    </div>
  );
}

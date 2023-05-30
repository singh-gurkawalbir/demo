import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useRouteMatch, generatePath } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import SortableHandle from '../../../../../../components/Sortable/SortableHandle';
import { selectors } from '../../../../../../reducers';
import { UNASSIGNED_SECTION_ID } from '../../../../../../constants';
import FlowSectionTitle from '../../../../common/FlowSectionTitle';

const useStyles = makeStyles(theme => ({
  rowContainer: {
    display: 'flex',
    minHeight: 42,
    alignItems: 'center',
    position: 'relative',
    '&>div': {
      paddingTop: 0,
    },
    '&>a': {
      color: theme.palette.text.primary,
      padding: theme.spacing(1, 0),
      '&>span': {
        gridTemplateColumns: theme.spacing(12, 7),
        gridColumnGap: 0,
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
    '&:before': {
      content: '""',
      width: '3px',
      top: 0,
      height: '100%',
      position: 'absolute',
      left: '0px',
      background: theme.palette.primary.main,
    },
    '&>a': {
      fontWeight: 'bold',
      color: theme.palette.primary.main,
    },
  },
  listItem: {
    width: theme.spacing(12),
    '&>span>span:last-child': {
      paddingLeft: theme.spacing(1),
      width: theme.spacing(8),
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
  const match = useRouteMatch();
  const { sectionId, title } = rowData;
  const [showGripper, setShowGripper] = useState(false);
  const groupHasNoFlows = sectionId === UNASSIGNED_SECTION_ID ? false : !flows.some(flow => flow._flowGroupingId === sectionId);
  const errorCountByFlowGroup = useSelector(
    state =>
      selectors.integrationErrorsPerFlowGroup(state, integrationId)
  );

  const handleOnMouseEnter = useCallback(() => {
    // We don't show sortable Handle for Unassigned flow group
    if (!isDragInProgress && sectionId !== UNASSIGNED_SECTION_ID) {
      setShowGripper(true);
    }
  }, [isDragInProgress, sectionId]);
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
      className={clsx(classes.rowContainer, match.params?.sectionId === sectionId ? classes.active : '', className)}>
      <SortableHandle isVisible={showGripper} />
      <NavLink
        className={classes.listItem}
        activeClassName={classes.activeListItem}
        to={generatePath(match.path, { ...match.params, sectionId })}
        data-test={sectionId}>
        <FlowSectionTitle title={title} errorCount={errorCountByFlowGroup[sectionId]} groupHasNoFlows={groupHasNoFlows} />
      </NavLink>
    </div>
  );
}

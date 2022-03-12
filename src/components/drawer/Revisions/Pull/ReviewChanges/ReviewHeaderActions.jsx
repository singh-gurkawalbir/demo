import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import RefreshIcon from '../../../../icons/RefreshIcon';
import ExpandWindowIcon from '../../../../icons/ExpandWindowIcon';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { getTextAfterCount } from '../../../../../utils/string';
import StatusCircle from '../../../../StatusCircle';
import ActionGroup from '../../../../ActionGroup';
import CeligoDivider from '../../../../CeligoDivider';
import RevisionsGuide from '../../RevisionsGuide';

const useStyles = makeStyles(() => ({
  drawerHeaderActions: {
    width: '100%',
    display: 'flex',
  },
  conflictStatus: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 5,
  },
  expand: {
    minWidth: 110,
    display: 'flex',
    alignItems: 'center',
  },
}));

const Conflicts = ({count}) => {
  const classes = useStyles();

  return (
    <>
      <CeligoDivider position="left" />
      <div className={classes.conflictStatus}>
        <StatusCircle variant={count ? 'error' : 'success'} size="mini" />
        <span>{getTextAfterCount('conflict', count)}</span>
      </div>
    </>
  );
};

export default function ReviewHeaderActions({ numConflicts, integrationId, revId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const isDiffExpanded = useSelector(state => selectors.isDiffExpanded(state, integrationId));
  const isResourceComparisonInProgress = useSelector(state => selectors.isResourceComparisonInProgress(state, integrationId));

  const handleRefresh = () => {
    dispatch(actions.integrationLCM.compare.pullRequest(integrationId, revId));
  };

  const handleToggleExpand = () => {
    dispatch(actions.integrationLCM.compare.toggleExpandAll(integrationId));
  };

  return (
    <>
      <div className={classes.drawerHeaderActions}>
        { !isResourceComparisonInProgress && <Conflicts count={numConflicts} /> }
        <ActionGroup position="right">
          <IconButton
            disabled={isResourceComparisonInProgress}
            size="small"
            data-test="expandAll"
            onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
          <CeligoDivider />
          <div className={classes.expand}>
            <IconButton
              size="small"
              data-test="expandAll"
              onClick={handleToggleExpand}>
              <ExpandWindowIcon />
            </IconButton>
            {isDiffExpanded ? 'Collapse all' : 'Expand all'}
          </div>
          <RevisionsGuide />
        </ActionGroup>
      </div>
    </>
  );
}

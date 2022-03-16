import React, { useEffect } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import ExpandWindowIcon from '../../../icons/ExpandWindowIcon';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';

const useStyles = makeStyles(() => ({
  expand: {
    minWidth: 110,
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function ExpandAllResourceDiff({ integrationId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const isDiffExpanded = useSelector(state => selectors.isDiffExpanded(state, integrationId));
  const isResourceComparisonInProgress = useSelector(state => selectors.isResourceComparisonInProgress(state, integrationId));

  const handleToggleExpand = () => {
    dispatch(actions.integrationLCM.compare.toggleExpandAll(integrationId));
  };

  useEffect(
    () => () => dispatch(actions.integrationLCM.compare.clear(integrationId)),
    [dispatch, integrationId]);

  return (
    <div className={classes.expand}>
      <IconButton
        size="small"
        data-test="expandAll"
        disabled={isResourceComparisonInProgress}
        onClick={handleToggleExpand}>
        <ExpandWindowIcon />
      </IconButton>
      {isDiffExpanded ? 'Collapse all' : 'Expand all'}
    </div>
  );
}

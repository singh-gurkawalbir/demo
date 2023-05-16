import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import { TextButton } from '@celigo/fuse-ui';
import ExpandWindowIcon from '../../../../icons/ExpandWindowIcon';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CollapseWindowIcon from '../../../../icons/CollapseWindowIcon';

const useStyles = makeStyles(theme => ({
  expand: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
  },
}));

export default function ExpandAllResourceDiff({ integrationId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const isDiffExpanded = useSelector(state => selectors.isDiffExpanded(state, integrationId));
  const hasReceivedResourceDiff = useSelector(state => selectors.hasReceivedResourceDiff(state, integrationId));

  const handleToggleExpand = () => {
    dispatch(actions.integrationLCM.compare.toggleExpandAll(integrationId));
  };

  return (
    <div className={classes.expand}>
      <TextButton
        startIcon={isDiffExpanded ? <CollapseWindowIcon /> : <ExpandWindowIcon />}
        size="small"
        data-test="expandAll"
        disabled={!hasReceivedResourceDiff}
        onClick={handleToggleExpand}>
        {isDiffExpanded ? 'Collapse all' : 'Expand all'}
      </TextButton>
    </div>
  );
}

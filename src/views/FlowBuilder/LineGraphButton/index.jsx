import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import GraphIcon from '../../../components/icons/GraphIcon';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';

const useStyles = makeStyles(theme => ({
  chartsIcon: {
    padding: 0,
    marginRight: 12,
    color: theme.palette.secondary.main,
    '&:hover': {
      background: 'none',
      color: theme.palette.primary.main,
    },
  },
  iconGraph: {

    width: 28,
  },
}));

export default function LineGraphButton({flowId, onClickHandler}) {
  const classes = useStyles();
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  ).merged;
  const flowJobExists = useSelector(state => {
    const latestJobs = selectors.latestFlowJobsList(state, flowId)?.data || [];

    return !!latestJobs.length;
  });

  const disableButton = !flow.lastExecutedAt && !flowJobExists;

  return (
    <IconButton
      disabled={disableButton}
      className={classes.chartsIcon}
      data-test="charts"
      title="Dashboard"
      onClick={onClickHandler('charts')}>
      <GraphIcon className={classes.iconGraph} />
    </IconButton>
  );
}

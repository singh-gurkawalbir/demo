import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import GraphIcon from '../../../components/icons/GraphIcon';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';

const useStyles = makeStyles(theme => ({
  chartsIcon: {
    padding: 0,
    marginRight: theme.spacing(2),
    '&:hover': {
      color: theme.palette.primary.main,
      background: 'none',
    },
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
    const latestJobs = selectors.latestFlowJobs(state) || [];

    return !!latestJobs.find(job => job._flowId === flowId);
  });

  const disableButton = !flow.lastExecuted && !flowJobExists;

  return (
    <IconButton
      disabled={disableButton}
      className={classes.chartsIcon}
      data-test="charts"
      onClick={onClickHandler('charts')}>
      <GraphIcon />
    </IconButton>
  );
}

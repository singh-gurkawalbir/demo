import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import GraphIcon from '../../../components/icons/GraphIcon';
import IconButtonWithTooltip from '../../../components/IconButtonWithTooltip';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';
import { emptyObject } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
  chartsIcon: {
    padding: theme.spacing(1, 0),
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
  )?.merged || emptyObject;
  const flowJobExists = useSelector(state => {
    const latestJobs = selectors.latestFlowJobsList(state, flowId)?.data || [];

    return !!latestJobs.length;
  });

  const disableButton = !flow.lastExecutedAt && !flowJobExists;

  return (
    <IconButtonWithTooltip
      disabled={disableButton}
      className={classes.chartsIcon}
      data-test="charts"
      tooltipProps={{title: 'Dashboard'}}
      onClick={onClickHandler('charts')}>
      <GraphIcon className={classes.iconGraph} />
    </IconButtonWithTooltip>
  );
}

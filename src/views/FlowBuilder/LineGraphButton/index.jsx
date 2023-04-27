import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import GraphIcon from '../../../components/icons/GraphIcon';
import IconButtonWithTooltip from '../../../components/IconButtonWithTooltip';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';
import { emptyObject } from '../../../constants';
import { drawerPaths } from '../../../utils/rightDrawer';

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
    width: theme.spacing(3),
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
      tooltipProps={{title: 'View analytics'}}
      onClick={onClickHandler(drawerPaths.FLOW_BUILDER.ANALYTICS)}>
      <GraphIcon className={classes.iconGraph} />
    </IconButtonWithTooltip>
  );
}

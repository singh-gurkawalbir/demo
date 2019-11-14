import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import TimeAgo from 'react-timeago';
import { makeStyles } from '@material-ui/styles';
import { Typography, Grid, Button } from '@material-ui/core';
import { confirmDialog } from '../../../../../components/ConfirmDialog';
import actions from '../../../../../actions';
import RunIcon from '../../../../../components/icons/RunIcon';
import OnOffSwitch from '../../../../../components/SwitchToggle';
import InfoIconButton from '../InfoIconButton';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    margin: theme.spacing(1, 2),
  },
  cardContent: {
    display: 'flex',
    flexGrow: 1,
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.secondary.lightest}`,
    borderLeft: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  details: {
    flexGrow: 1,
  },
  statusBar: {
    width: 6,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  success: {
    backgroundColor: theme.palette.success.main,
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
  },
}));

export default function FlowCard({
  name,
  status = 'success',
  description,
  lastModified,
  schedule,
  flowId,
  disabled,
  disableCard = false,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  function handleDisableClick() {
    const message = `Are you sure you want to ${
      disabled ? 'enable' : 'disable'
    } ${name || flowId}?`;

    confirmDialog({
      title: 'Confirm',
      message,
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            const patchSet = [
              {
                op: 'replace',
                path: '/disabled',
                value: !disabled,
              },
            ];

            dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
            dispatch(actions.resource.commitStaged('flows', flowId, 'value'));
          },
        },
      ],
    });
  }

  // TODO: This function needs to be enhanced to handle all
  // the various cases.. realtime, scheduled, cron, not scheduled, etc...
  function getRunLabel(schedule) {
    if (schedule) {
      return `Runs every: ${schedule}`;
    }

    return 'Never Runs';
  }

  return (
    <div className={classes.root}>
      <div className={clsx(classes.statusBar, classes[status])} />
      <div className={classes.cardContent}>
        <Grid item xs={9}>
          <Grid container alignItems="center">
            <Link to={`flowBuilder/${flowId}`}>
              <Typography color="primary" variant="h4">
                {name}
              </Typography>
            </Link>
            <InfoIconButton info={description} />
          </Grid>
          <Typography variant="caption" component="span">
            {getRunLabel(schedule)} | Last Modified{' '}
            <TimeAgo date={lastModified} />
          </Typography>
        </Grid>
        <Grid container item xs={3} justify="flex-end" alignItems="center">
          <OnOffSwitch
            disabled={disableCard}
            on={!disableCard && !disabled}
            onClick={handleDisableClick}
          />
          <Button>
            <RunIcon />
          </Button>
        </Grid>
      </div>
    </div>
  );
}

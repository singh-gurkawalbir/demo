import clsx from 'clsx';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import { makeStyles } from '@material-ui/styles';
import { Typography, Grid, IconButton } from '@material-ui/core';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import { defaultConfirmDialog } from '../../../../components/ConfirmDialog';
import FlowEllipsisMenu from '../../../../components/FlowEllipsisMenu';
import RunIcon from '../../../../components/icons/RunIcon';
import OnOffSwitch from '../../../../components/SwitchToggle';
import InfoIconButton from '../InfoIconButton';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    margin: theme.spacing(1, 2),
  },
  flowLink: {
    display: 'inline',
    transition: theme.transitions.create('color'),
    '&:hover': {
      color: theme.palette.primary.dark,
    },
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

export default function FlowCard({ flowId }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const flow = useSelector(state => selectors.flowDetails(state, flowId)) || {};
  const patchFlow = useCallback(
    (path, value) => {
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', flowId, 'value'));
    },
    [dispatch, flowId]
  );
  const flowName = flow.name || flow._Id;
  const handleActionClick = useCallback(
    action => () => {
      switch (action) {
        case 'disable':
          defaultConfirmDialog(
            `${flow.disabled ? 'enable' : 'disable'} ${flowName}?`,
            () => {
              patchFlow('/disabled', !flow.disabled);
            }
          );
          break;

        case 'run':
          dispatch(actions.flow.run({ flowId }));
          history.push(
            `/pg/integrations/${flow._integrationId || 'none'}/dashboard`
          );

          break;

        default:
      }
    },
    [
      dispatch,
      flow._integrationId,
      flow.disabled,
      flowId,
      flowName,
      history,
      patchFlow,
    ]
  );
  const { name, description, lastModified, disabled } = flow;
  // TODO: set status based on flow criteria...
  const status = 'success';
  // TODO: this property was copied from the old flow list page... i dont know what its for...
  const disableCard = false;

  // TODO: This function needs to be enhanced to handle all
  // the various cases.. realtime, scheduled, cron, not scheduled, etc...
  function getRunLabel() {
    if (flow.isReatime) return `Realtime`;

    if (flow.isSimpleExport) return 'Never runs';

    return 'Never Runs';
  }

  return (
    <div className={classes.root}>
      <div className={clsx(classes.statusBar, classes[status])} />
      <div className={classes.cardContent}>
        <Grid item xs={9}>
          <div>
            <Link to={`flowBuilder/${flowId}`}>
              <Typography
                color="primary"
                variant="h4"
                className={classes.flowLink}>
                {name}
              </Typography>
            </Link>
            <InfoIconButton info={description} />
          </div>
          <Typography variant="caption" component="span">
            {getRunLabel()} | Last Modified <TimeAgo date={lastModified} />
          </Typography>
        </Grid>
        <Grid container item xs={3} justify="flex-end" alignItems="center">
          <OnOffSwitch
            disabled={disableCard}
            on={!disableCard && !disabled}
            onClick={handleActionClick('disable')}
          />
          {flow.isRunnable && (
            <IconButton size="small" onClick={handleActionClick('run')}>
              <RunIcon />
            </IconButton>
          )}

          <FlowEllipsisMenu flowId={flowId} />
        </Grid>
      </div>
    </div>
  );
}

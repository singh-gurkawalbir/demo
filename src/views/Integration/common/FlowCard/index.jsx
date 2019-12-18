import clsx from 'clsx';
import { useCallback, useState } from 'react';
import cronstrue from 'cronstrue';
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
import SettingsIcon from '../../../../components/icons/SettingsIcon';
import OnOffSwitch from '../../../../components/SwitchToggle';
import InfoIconButton from '../InfoIconButton';
import FlowStartDateDialog from '../../../../components/DeltaFlowStartDate/Dialog';

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

export default function FlowCard({ flowId, excludeActions, storeId }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const flowDetails =
    useSelector(state => selectors.flowDetails(state, flowId)) || {};
  const [showDilaog, setShowDilaog] = useState(false);
  const patchFlow = useCallback(
    (path, value) => {
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', flowId, 'value'));
    },
    [dispatch, flowId]
  );
  const flowName = flowDetails.name || flowDetails._id;
  const handleRunDeltaFlow = useCallback(
    customStartDate => {
      dispatch(actions.flow.run({ flowId, customStartDate }));

      if (flowDetails._connectorId) {
        history.push(
          `/pg/integrationApp/${flowDetails._integrationId}/dashboard`
        );
      } else {
        history.push(
          `/pg/integrations/${flowDetails._integrationId || 'none'}/dashboard`
        );
      }
    },
    [
      dispatch,
      flowDetails._connectorId,
      flowDetails._integrationId,
      flowId,
      history,
    ]
  );
  const handleActionClick = useCallback(
    action => () => {
      switch (action) {
        case 'disable':
          defaultConfirmDialog(
            `${flowDetails.disabled ? 'enable' : 'disable'} ${flowName}?`,
            () => {
              if (flowDetails._connectorId) {
                dispatch(
                  actions.integrationApp.settings.update(
                    flowDetails._integrationId,
                    flowDetails._id,
                    storeId,
                    {
                      '/flowId': flowDetails._id,
                      '/disabled': !flowDetails.disabled,
                    },
                    { action: 'flowEnableDisable' }
                  )
                );
              } else {
                patchFlow('/disabled', !flowDetails.disabled);
              }
            }
          );

          break;

        case 'run':
          if (
            flowDetails.isDeltaFlow &&
            (!flowDetails._connectorId || !!flowDetails.showStartDateDialog)
          ) {
            setShowDilaog('true');
          } else {
            handleRunDeltaFlow();
          }

          break;

        default:
      }
    },
    [
      dispatch,
      flowDetails._connectorId,
      flowDetails._id,
      flowDetails._integrationId,
      flowDetails.disabled,
      flowDetails.isDeltaFlow,
      flowDetails.showStartDateDialog,
      flowName,
      handleRunDeltaFlow,
      patchFlow,
      storeId,
    ]
  );
  const { name, description, lastModified, disabled } = flowDetails;
  // TODO: set status based on flow criteria...
  const status = 'success';
  // TODO: this property was copied from the old flow list page... i dont know what its for...
  const disableCard = false;

  // TODO: This function needs to be enhanced to handle all
  // the various cases.. realtime, scheduled, cron, not scheduled, etc...
  function getRunLabel() {
    if (flowDetails.isRealtime) return `Realtime`;

    if (flowDetails.schedule)
      return `Runs ${cronstrue.toString(
        flowDetails.schedule.replace(/^\?/g, '0')
      )}`;

    if (flowDetails.isSimpleExport) return 'Never runs';

    return 'Never Runs';
  }

  const isIntegrationApp = !!flowDetails._connectorId;
  const flowBuilderTo = isIntegrationApp
    ? `/pg/integrationApp/${flowDetails._integrationId}/flowBuilder/${flowId}`
    : `flowBuilder/${flowId}`;
  const closeDeltaDialog = () => {
    setShowDilaog(false);
  };

  return (
    <div className={classes.root}>
      <div className={clsx(classes.statusBar, classes[status])} />
      {showDilaog && flowDetails.isDeltaFlow && (
        <FlowStartDateDialog
          flowId={flowDetails._id}
          onClose={closeDeltaDialog}
          runDeltaFlow={handleRunDeltaFlow}
        />
      )}
      <div className={classes.cardContent}>
        <Grid item xs={9}>
          <div>
            <Link to={flowBuilderTo}>
              <Typography
                data-test={flowName}
                color="primary"
                variant="h4"
                className={classes.flowLink}>
                {name || `Unnamed (id: ${flowId})`}
              </Typography>
            </Link>
            <InfoIconButton info={description} />
          </div>
          <Typography variant="caption" component="span">
            {getRunLabel()} | Last Modified <TimeAgo date={lastModified} />
          </Typography>
        </Grid>
        <Grid container item xs={3} justify="flex-end" alignItems="center">
          {!flowDetails.disableSlider && (
            <OnOffSwitch
              data-test={`toggleOnAndOffFlow${flowName}`}
              disabled={disableCard}
              on={!disableCard && !disabled}
              onClick={handleActionClick('disable')}
            />
          )}

          <IconButton
            disabled={!flowDetails.isRunnable}
            size="small"
            data-test={`runFlow${flowName}`}
            onClick={handleActionClick('run')}>
            <RunIcon />
          </IconButton>

          {flowDetails._connectorId && (
            <IconButton
              size="small"
              disabled={!flowDetails.hasSettings}
              component={Link}
              data-test={`flowSettings${flowName}`}
              to={`${history.location.pathname}/${flowId}/settings`}>
              <SettingsIcon />
            </IconButton>
          )}

          <FlowEllipsisMenu flowId={flowId} exclude={excludeActions} />
        </Grid>
      </div>
    </div>
  );
}

import clsx from 'clsx';
import { useCallback } from 'react';
import cronstrue from 'cronstrue';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import { makeStyles } from '@material-ui/styles';
import { Typography, Grid, IconButton } from '@material-ui/core';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import useConfirmDialog from '../../../../components/ConfirmDialog';
import FlowEllipsisMenu from '../../../../components/FlowEllipsisMenu';
import RunFlowButton from '../../../../components/RunFlowButton';
import SettingsIcon from '../../../../components/icons/SettingsIcon';
// import DataloaderIcon from '../../../../components/icons/DataLoaderIcon';
import OnOffSwitch from '../../../../components/SwitchToggle';
import InfoIconButton from '../InfoIconButton';
import { getIntegrationAppUrlName } from '../../../../utils/integrationApps';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';

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
    wordBreak: 'break-word',
  },
  details: {
    flexGrow: 1,
  },
  statusBar: {
    width: 6,
    minWidth: 6,
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
  dataloaderTag: {
    border: 0,
    backgroundColor: theme.palette.secondary.lightest,
    color: theme.palette.secondary.light,
    borderRadius: 5,
    padding: [[1, 8, 0, 8]],
    marginRight: theme.spacing(2),
  },
}));

export default function FlowCard({ flowId, excludeActions, storeId }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const isLicenseValidToEnableFlow = useSelector(
    state => selectors.isLicenseValidToEnableFlow(state),
    (left, right) =>
      left.message === right.message && left.enable === right.enable
  );
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const flowDetails =
    useSelector(state => selectors.flowDetails(state, flowId)) || {};
  const isDataloader = flowDetails.isSimpleImport;
  const integrationAppName = useSelector(state => {
    const integrationApp = selectors.resource(
      state,
      'integrations',
      flowDetails._integrationId
    );

    if (integrationApp && integrationApp._connectorId && integrationApp.name) {
      return getIntegrationAppUrlName(integrationApp.name);
    }

    return '';
  });
  const { defaultConfirmDialog } = useConfirmDialog();
  const patchFlow = useCallback(
    (path, value) => {
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', flowId, 'value'));
    },
    [dispatch, flowId]
  );
  const flowName = flowDetails.name || flowDetails._id;
  const handleOnRunStart = useCallback(() => {
    if (flowDetails._connectorId) {
      if (storeId) {
        history.push(
          `/pg/integrationapps/${integrationAppName}/${flowDetails._integrationId}/child/${storeId}/dashboard`
        );
      } else {
        history.push(
          `/pg/integrationapps/${integrationAppName}/${flowDetails._integrationId}/dashboard`
        );
      }
    } else {
      history.push(
        `/pg/integrations/${flowDetails._integrationId || 'none'}/dashboard`
      );
    }
  }, [
    flowDetails._connectorId,
    flowDetails._integrationId,
    history,
    integrationAppName,
    storeId,
  ]);
  const handleDisableClick = useCallback(() => {
    defaultConfirmDialog(
      `${flowDetails.disabled ? 'enable' : 'disable'} ${flowName}?`,
      () => {
        if (flowDetails._connectorId) {
          dispatch(
            actions.integrationApp.settings.update(
              flowDetails._integrationId,
              flowDetails._id,
              storeId,
              null,
              {
                '/flowId': flowDetails._id,
                '/disabled': !flowDetails.disabled,
              },
              { action: 'flowEnableDisable' }
            )
          );
        } else {
          if (flowDetails.disabled) {
            if (!isLicenseValidToEnableFlow.enable) {
              return enqueueSnackbar({
                message: isLicenseValidToEnableFlow.message,
                variant: 'error',
              });
            }
          }

          patchFlow('/disabled', !flowDetails.disabled);
        }
      }
    );
  }, [
    defaultConfirmDialog,
    dispatch,
    enqueueSnackbar,
    flowDetails._connectorId,
    flowDetails._id,
    flowDetails._integrationId,
    flowDetails.disabled,
    flowName,
    isLicenseValidToEnableFlow.enable,
    isLicenseValidToEnableFlow.message,
    patchFlow,
    storeId,
  ]);
  const { name, description, lastModified, disabled } = flowDetails;
  // TODO: set status based on flow criteria...
  const status = 'success';
  // TODO: this property was copied from the old flow list page... i don't know what its for...
  const disableCard = false;

  // TODO: This function needs to be enhanced to handle all
  // the various cases.. realtime, scheduled, cron, not scheduled, etc...
  function getRunLabel() {
    if (flowDetails.isRealtime) return `Realtime`;

    if (flowDetails.schedule)
      return `Runs ${cronstrue.toString(
        flowDetails.schedule.replace(/^\?/g, '0')
      )}`;

    if (isDataloader) return 'Manual Run';

    return 'Never Runs';
  }

  const isIntegrationApp = !!flowDetails._connectorId;
  const flowBuilderPathName = isDataloader ? 'dataLoader' : 'flowBuilder';
  const flowBuilderTo = isIntegrationApp
    ? `/pg/integrationApps/${integrationAppName}/${flowDetails._integrationId}/${flowBuilderPathName}/${flowId}`
    : `${flowBuilderPathName}/${flowId}`;

  return (
    <div className={classes.root}>
      <div className={clsx(classes.statusBar, classes[status])} />
      <div className={classes.cardContent}>
        <Grid item xs={8}>
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
        <Grid container item xs={4} justify="flex-end" alignItems="center">
          {isDataloader && (
            <Typography
              className={classes.dataloaderTag}
              component="div"
              variant="caption">
              Data loader
            </Typography>
          )}
          {!flowDetails.disableSlider && (
            <OnOffSwitch
              data-test={`toggleOnAndOffFlow${flowName}`}
              disabled={disableCard}
              on={!disableCard && !disabled}
              onClick={handleDisableClick}
            />
          )}
          <RunFlowButton flowId={flowId} onRunStart={handleOnRunStart} />
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

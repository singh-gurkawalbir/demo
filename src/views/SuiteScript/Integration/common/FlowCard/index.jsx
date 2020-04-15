import clsx from 'clsx';
import cronstrue from 'cronstrue';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Typography, Grid, IconButton } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import FlowEllipsisMenu from '../../../../../components/FlowEllipsisMenu';
import SettingsIcon from '../../../../../components/icons/SettingsIcon';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    margin: theme.spacing(1, 2),
  },
  freeTag: {
    margin: theme.spacing(1),
    color: theme.palette.background.paper,
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

export default function FlowCard({
  flowId,
  flowType,
  integrationId,
  ssLinkedConnectionId,
  excludeActions,
}) {
  const classes = useStyles();
  const history = useHistory();
  const flowDetails =
    useSelector(state =>
      selectors.suiteScriptResource(state, {
        resourceType: 'flows',
        id: flowId,
        integrationId,
        ssLinkedConnectionId,
        flowType,
      })
    ) || {};
  const isDataloader = flowDetails.isSimpleImport;
  const integrationAppName = useSelector(state => {
    const integrationApp = selectors.suiteScriptResource(state, {
      resourceType: 'integrations',
      id: integrationId,
      ssLinkedConnectionId,
    });

    return integrationApp.name;
  });
  const flowName = flowDetails.name || flowDetails._id;
  const { ioFlowName, name } = flowDetails;
  // TODO: set status based on flow criteria...
  const status = 'success';
  // TODO: this property was copied from the old flow list page... i don't know what its for...

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
    : `${flowBuilderPathName}/${flowDetails.type}/${flowId}`;

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
                {ioFlowName || name || `Unnamed (id: ${flowId})`}
              </Typography>
            </Link>
          </div>
          <Typography variant="caption" component="span">
            {getRunLabel()}
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

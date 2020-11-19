import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles, Divider, Typography } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import { STANDALONE_INTEGRATION } from '../../../../../utils/constants';
import AttachFlowsDialog from '../../../../../components/AttachFlows';
import flowTableMeta from '../../../../../components/ResourceTable/flows/metadata';
import CeligoTable from '../../../../../components/CeligoTable';
import LoadResources from '../../../../../components/LoadResources';
import IconTextButton from '../../../../../components/IconTextButton';
import AddIcon from '../../../../../components/icons/AddIcon';
import AttachIcon from '../../../../../components/icons/ConnectionsIcon';
import PanelHeader from '../../../../../components/PanelHeader';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import StatusCircle from '../../../../../components/StatusCircle';
import ScheduleDrawer from '../../../../FlowBuilder/drawers/Schedule';
import MappingDrawerRoute from '../../../../MappingDrawer';
import ErrorsListDrawer from '../../../common/ErrorsList';
import QueuedJobsDrawer from '../../../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import SpinnerWrapper from '../../../../../components/SpinnerWrapper';
import Spinner from '../../../../../components/Spinner';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  errorStatus: {
    justifyContent: 'center',
    height: 'unset',
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
  },
  divider: {
    width: 1,
    height: 18,
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    margin: 5,
  },
  flowsPanelWithStatus: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  content: {
    padding: theme.spacing(3, 2),
  },
}));

const tilesFilterConfig = { type: 'tiles'};

export default function FlowsPanel({ integrationId, childId }) {
  const isStandalone = integrationId === 'none';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const filterKey = `${integrationId}-flows`;
  const flowFilter = useSelector(state => selectors.filter(state, filterKey));
  const flowsFilterConfig = useMemo(() => ({ ...flowFilter, type: 'flows' }), [flowFilter]);
  const isIntegrationApp = useSelector(state => selectors.isIntegrationApp(state, integrationId));
  const isFrameWork2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));
  const allFlows = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsFilterConfig
  ).resources;
  const { canCreate, canAttach, canEdit } = useSelector(state => {
    const permission = selectors.resourcePermissions(state, 'integrations', integrationId, 'flows') || {};

    return {
      canCreate: !!permission.create,
      canAttach: !!permission.attach,
      canEdit: !!permission.edit,
    };
  },
  shallowEqual);

  const flows = useMemo(
    () =>
      allFlows &&
      allFlows.filter(
        f =>
          f._integrationId ===
          (integrationId === STANDALONE_INTEGRATION.id
            ? undefined
            : (childId || integrationId))
      ),
    [allFlows, childId, integrationId]
  );
  const {
    data: integrationErrorsMap = {},
    status: flowErrorCountStatus,
  } = useSelector(state => selectors.errorMap(state, integrationId));
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const allTiles = useSelectorMemo(
    selectors.makeResourceListSelector,
    tilesFilterConfig
  ).resources;
  const currentTileErrorCount = isUserInErrMgtTwoDotZero ? allTiles.find(t => t._integrationId === integrationId)?.numError : 0;

  let totalErrors = 0;

  flows.forEach(flow => {
    if (!flow.disabled && integrationErrorsMap[flow._id]) {
      totalErrors += integrationErrorsMap[flow._id];
    }
  });
  const handleClose = useCallback(() => {
    setShowDialog();
  }, [setShowDialog]);

  useEffect(() => {
    if (!isUserInErrMgtTwoDotZero) return;

    dispatch(actions.errorManager.integrationLatestJobs.requestPoll({ integrationId }));
    dispatch(actions.errorManager.integrationErrors.requestPoll({ integrationId }));

    return () => {
      dispatch(actions.errorManager.integrationLatestJobs.cancelPoll());
      dispatch(actions.errorManager.integrationErrors.cancelPoll());
    };
  }, [dispatch, integrationId, isUserInErrMgtTwoDotZero]);

  const title = useMemo(
    () => (
      <span className={classes.flowsPanelWithStatus}>
        Integration flows
        {(totalErrors || currentTileErrorCount) ? (
          <>
            <span className={classes.divider} />
            <span className={classes.errorStatus}>
              <StatusCircle variant="error" size="mini" />
              <span>{totalErrors || currentTileErrorCount} errors</span>
            </span>
          </>
        ) : null}
      </span>
    ),
    [classes.divider, classes.errorStatus, classes.flowsPanelWithStatus, currentTileErrorCount, totalErrors]
  );
  const actionProps = useMemo(() => (
    {
      parentId: integrationId,
      storeId: childId,
      isIntegrationApp,
      resourceType: 'flows',
      isUserInErrMgtTwoDotZero,
    }), [childId, integrationId, isIntegrationApp, isUserInErrMgtTwoDotZero]);

  if (!flowErrorCountStatus && isUserInErrMgtTwoDotZero) {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }
  const infoTextFlow =
    'You can see the status, scheduling info, and when a flow was last modified, as well as mapping fields, enabling, and running your flow. You can view any changes to a flow, as well as what is contained within the flow, and even clone or download a flow.';

  if (isFrameWork2 && childId === integrationId && isIntegrationApp) {
    return (
      <div className={classes.root}>
        <PanelHeader title="Integration flows" />
        <Divider />
        <div className={classes.content}>
          <Typography component="span">
            Choose a child from the drop-down to view flows.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      {showDialog && (
        <AttachFlowsDialog
          integrationId={integrationId}
          onClose={handleClose}
        />
      )}
      <MappingDrawerRoute integrationId={integrationId} />
      {isUserInErrMgtTwoDotZero && <ErrorsListDrawer integrationId={integrationId} childId={childId} />}
      <ScheduleDrawer />
      <QueuedJobsDrawer />

      <PanelHeader title={title} infoText={infoTextFlow}>
        {canCreate && !isIntegrationApp && (
          <IconTextButton
            component={Link}
            to="flowBuilder/new"
            data-test="createFlow">
            <AddIcon /> Create flow
          </IconTextButton>
        )}
        {canAttach && !isStandalone && !isIntegrationApp && (
          <IconTextButton
            onClick={() => setShowDialog(true)}
            data-test="attachFlow">
            <AttachIcon /> Attach flow
          </IconTextButton>
        )}
        {/* check if this condition is correct */}
        {canEdit && !isIntegrationApp && (
          <IconTextButton
            component={Link}
            to="dataLoader/new"
            data-test="loadData">
            <AddIcon /> Load data
          </IconTextButton>
        )}
      </PanelHeader>

      <LoadResources required resources="flows, exports">
        <CeligoTable
          data={flows}
          filterKey={filterKey}
          {...flowTableMeta}
          actionProps={actionProps}
        />
      </LoadResources>
    </div>
  );
}

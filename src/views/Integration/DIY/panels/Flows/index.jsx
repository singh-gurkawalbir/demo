import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
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
}));

export default function FlowsPanel({ integrationId, childId }) {
  const isStandalone = integrationId === 'none';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const filterKey = `${integrationId}-flows`;
  const flowFilter = useSelector(state => selectors.filter(state, filterKey));
  const flowsFilterConfig = useMemo(() => ({ ...flowFilter, type: 'flows' }), [flowFilter]);
  const isIntegrationApp = useSelector(state => {
    const integration = selectors.resource(state, 'integrations', integrationId);

    return !!(integration && integration._connectorId);
  });
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
  } = useSelector(state => selectors.errorMap(state, integrationId));
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
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

  const infoTextFlow =
    'You can see the status, scheduling info, and when a flow was last modified, as well as mapping fields, enabling, and running your flow. You can view any changes to a flow, as well as what is contained within the flow, and even clone or download a flow.';
  const title = useMemo(
    () => (
      <span className={classes.flowsPanelWithStatus}>
        Integration flows
        {totalErrors ? (
          <>
            <span className={classes.divider} />
            <span className={classes.errorStatus}>
              <StatusCircle variant="error" size="small" />
              <span>{totalErrors} errors</span>
            </span>
          </>
        ) : null}
      </span>
    ),
    [classes.divider, classes.errorStatus, classes.flowsPanelWithStatus, totalErrors]
  );

  return (
    <div className={classes.root}>
      {showDialog && (
        <AttachFlowsDialog
          integrationId={integrationId}
          onClose={handleClose}
        />
      )}
      <MappingDrawerRoute integrationId={integrationId} />
      {isUserInErrMgtTwoDotZero && <ErrorsListDrawer />}
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
          actionProps={{ parentId: integrationId, storeId: childId, resourceType: 'flows', isUserInErrMgtTwoDotZero }}
        />
      </LoadResources>
    </div>
  );
}

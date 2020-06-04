import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import { STANDALONE_INTEGRATION } from '../../../../../utils/constants';
import AttachFlowsDialog from '../../../../../components/AttachFlows';
import metadata from '../../../../../components/ResourceTable/metadata/flows';
import CeligoTable from '../../../../../components/CeligoTable';
import LoadResources from '../../../../../components/LoadResources';
import IconTextButton from '../../../../../components/IconTextButton';
import AddIcon from '../../../../../components/icons/AddIcon';
import AttachIcon from '../../../../../components/icons/ConnectionsIcon';
import PanelHeader from '../../../../../components/PanelHeader';
import FlowCard from '../../../common/FlowCard';
import MappingDrawer from '../../../common/FlowCard/MappingDrawer';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import StatusCircle from '../../../../../components/StatusCircle';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  errorStatus: {
    justifyContent: 'center',
    height: 'unset',
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: '12px',
  },
  divider: {
    width: 1,
    height: 30,
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    margin: 5,
  },
}));

export default function FlowsPanel({ integrationId }) {
  const isStandalone = integrationId === 'none';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const filterKey = `${integrationId}+flows`;
  const flowFilter = useSelector(state => selectors.filter(state, filterKey));
  const flowsFilterConfig = { ...flowFilter, type: 'flows' };
  const allFlows = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsFilterConfig
  ).resources;
  const permission = useSelector(state =>
    selectors.resourcePermissions(state, 'integrations', integrationId, 'flows')
  );
  const flows = useMemo(
    () =>
      allFlows &&
      allFlows.filter(
        f =>
          f._integrationId ===
          (integrationId === STANDALONE_INTEGRATION.id
            ? undefined
            : integrationId)
      ),
    [allFlows, integrationId]
  );
  const {
    status,
    data: integrationErrorsMap = {},
    total: totalErrors = 0,
  } = useSelector(state => selectors.errorMap(state, integrationId));
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isUserInErrMgtTwoDotZero(state)
  );

  useEffect(() => {
    if (!status && isUserInErrMgtTwoDotZero) {
      dispatch(
        actions.errorManager.integrationErrors.request({ integrationId })
      );
    }
  }, [dispatch, integrationId, isUserInErrMgtTwoDotZero, status]);

  const infoTextFlow =
    'You can see the status, scheduling info, and when a flow was last modified, as well as mapping fields, enabling, and running your flow. You can view any changes to a flow, as well as what is contained within the flow, and even clone or download a flow.';
  const title = useMemo(
    () => (
      <span>
        Integration flows
        {totalErrors ? (
          <>
            <span className={classes.divider} />
            <span className={classes.errorStatus}>
              <StatusCircle variant="error" size="small" />
              {totalErrors} errors
            </span>
          </>
        ) : null}
      </span>
    ),
    [classes.divider, classes.errorStatus, totalErrors]
  );

  return (
    <div className={classes.root}>
      {showDialog && (
        <AttachFlowsDialog
          integrationId={integrationId}
          onClose={setShowDialog}
        />
      )}
      <MappingDrawer integrationId={integrationId} />

      <PanelHeader title={title} infoText={infoTextFlow}>
        {permission.create && (
          <IconTextButton
            component={Link}
            to="flowBuilder/new"
            data-test="createFlow">
            <AddIcon /> Create flow
          </IconTextButton>
        )}
        {permission.attach && !isStandalone && (
          <IconTextButton
            onClick={() => setShowDialog(true)}
            data-test="attachFlow">
            <AttachIcon /> Attach flow
          </IconTextButton>
        )}
        {/* check if this condition is correct */}
        {permission.edit && (
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
          {...metadata}
          // actionProps={{ integrationId }}
        />

        {flows.map(f => (
          <FlowCard
            key={f._id}
            flowId={f._id}
            excludeActions={['schedule']}
            errorCount={integrationErrorsMap[f._id] || 0}
          />
        ))}
      </LoadResources>
    </div>
  );
}

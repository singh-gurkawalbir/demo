import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory, matchPath, useLocation } from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';
import RightDrawer from '../../../../components/drawer/Right';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import actions from '../../../../actions';
import CeligoTable from '../../../../components/CeligoTable';
import { flowbuilderUrl } from '../../../../utils/flows';
import SpinnerWrapper from '../../../../components/SpinnerWrapper';
import Spinner from '../../../../components/Spinner';
import ApplicationImg from '../../../../components/icons/ApplicationImg';
import { resourceCategory } from '../../../../utils/resource';
import OverflowWrapper from '../../../../components/ResourceTable/errorManagement/cells/OverflowWrapper';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  button: {
    color: theme.palette.primary.main,
    width: '100%',
    cursor: 'pointer',
    display: 'block',
  },
}));

const metadata = {
  columns: [
    {
      heading: 'Application',
      value: function Application({ type, id }) {
        const applicationType = useSelector(state => selectors.applicationType(state, type, id));

        return (
          <ApplicationImg
            size="small"
            type={applicationType}
            alt={applicationType || 'Application image'}
      />
        );
      },
    },
    {
      heading: 'Flow step',
      value: r => <OverflowWrapper message={r.name} />,
      width: '35%',
    },
    {
      heading: 'Errors',
      value: function Errors({flowId, integrationId, childId, id, count}) {
        const classes = useStyles();
        const history = useHistory();
        const isDataLoader = useSelector(state =>
          selectors.isDataLoader(state, flowId)
        );
        const { merged: integration = {} } = useSelectorMemo(
          selectors.makeResourceDataSelector,
          'integrations',
          integrationId
        );
        const appName = useSelectorMemo(selectors.integrationAppName, integrationId);
        const flowBuilderTo = flowbuilderUrl(flowId, integrationId, {
          isIntegrationApp: !!integration._connectorId,
          childId,
          isDataLoader,
          appName,
        });

        const handleErrorClick = useCallback(() => {
          history.push(`${flowBuilderTo}/errors/${id}`);
        }, [flowBuilderTo, history, id]);

        if (count === 0) {
          return '0';
        }

        return (
          <div className={classes.button} onClick={handleErrorClick}>{count > 9999 ? '9999+' : count} errors</div >
        );
      },
    },
    {
      heading: 'Sources',
      value: function Source(r) {
        const { merged: exportDoc } = useSelectorMemo(
          selectors.makeResourceDataSelector,
          'exports',
          r.id
        );

        if (!exportDoc?._id || r.isLookup) {
          return null;
        }

        return resourceCategory(exportDoc);
      },
    },
    {
      heading: 'Destination & Lookups',
      value: function Destination(r) {
        const { merged: importDoc } = useSelectorMemo(
          selectors.makeResourceDataSelector,
          r.isLookup ? 'exports' : 'imports',
          r.id
        );

        if (!importDoc?._id) {
          return null;
        }

        return resourceCategory(importDoc, r.isLookup, !r.isLookup);
      },
    },
  ],
};

const ErrorsList = ({integrationId, childId}) => {
  const match = useRouteMatch();
  const dispatch = useDispatch();

  const { flowId } = match.params;
  const classes = useStyles();
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const { merged: flow = {} } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  );
  const flowResources = useSelectorMemo(selectors.mkflowResources, flowId);
  const { data: errorMap, status } = useSelector(state => selectors.errorMap(state, flowId));

  const resources = useMemo(() => flowResources
    .filter(r => r._id !== flowId)
    .map(r => ({
      id: r._id,
      name: r.name || r._id,
      count: errorMap && errorMap[r._id],
      flowId,
      type: r.type,
      isLookup: r.isLookup,
      childId,
      integrationId,
    })), [flowResources, flowId, errorMap, integrationId, childId]);

  useEffect(() => {
    if (!isUserInErrMgtTwoDotZero) return;

    dispatch(actions.errorManager.openFlowErrors.requestPoll({ flowId }));

    return () => {
      dispatch(actions.errorManager.openFlowErrors.cancelPoll());
    };
  }, [
    dispatch,
    flowId,
    isUserInErrMgtTwoDotZero,
  ]);

  if (!flow) {
    return <Typography>No flow exists with id: {flowId}</Typography>;
  }
  if (status !== 'received') {
    return <SpinnerWrapper><Spinner /></SpinnerWrapper>;
  }

  return (
    <div className={classes.root}>
      <CeligoTable data={resources} {...metadata} />
    </div>
  );
};

export default function ErrorsListDrawer({ integrationId, childId }) {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const { params: { flowId } = {} } = matchPath(location.pathname, {path: `${match.path}/:flowId/errorsList`}) || {};
  const { merged: flow = {} } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  );
  const handleClose = useCallback(() => {
    history.push(match.url);
  }, [match.url, history]);

  return (
    <LoadResources
      required="true"
      resources="imports, exports, connections">
      <RightDrawer
        hideBackButton
        path={[
          ':flowId/errorsList',
        ]}
        height="tall"
        width="default"
        onClose={handleClose}
        title={`Flow: ${flow.name || flowId}`}
        variant="temporary"
      >

        <ErrorsList integrationId={integrationId} childId={childId} />
      </RightDrawer>
    </LoadResources>
  );
}

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Route,
  NavLink,
  Redirect,
  useRouteMatch,
} from 'react-router-dom';
import { makeStyles, Grid, List, ListItem, Typography, Divider } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import LoadResources from '../../../../../components/LoadResources';
import PanelHeader from '../../../../../components/PanelHeader';
import CeligoTable from '../../../../../components/CeligoTable';
import flowTableMeta from '../../../../../components/ResourceTable/flows/metadata';
import SettingsDrawer from './SettingsDrawer';
import CategoryMappingDrawer from './CategoryMappingDrawer';
import AddCategoryMappingDrawer from './CategoryMappingDrawer/AddCategory';
import VariationMappingDrawer from './CategoryMappingDrawer/VariationMapping';
import ScheduleDrawer from '../../../../FlowBuilder/drawers/Schedule';
import actions from '../../../../../actions';
import { FormStateManager } from '../../../../../components/ResourceFormFactory';
import { generateNewId } from '../../../../../utils/resource';
import {ActionsFactory as GenerateButtons} from '../../../../../components/drawer/Resource/Panel/ResourceFormActionsPanel';
import consolidatedActions from '../../../../../components/ResourceFormFactory/Actions';
import MappingDrawer from '../../../../MappingDrawer';
import ErrorsListDrawer from '../../../common/ErrorsList';
import QueuedJobsDrawer from '../../../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import StatusCircle from '../../../../../components/StatusCircle';
import { getEmptyMessage, isParentViewSelected } from '../../../../../utils/integrationApps';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  container: {
    display: 'flex',
  },
  subNav: {
    minWidth: 200,
    borderRight: `solid 1px ${theme.palette.secondary.lightest}`,
    paddingTop: theme.spacing(2),
  },
  divider: {
    marginRight: theme.spacing(1),
    marginTop: '10px',
    marginBottom: '10px',
  },
  content: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(0, 0, 3, 0),
    overflowX: 'auto',
  },
  listItem: {
    color: theme.palette.secondary.main,
    width: '100%',
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
  configureSectionBtn: {
    padding: 0,
  },
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));
export const useActiveTab = () => {
  const [externalTabState, setExternalTabStateFn] = useState({activeTab: 0});
  const setExternalTabState = useCallback(
    (index, val) => {
      setExternalTabStateFn({activeTab: val});
    },
    []
  );

  return {externalTabState, setExternalTabState, index: 0 };
};

export const ActionsPanel = ({actions, fieldMap, actionProps}) => {
  const actionButtons = useMemo(() => actions.map(action => ({
    ...actionProps,
    id: action?.id,
    mode: 'primary',
  })), [actions, actionProps]);

  return (
    <GenerateButtons
      fieldMap={fieldMap}
      actions={actionButtons}
      consolidatedActions={consolidatedActions}

/>
  );
};
export const IAFormStateManager = props => {
  const dispatch = useDispatch();
  const [formKey] = useState(generateNewId());
  const { integrationId, flowId, sectionId, fieldMeta } = props;
  const allProps = useMemo(() => ({
    ...props,
    resourceType: 'integrations',
    resourceId: integrationId,
  }), [integrationId, props]);

  const allActionProps = useMemo(() => ({
    ...allProps, formKey,
  }), [allProps, formKey]);

  useEffect(() => {
    dispatch(
      actions.integrationApp.settings.initComplete(
        integrationId,
        flowId,
        sectionId
      )
    );

    return () => {
      dispatch(
        actions.integrationApp.settings.clear(integrationId, flowId, sectionId)
      );
    };
  }, [dispatch, flowId, integrationId, sectionId]);

  return (
    <>
      <FormStateManager {...allProps} formKey={formKey} />
      {fieldMeta?.actions?.length && (
      <ActionsPanel
        {...fieldMeta}
        actionProps={allActionProps}
      />
    )}
    </>
  );
};

function FlowList({ integrationId, storeId }) {
  const match = useRouteMatch();
  const { sectionId } = match.params;
  const dispatch = useDispatch();
  const flows = useSelectorMemo(selectors.makeIntegrationAppSectionFlows, integrationId, sectionId, storeId, {excludeHiddenFlows: true});
  const flowSections = useSelectorMemo(selectors.mkIntegrationAppFlowSections, integrationId, storeId);
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const section = flowSections.find(s => s.titleId === sectionId);
  const filterKey = `${integrationId}-flows`;

  useEffect(() => {
    if (!isUserInErrMgtTwoDotZero) return;

    dispatch(actions.errorManager.integrationLatestJobs.requestPoll({ integrationId }));
    dispatch(actions.errorManager.integrationErrors.requestPoll({ integrationId }));

    return () => {
      dispatch(actions.errorManager.integrationLatestJobs.cancelPoll());
      dispatch(actions.errorManager.integrationErrors.cancelPoll());
    };
  }, [dispatch, integrationId, isUserInErrMgtTwoDotZero]);

  return (
    <LoadResources required resources="flows,exports">
      <ScheduleDrawer />
      <QueuedJobsDrawer />
      <SettingsDrawer
        integrationId={integrationId}
        storeId={storeId}
        sectionId={sectionId}
      />
      <MappingDrawer
        integrationId={integrationId}
        // storeId={storeId}
        // sectionId={sectionId}
      />
      {isUserInErrMgtTwoDotZero && <ErrorsListDrawer integrationId={integrationId} childId={storeId} />}
      <CategoryMappingDrawer
        integrationId={integrationId}
        storeId={storeId}
        sectionId={sectionId}
        // flowId={flowId}
      />
      <AddCategoryMappingDrawer
        integrationId={integrationId}
        storeId={storeId}
        sectionId={sectionId}
        // flowId={flowId}
      />
      <VariationMappingDrawer
        integrationId={integrationId}
        storeId={storeId}
        sectionId={sectionId}
        // flowId={flowId}
      />
      <PanelHeader title={`${section?.title} flows`} />
      <CeligoTable
        data={flows}
        filterKey={filterKey}
        {...flowTableMeta}
        actionProps={{ isIntegrationApp: true, storeId, resourceType: 'flows', isUserInErrMgtTwoDotZero }}
        />
    </LoadResources>
  );
}

const SectionTitle = ({integrationId, storeId, title, titleId}) => {
  const classes = useStyles();
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const integrationErrorsPerSection = useSelector(state =>
    selectors.integrationErrorsPerSection(state, integrationId, storeId),
  shallowEqual);

  const errorCount = integrationErrorsPerSection[titleId];
  const errorStatus = useMemo(() => {
    if (errorCount === 0) {
      return <StatusCircle size="small" variant="success" />;
    }

    return (
      <div>
        <StatusCircle size="small" variant="error" />
        <span>{errorCount > 9999 ? '9999+' : errorCount}</span>
      </div>
    );
  }, [errorCount]);

  if (!isUserInErrMgtTwoDotZero) {
    return title;
  }

  return (
    <div className={classes.flexContainer}>
      <div> { title }</div>
      <div> {errorStatus} </div>
    </div>
  );
};

export default function FlowsPanel({ storeId, integrationId }) {
  const match = useRouteMatch();
  const classes = useStyles();
  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId) || {};
  const isParentView = isParentViewSelected(integration, storeId);
  const flowSections = useSelectorMemo(selectors.mkIntegrationAppFlowSections, integrationId, storeId);

  // If someone arrives at this view without requesting a section, then we
  // handle this by redirecting them to the first available section. We can
  // not hard-code this because different sections exist across IAs.
  if (match.isExact && flowSections && flowSections.length && !isParentView) {
    return (
      <Redirect push={false} to={`${match.url}/${flowSections[0].titleId}`} />
    );
  }

  if (isParentView) {
    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <Typography variant="h4">
            Flows
          </Typography>
        </div>
        <Divider className={classes.divider} />
        <div className={classes.content}>
          <span>
            {getEmptyMessage(integration.settings?.storeLabel, 'view flows')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Grid container wrap="nowrap">
        <Grid item className={classes.subNav}>
          <List>
            {flowSections.map(({ title, titleId }) => (
              <ListItem key={titleId}>
                <NavLink
                  className={classes.listItem}
                  activeClassName={classes.activeListItem}
                  to={titleId}
                  data-test={titleId}>
                  <SectionTitle
                    title={title}
                    titleId={titleId}
                    integrationId={integrationId}
                    storeId={storeId} />
                </NavLink>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item className={classes.content}>
          <LoadResources required resources="flows">
            <Route path={`${match.url}/:sectionId`}>
              <FlowList integrationId={integrationId} storeId={storeId} />
            </Route>
          </LoadResources>
        </Grid>
      </Grid>
    </div>
  );
}

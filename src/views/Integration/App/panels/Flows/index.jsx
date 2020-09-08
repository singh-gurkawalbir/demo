import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Route,
  NavLink,
  Redirect,
  useRouteMatch,
} from 'react-router-dom';
import { makeStyles, Grid, List, ListItem } from '@material-ui/core';
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

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  subNav: {
    minWidth: 200,
    borderRight: `solid 1px ${theme.palette.secondary.lightest}`,
    paddingTop: theme.spacing(2),
  },
  content: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(0, 0, 3, 0),
    overflowX: 'auto',
  },
  listItem: {
    color: theme.palette.secondary.main,
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
  configureSectionBtn: {
    padding: 0,
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

  if (!actions || !actions.length) { return null; }

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
      <ActionsPanel
        {...fieldMeta}
        actionProps={allActionProps}
      />
    </>
  );
};

function FlowList({ integrationId, storeId }) {
  const match = useRouteMatch();
  const { sectionId } = match.params;
  const { flows } = useSelector(state =>
    selectors.integrationAppFlowSettings(
      state,
      integrationId,
      sectionId,
      storeId,
      { excludeHiddenFlows: true }
    )
  );
  const flowSections = useSelector(state =>
    selectors.integrationAppFlowSections(state, integrationId, storeId)
  );
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const section = flowSections.find(s => s.titleId === sectionId);
  const filterKey = `${integrationId}-flows`;

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
      {isUserInErrMgtTwoDotZero && <ErrorsListDrawer />}
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

export default function FlowsPanel({ storeId, integrationId }) {
  const match = useRouteMatch();
  const classes = useStyles();
  const flowSections = useSelector(state =>
    selectors.integrationAppFlowSections(state, integrationId, storeId)
  );

  // If someone arrives at this view without requesting a section, then we
  // handle this by redirecting them to the first available section. We can
  // not hard-code this because different sections exist across IAs.
  if (match.isExact && flowSections && flowSections.length) {
    return (
      <Redirect push={false} to={`${match.url}/${flowSections[0].titleId}`} />
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
                  {title}
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

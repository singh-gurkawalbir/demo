import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import React, { useEffect, useState, useCallback, useMemo, Fragment } from 'react';
import {
  NavLink,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';
import { makeStyles, Grid, List, ListItem, Tabs, Tab, Typography } from '@material-ui/core';
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
import consolidatedActions from '../../../../../components/ResourceFormFactory/Actions';
import MappingDrawer from '../../../../MappingDrawer';
import ErrorsListDrawer from '../../../common/ErrorsList';
import SectionTitle from '../../../common/FlowSectionTitle';
import QueuedJobsDrawer from '../../../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import ResponseMappingDrawer from '../../../../../components/ResponseMapping/Drawer';
import KeywordSearch from '../../../../../components/KeywordSearch';
import flowgroupingsRedirectTo from '../../../../../utils/flowgroupingsRedirectTo';
import ButtonGroup from '../../../../../components/ButtonGroup';
import { getMetadatasForIndividualTabs } from '../../../../../forms/formFactory/utils';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  action: {
    display: 'flex',
  },
  container: {
    display: 'flex',
  },
  subNav: {
    minWidth: 200,
    maxWidth: 240,
    paddingTop: theme.spacing(2),
    borderRight: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  divider: {
    marginRight: theme.spacing(1),
    marginTop: '10px',
    marginBottom: '10px',
  },
  tabComponentRoot: {
    display: 'flex',
  },
  panelContainer: {
    flexGrow: 1,
    // overflowY: 'auto',
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
  emptyMessageWrapper: {
    padding: theme.spacing(1, 2),
  },
  displayNone: {
    display: 'none',
    '& + div': {
      display: 'none',
    },
  },
  flowTitle: {
    position: 'relative',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    '&:before': {
      content: '""',
      width: '3px',
      top: 0,
      height: '100%',
      position: 'absolute',
      background: 'transparent',
      left: '0px',
    },
    '&:hover': {
      '&:before': {
        background: theme.palette.primary.main,
      },
    },
  },
  actions: {
    padding: theme.spacing(2, 3),
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
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

export const ActionsPanel = ({actions, actionProps, ...rest}) => {
  const classes = useStyles();

  if (!actions || !actions.length) { return null; }

  return (
    <div className={classes.actions}>
      <ButtonGroup>
        {actions.map(({id}) => {
          const Action = consolidatedActions[id];

          return (
            <Action
              key={id}
              dataTest={id}
              {...actionProps}
              {...rest}
            />
          );
        })}

      </ButtonGroup>
    </div>
  );
};

const IASettingsActionsGroupMeta = [{id: 'integrationsettings'}];
const IAFormActionsPanel = ({isDrawer, onCancel, ...rest}) => {
  if (isDrawer) {
    console.log('check ', rest);

    return <ActionsPanel {...rest} onCancel={onCancel} actions={IASettingsActionsGroupMeta} />;
  }

  const {actions} = rest;

  if (!actions?.length) { return null; }

  return (
    <ActionsPanel
      {...rest}
  />
  );
};
export const integrationSettingsKey = 'integrationSettings';

const IATabIAForm = props => {
  const {
    actionProps,
    isDrawer,
    onCancel,
    ...rest
  } = props;

  return (
    <>
      <FormStateManager {...rest} />
      <IAFormActionsPanel
        {...rest}
        actionProps={actionProps}
        isDrawer={isDrawer}
        onCancel={onCancel}
      />
    </>
  );
};

const TabLabel = ({label, formKey}) => {
  const isValid = useSelector(state => selectors.formState(state, formKey)?.isValid);

  if (!isValid) { return <Typography color="error" style={{fontSize: 15, lineHeight: '19px' }}>{label}</Typography>; }

  return label;
};

const AllTabForms = ({formMetas, selectedTab, ...props}) => {
  const classes = useStyles();

  return (
    <>
      {formMetas.map(({key, fieldMeta}, index) => (
        <IATabIAForm
          {...props}
          fieldMeta={fieldMeta}
          className={({[classes.displayNone]: index !== selectedTab})}
          formKey={key}
          key={key} />
      ))}
    </>

  );
};

const IAForms = props => {
  const {fieldMeta} = props;
  const classes = useStyles();

  const {layout} = fieldMeta;
  const formMetas = useMemo(() => getMetadatasForIndividualTabs(fieldMeta), [fieldMeta]);

  const [selectedTab, setSelectedTab] = useState(0);

  if (layout.type === 'tabIA') {
    return (
      <div className={classes.tabComponentRoot}>
        <Tabs
          value={selectedTab}
          variant="scrollable"
          orientation="vertical"
          indicatorColor="primary"
          textColor="primary"
          scrollButtons="auto"
          onChange={(evt, value) => {
            setSelectedTab(value);
          }}
   >
          {formMetas.map(({ key }) => (
            <Tab
              label={(
                <TabLabel
                  label={key}
                  formKey={key}
              />
)}
              key={key}
              data-test={key}
            />
          ))}

        </Tabs>
        <div className={classes.panelContainer}>
          <AllTabForms
            {...props} formMetas={formMetas}
            selectedTab={selectedTab}
        />
        </div>
      </div>

    );
  }

  return (
    <IATabIAForm
      {...props}
      formKey={integrationSettingsKey}
          />
  );
};
export const IAFormStateManager = props => {
  const dispatch = useDispatch();
  const { integrationId, flowId, sectionId, isDrawer, onCancel } = props;
  const allProps = useMemo(() => ({
    ...props,
    resourceType: 'integrations',
    resourceId: integrationId,
  }), [integrationId, props]);

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
    <IAForms
      {...allProps}
      isDrawer={isDrawer}
      onCancel={onCancel}
     />
  );
};
const defaultFilter = {
  take: parseInt(process.env.DEFAULT_TABLE_ROW_COUNT, 10) || 10,
  sort: { orderBy: 'name', order: 'asc' },
  searchBy: [
    'name',
  ],
};

const FlowsTable = ({integrationId, childId}) => {
  const match = useRouteMatch();
  const filterKey = `${integrationId}-flows`;
  const { sectionId } = match.params;
  const flowFilter = useSelector(state => selectors.filter(state, filterKey));
  const flowsFilterConfig = useMemo(() => ({ ...(flowFilter || {}), excludeHiddenFlows: true }), [flowFilter]);
  const appName = useSelectorMemo(selectors.integrationAppName, integrationId);
  const integration = useSelectorMemo(selectors.makeResourceSelector, 'integrations', integrationId);
  const flows = useSelectorMemo(selectors.makeIntegrationAppSectionFlows, integrationId, sectionId, childId, flowsFilterConfig);
  const flowAttributes = useSelectorMemo(selectors.mkFlowAttributes, flows, integration, childId);
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

  const actionProps = useMemo(() => ({
    isIntegrationApp: true,
    childId,
    resourceType: 'flows',
    isUserInErrMgtTwoDotZero,
    showChild: (integration?.settings?.supportsMultiStore && !childId),
    appName,
    childHeader: integration?.settings?.storeLabel,
    flowAttributes,
    integration,
  }), [childId, isUserInErrMgtTwoDotZero, appName, flowAttributes, integration]);

  return (
    <LoadResources required resources="flows,exports">
      <CeligoTable
        data-public
        data={flows}
        filterKey={filterKey}
        {...flowTableMeta}
        actionProps={actionProps}
    />
    </LoadResources>
  );
};

function FlowList({ integrationId, childId }) {
  const filterKey = `${integrationId}-flows`;
  const match = useRouteMatch();
  const { sectionId } = match.params;
  const dispatch = useDispatch();
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

  useEffect(() => {
    dispatch(actions.patchFilter(filterKey, defaultFilter));
  },
  [dispatch, filterKey]);

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
    <>
      <ScheduleDrawer />
      <QueuedJobsDrawer />
      <SettingsDrawer
        integrationId={integrationId}
        childId={childId}
        sectionId={sectionId}
      />
      <MappingDrawer
        integrationId={integrationId}
      />
      <ResponseMappingDrawer
        integrationId={integrationId}
      />
      {isUserInErrMgtTwoDotZero && <ErrorsListDrawer integrationId={integrationId} childId={childId} />}
      <CategoryMappingDrawer
        integrationId={integrationId}
        childId={childId}
        sectionId={sectionId}
      />
      <AddCategoryMappingDrawer
        integrationId={integrationId}
        childId={childId}
        sectionId={sectionId}
      />
      <VariationMappingDrawer
        integrationId={integrationId}
        childId={childId}
        sectionId={sectionId}
      />
      <Header integrationId={integrationId} childId={childId} />
      <FlowsTable integrationId={integrationId} childId={childId} />
    </>
  );
}

const Header = ({integrationId, childId}) => {
  const classes = useStyles();
  const filterKey = `${integrationId}-flows`;
  const match = useRouteMatch();
  const { sectionId } = match.params;
  const flowSections = useSelectorMemo(selectors.mkIntegrationAppFlowSections, integrationId, childId);
  const section = flowSections.find(s => s.titleId === sectionId);

  return (
    <PanelHeader title={`${section?.title || ''} flows`} >
      <div className={classes.action}>
        <KeywordSearch
          filterKey={filterKey}
        />
      </div>
    </PanelHeader>
  );
};

export default function FlowsPanel({ childId, integrationId }) {
  const match = useRouteMatch();
  const classes = useStyles();

  const integrationErrorsPerSection = useSelector(state =>
    selectors.integrationErrorsPerSection(state, integrationId, childId),
  shallowEqual);
  const flowSections = useSelectorMemo(selectors.mkIntegrationAppFlowSections, integrationId, childId);

  const history = useHistory();
  // If someone arrives at this view without requesting a section, then we
  // handle this by redirecting them to the first available section. We can
  // not hard-code this because different sections exist across IAs.

  useEffect(() => {
    if (match.isExact && flowSections && flowSections.length) {
      const redirectTo = flowgroupingsRedirectTo(match, flowSections.map(({titleId}) => ({sectionId: titleId})), flowSections[0].titleId);

      if (redirectTo) { history.replace(redirectTo); }
    }
  }, [flowSections, history, match]);

  return (
    <div className={classes.root}>
      <Grid container wrap="nowrap">
        <Grid item className={classes.subNav}>
          <List>
            {flowSections.map(({ title, titleId }) => (
              <ListItem key={titleId} className={classes.flowTitle}>
                <NavLink
                  data-public
                  className={classes.listItem}
                  activeClassName={classes.activeListItem}
                  to={titleId}
                  data-test={titleId}>
                  <SectionTitle title={title} errorCount={integrationErrorsPerSection[titleId]} />
                </NavLink>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item className={classes.content}>
          <FlowList integrationId={integrationId} childId={childId} />
        </Grid>
      </Grid>
    </div>
  );
}

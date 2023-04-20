import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
import ScheduleDrawer from '../../../../FlowBuilder/drawers/Schedule';
import actions from '../../../../../actions';
import { FormStateManager } from '../../../../../components/ResourceFormFactory';
import consolidatedActions from '../../../../../components/ResourceFormFactory/Actions';
import MappingDrawer from '../../../../MappingDrawer';
import ErrorsListDrawer from '../../../common/ErrorsList';
import SectionTitle from '../../../common/FlowSectionTitle';
import QueuedJobsDrawer from '../../../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import KeywordSearch from '../../../../../components/KeywordSearch';
import flowgroupingsRedirectTo from '../../../../../utils/flowgroupingsRedirectTo';
import { getMetadatasForIndividualTabs } from '../../../../../forms/formFactory/utils';
import useFormOnCancelContext from '../../../../../components/FormOnCancelContext';
import { FORM_SAVE_STATUS, NO_RESULT_SEARCH_MESSAGE } from '../../../../../constants';
import DrawerTitleBar from '../../../../../components/drawer/TitleBar';
import ActionGroup from '../../../../../components/ActionGroup';
import NoResultTypography from '../../../../../components/NoResultTypography';
import customCloneDeep from '../../../../../utils/customCloneDeep';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
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
    paddingLeft: theme.spacing(2),
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
  displayNone: {
    display: 'none',
    '& + div': {
      display: 'none',
    },
  },
  tabsContainer: {
    minWidth: 150,
    background: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    marginBottom: theme.spacing(1),
    width: '100%',
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
    padding: theme.spacing(2, 0),
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    display: 'flex',
    justifyContent: 'space-between',
  },
  noSearchResults: {
    marginTop: theme.spacing(1),
  },
}));
export const ActionsPanel = ({actions, actionProps, ...rest}) => {
  const classes = useStyles();

  if (!actions || !actions.length) { return null; }

  return (
    <div className={classes.actions}>
      <ActionGroup>
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

      </ActionGroup>
    </div>
  );
};

const IASettingsActionsGroupMeta = [{id: 'integrationsettings'}];
const IAFormActionsPanel = ({isDrawer, onCancel, ...rest}) => {
  if (isDrawer) {
    return <ActionsPanel {...rest} onCancel={onCancel} actions={IASettingsActionsGroupMeta} />;
  }
  const actions = rest?.fieldMeta?.actions;

  if (!actions?.length) { return null; }

  return (
    <ActionsPanel
      {...rest}
      actions={actions}
  />
  );
};

const integrationSettingsKey = 'integrationSettings';

const RegularIAForm = props => {
  const {
    actionProps,
    isDrawer,
    onCancel,
    handleInit,
    ...rest
  } = props;

  const [count, setCount] = useState(0);

  const handleInitForm = useCallback(() => {
    setCount(count => count + 1);
    handleInit();
  }, [handleInit]);

  return (
    <>
      <FormStateManager {...rest} handleInitForm={handleInitForm} key={count} />
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
  const isInValid = useSelector(state => selectors.isFormPurelyInvalid(state, formKey)?.isValid);

  if (isInValid) { return <Typography color="error" style={{fontSize: 15, lineHeight: '19px' }}>{label}</Typography>; }

  return label;
};

const AllTabForms = ({formMetas, selectedTab, ...props}) => {
  const classes = useStyles();

  return (
    <>
      {formMetas.map(({key, fieldMeta}, index) => (
        <RegularIAForm
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
  const {fieldMeta, flowId, formState, isDrawer} = props;
  const classes = useStyles();

  const {layout} = fieldMeta;
  const formMetas = useMemo(() => getMetadatasForIndividualTabs(fieldMeta), [fieldMeta]);

  const [selectedTab, setSelectedTab] = useState(0);

  const flow =
  useSelector(state => selectors.resource(state, 'flows', flowId)) || {};
  const flowName = flow.name || flow._id;

  const {setCancelTriggered} = useFormOnCancelContext(integrationSettingsKey);
  const disableClose = formState?.formSaveStatus === FORM_SAVE_STATUS.LOADING;

  const DrawerTitle = isDrawer && (
    <DrawerTitleBar
      title={`Settings: ${flowName}`}
      onClose={setCancelTriggered}
      disableClose={disableClose}
/>
  );

  if (layout.type === 'tabIA') {
    return (
      <>
        {DrawerTitle}
        <div className={classes.tabComponentRoot}>
          <Tabs
            className={classes.tabsContainer}
            value={selectedTab}
            variant="scrollable"
            orientation="horizontal"
            indicatorColor="primary"
            textColor="primary"
            scrollButtons="auto"
            onChange={(evt, value) => {
              setSelectedTab(value);
            }}
   >
            {formMetas?.map(({ key }) => (
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
        </div>

        <div className={classes.panelContainer}>
          <AllTabForms
            {...props} formMetas={formMetas}
            selectedTab={selectedTab}
        />
        </div>
      </>
    );
  }

  return (
    <>
      {DrawerTitle}
      <RegularIAForm
        {...props}
        formKey={integrationSettingsKey}
          />

    </>
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
  const handleInit = useCallback(() => dispatch(
    actions.integrationApp.settings.initComplete(
      integrationId,
      flowId,
      sectionId
    )
  ), [dispatch, flowId, integrationId, sectionId]);

  const handleFormClear = useCallback(() => dispatch(
    actions.integrationApp.settings.clear(integrationId, flowId, sectionId)
  ), [dispatch, flowId, integrationId, sectionId]);

  useEffect(() => {
    handleInit();

    return () => {
      handleFormClear();
    };
  }, [handleInit, handleFormClear]);

  return (
    <IAForms
      {...allProps}
      handleInit={handleInit}
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
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const flows = useSelectorMemo(selectors.makeIntegrationAppSectionFlows, integrationId, sectionId, childId, flowsFilterConfig, isUserInErrMgtTwoDotZero);
  const flowAttributes = useSelectorMemo(selectors.mkFlowAttributes, flows, integration, childId);

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
    sectionId,
  }), [childId, isUserInErrMgtTwoDotZero, appName, flowAttributes, integration, sectionId]);

  return (
    <LoadResources required integrationId={integrationId} resources="flows,connections,exports">
      <CeligoTable
        data={customCloneDeep(flows)}
        filterKey={filterKey}
        {...flowTableMeta}
        actionProps={actionProps}
    />
    </LoadResources>
  );
};

function FlowList({ integrationId, childId }) {
  const filterKey = `${integrationId}-flows`;
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
      <QueuedJobsDrawer integrationId={integrationId} />
      <SettingsDrawer integrationId={integrationId} childId={childId} />
      <MappingDrawer integrationId={integrationId} />
      {isUserInErrMgtTwoDotZero && <ErrorsListDrawer integrationId={integrationId} childId={childId} />}
      <CategoryMappingDrawer integrationId={integrationId} />
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
          autoFocus
        />
      </div>
    </PanelHeader>
  );
};

export default function FlowsPanel({ childId, integrationId }) {
  const match = useRouteMatch();
  const classes = useStyles();

  const filterKey = `${integrationId}-flows`;
  const flowFilter = useSelector(state => selectors.filter(state, filterKey));
  const flowsFilterConfig = useMemo(() => ({ ...(flowFilter || {}), excludeHiddenFlows: true }), [flowFilter]);
  const integrationErrorsPerSection = useSelector(state =>
    selectors.integrationErrorsPerSection(state, integrationId, childId),
  shallowEqual);
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const flowSections = useSelectorMemo(selectors.mkIntegrationAppFlowSections, integrationId, childId, flowsFilterConfig, isUserInErrMgtTwoDotZero);

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
    <>
      <div className={classes.root}>
        <Grid container wrap="nowrap">
          <Grid item className={classes.subNav}>
            <List>
              {flowSections.map(({ title, titleId }) => (
                <ListItem key={titleId} className={classes.flowTitle}>
                  <NavLink
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
      <div className={classes.noSearchResults}>
        {(flowFilter.keyword && !flowSections.length) ? (
          <NoResultTypography>{NO_RESULT_SEARCH_MESSAGE}</NoResultTypography>
        ) : ''}
      </div>
    </>
  );
}

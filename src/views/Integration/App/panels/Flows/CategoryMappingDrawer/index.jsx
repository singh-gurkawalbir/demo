import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Route,
  useRouteMatch,
  useHistory,
  generatePath,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Tooltip,
  IconButton,
  Drawer,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import LoadResources from '../../../../../../components/LoadResources';
import Loader from '../../../../../../components/Loader';
import IconTextButton from '../../../../../../components/IconTextButton';
import Spinner from '../../../../../../components/Spinner';
import PanelHeader from '../../../../../../components/PanelHeader';
import TrashIcon from '../../../../../../components/icons/TrashIcon';
import RestoreIcon from '../../../../../../components/icons/RestoreIcon';
import ApplicationImg from '../../../../../../components/icons/ApplicationImg';
import ArrowUpIcon from '../../../../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../../../components/icons/ArrowDownIcon';
import ShowContentIcon from '../../../../../../components/icons/ShowContentIcon';
import HideContentIcon from '../../../../../../components/icons/HideContentIcon';
import VariationIcon from '../../../../../../components/icons/ConfigureSettingIcon';
import Mappings from './BasicMapping';
import Filters from './Filters';
import CategoryList from './CategoryList';
import DrawerTitleBar from './TitleBar';
import CollapseWindowIcon from '../../../../../../components/icons/CollapseWindowIcon';
import ExpandWindowIcon from '../../../../../../components/icons/ExpandWindowIcon';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';
import SettingsDrawer from '../../../../../../components/Mapping/Settings';
import { capitalizeFirstLetter } from '../../../../../../utils/string';
import OutlinedButton from '../../../../../../components/Buttons/OutlinedButton';
import TextButton from '../../../../../../components/Buttons/TextButton';
import ActionGroup from '../../../../../../components/ActionGroup';
import FilledButton from '../../../../../../components/Buttons/FilledButton';

const emptySet = [];
const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: '60%',
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: '-4px 4px 8px rgba(0,0,0,0.15)',
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
    overflowX: 'hidden',
  },
  mappingContainer: {
    padding: '0 0 10px 20px',
    border: 'solid 1px',
    borderColor: theme.palette.background.default,
    marginTop: theme.spacing(1),
    background: theme.palette.background.paper,
  },
  saveButtonGroup: {
    margin: '10px 10px 10px 24px',
  },
  fullWidth: {
    width: '100%',
    padding: 12,
  },
  mappingHeader: {
    padding: theme.spacing(1),
    marginLeft: '20px',
    background: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  mappingChild: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '40%',
    marginRight: 45,
  },
  // toolbar: theme.mixins.toolbar,
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    height: '100%',
  },
  childExpansionPanel: {
    background: theme.palette.background.default,
    marginTop: 10,
    boxShadow: 'none',
  },
  secondaryHeading: {
    fontFamily: 'Roboto500',
    lineHeight: `${theme.spacing(3)}px`,
  },
  subNav: {
    width: '20%',
    minWidth: 200,
    background: theme.palette.background.paper2,
    paddingTop: theme.spacing(1),
  },
  deleteIcon: {
    position: 'absolute',
    right: '45px',
  },
  variationIcon: {
    position: 'absolute',
    right: theme.spacing(10),
  },
  content: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(0, 3, 3, 0),
  },
  header: {
    // background: theme.palette.primary.main,
  },
  default: {
    marginBottom: 10,
  },
  categoryMapWrapper: {
    display: 'flex',
    minHeight: '100%',
  },
  rootExpansionPanel: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  innerContentHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    display: 'flex',
  },
  expCollBtn: {
    marginRight: -30,
  },
  categoryMappingExpPanelSummary: {
    padding: '0px 12px',
    width: '100%',
  },
}));

function CategoryMappings({
  integrationId,
  flowId,
  sectionId,
  isRoot = true,
  depth = 0,
  isParentCommonCategory = false,
}) {
  const [requestedGenerateFields, setRequestedGenerateFields] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const isCommonCategory =
    sectionId === 'commonAttributes' || isParentCommonCategory;
  const [expanded, setExpanded] = useState(isRoot);
  const memoizedOptions = useMemo(() => ({ sectionId, depth }), [sectionId, depth]);
  const {
    fields: generateFields,
    name,
    variation_themes: variationThemes,
    variation_attributes: variationAttributes,
  } = useSelectorMemo(selectors.mkCategoryMappingGenerateFields, integrationId, flowId, memoizedOptions) || {};
  const { collapseAction } = useSelectorMemo(selectors.mkCategoryMappingsCollapsedStatus, integrationId, flowId) || {};
  const memoizedCategoryOptions = useMemo(() => ({sectionId, depth}), [sectionId, depth]);
  const { children = [], deleted } = useSelectorMemo(selectors.mkMappingsForCategory, integrationId, flowId, memoizedCategoryOptions) || {};
  const hasVariationMappings =
    (variationThemes && !!variationThemes.length) ||
    (variationAttributes && !!variationAttributes.length);

  useEffect(() => {
    setRequestedGenerateFields(false);
  }, [sectionId]);

  useEffect(() => {
    if (!generateFields && !requestedGenerateFields && isRoot) {
      dispatch(
        actions.integrationApp.settings.categoryMappings.requestMetadata(
          integrationId,
          flowId,
          sectionId,
          { generatesMetadata: true }
        )
      );
      setRequestedGenerateFields(true);
    }
  }, [
    generateFields,
    requestedGenerateFields,
    dispatch,
    integrationId,
    flowId,
    sectionId,
    isRoot,
  ]);

  const shouldExpand =
    isRoot || (collapseAction ? collapseAction !== 'collapse' : expanded);

  useEffect(() => {
    setExpanded(shouldExpand);
  }, [shouldExpand]);
  useEffect(() => {
    if (collapseAction) {
      dispatch(
        actions.integrationApp.settings.categoryMappings.clearCollapseStatus(
          integrationId,
          flowId
        )
      );
    }
  }, [collapseAction, dispatch, flowId, integrationId]);
  const handleChange = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);
  const handleDelete = useCallback(e => {
    // Clicking of this icon should avoid collapsing this category section
    e.stopPropagation();
    dispatch(
      actions.integrationApp.settings.categoryMappings.deleteCategory(
        integrationId,
        flowId,
        sectionId,
        depth
      )
    );
  }, [dispatch, flowId, integrationId, sectionId, depth]);

  const handleRestore = useCallback(e => {
    // Clicking of this icon should avoid collapsing this category section
    e.stopPropagation();
    dispatch(
      actions.integrationApp.settings.categoryMappings.restoreCategory(
        integrationId,
        flowId,
        sectionId,
        depth
      )
    );
  }, [dispatch, flowId, integrationId, sectionId, depth]);

  const handleVariation = useCallback(e => {
    // Clicking of this icon should avoid collapsing this category section
    e.stopPropagation();
    history.push(`${match.url}/depth/${depth}/variations/${sectionId}`);
  }, [history, match.url, sectionId, depth]);

  if (!generateFields) {
    return (
      <Loader open hideBackDrop>
        Loading
        <Spinner />
      </Loader>
    );
  }

  return (
    <div className={isRoot ? classes.mappingContainer : classes.default}>
      <Accordion
        expanded={expanded}
        elevation={0}
        onChange={handleChange}
        className={
          isRoot ? classes.rootExpansionPanel : classes.childExpansionPanel
        }>
        <AccordionSummary
          aria-controls="panel1bh-content"
          className={classes.categoryMappingExpPanelSummary}
          id="panel1bh-header">
          <div className={classes.innerContentHeader}>
            <div className={classes.title}>
              <span>{expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}</span>
              <Typography className={classes.secondaryHeading} variant="body2">
                {name}
              </Typography>
            </div>
            <span>
              {expanded ? (
                <Tooltip data-public title="Hide categories" placement="bottom">
                  <IconButton size="small" color="inherit">
                    <ShowContentIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip data-public title="Enable categories" placement="bottom">
                  <IconButton size="small" color="inherit">
                    <HideContentIcon />
                  </IconButton>
                </Tooltip>
              )}
            </span>
          </div>

          {hasVariationMappings && (
            <Tooltip data-public title="Configure variations" placement="bottom">
              <IconButton
                onClick={handleVariation}
                size="small"
                color="inherit"
                className={classes.variationIcon}>
                <VariationIcon />
              </IconButton>
            </Tooltip>
          )}
          {!isCommonCategory && (
            <div>
              {deleted ? (
                <Tooltip data-public title="Restore category" placement="bottom">
                  <IconButton
                    onClick={handleRestore}
                    size="small"
                    color="inherit"
                    className={classes.deleteIcon}>
                    <RestoreIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip data-public title="Delete category" placement="bottom">
                  <IconButton
                    onClick={handleDelete}
                    size="small"
                    color="inherit"
                    className={classes.deleteIcon}>
                    <TrashIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.fullWidth}>
            <Mappings
              id={`${flowId}-${sectionId}-${depth}`}
              flowId={flowId}
              depth={depth}
              integrationId={integrationId}
              sectionId={sectionId}
              generateFields={generateFields || emptySet}
            />
            {children.length > 0 &&
              children.map(child => (
                <CategoryMappings
                  integrationId={integrationId}
                  flowId={flowId}
                  key={child.id}
                  isRoot={false}
                  depth={depth + 1}
                  isParentCommonCategory={isCommonCategory}
                  generateFields={generateFields || emptySet}
                  sectionId={child.id}
                />
              ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function CategoryMappingDrawer({ integrationId, parentUrl }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { flowId, categoryId } = match.params;

  const integrationName = useSelector(state => {
    const integration = selectors.resource(
      state,
      'integrations',
      integrationId
    );

    return integration ? integration.name : null;
  });
  const metadataLoaded = useSelector(
    state => !!selectors.categoryMapping(state, integrationId, flowId)
  );
  const { collapseStatus = 'collapsed' } = useSelectorMemo(selectors.mkCategoryMappingsCollapsedStatus, integrationId, flowId) || {};
  const uiAssistant = useSelector(state => {
    const categoryMappingMetadata =
      selectors.categoryMapping(state, integrationId, flowId) || {};
    const { uiAssistant = '' } = categoryMappingMetadata;

    return capitalizeFirstLetter(uiAssistant);
  });

  const importId = useSelector(state => {
    const flow = selectors.resource(state, 'flows', flowId);

    if (flow) {
      const firstPP = flow.pageProcessors.find(
        pp => pp.type === 'import'
      );

      return firstPP ? firstPP._importId : null;
    }

    return null;
  });
  const mappedCategories = useSelectorMemo(selectors.mkMappedCategories, integrationId, flowId) || [];
  const currentSectionLabel =
    (mappedCategories.find(category => category.id === categoryId) || {})
      .name || categoryId;

  const handleClose = useCallback(() => {
    history.push(parentUrl);
    dispatch(
      actions.integrationApp.settings.categoryMappings.clear(
        integrationId,
        flowId
      )
    );
  }, [dispatch, flowId, history, integrationId, parentUrl]);

  const handleCollapseAll = useCallback(() => {
    dispatch(
      actions.integrationApp.settings.categoryMappings.collapseAll(
        integrationId,
        flowId
      )
    );
  }, [dispatch, flowId, integrationId]);
  const handleExpandAll = useCallback(() => {
    dispatch(
      actions.integrationApp.settings.categoryMappings.expandAll(
        integrationId,
        flowId
      )
    );
  }, [dispatch, flowId, integrationId]);

  if (!integrationName) {
    return <LoadResources required resources="integrations" />;
  }

  return (
    <>
      <Drawer
        anchor="right"
        open={!!match}
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={handleClose}>
        <InitializationComp
          integrationId={integrationId}
          flowId={flowId}
          categoryId={categoryId}
          parentUrl={parentUrl}
        />

        <DrawerTitleBar flowId={flowId} parentUrl={parentUrl} />
        {metadataLoaded ? (
          <div className={classes.root}>
            <div className={classes.categoryMapWrapper}>
              <div className={classes.subNav}>
                <CategoryList integrationId={integrationId} flowId={flowId} />
              </div>
              <div className={classes.content}>
                <PanelHeader
                  className={classes.header}
                  title={currentSectionLabel}>
                  <Filters
                    integrationId={integrationId}
                    flowId={flowId}
                    uiAssistant={uiAssistant}
                  />
                  {collapseStatus === 'collapsed' ? (
                    <IconTextButton
                      variant="text"
                      onClick={handleExpandAll}
                      className={classes.expCollBtn}>
                      <ExpandWindowIcon /> Expand All
                    </IconTextButton>
                  ) : (
                    <IconTextButton
                      variant="text"
                      onClick={handleCollapseAll}
                      className={classes.expCollBtn}>
                      <CollapseWindowIcon /> Collapse All
                    </IconTextButton>
                  )}
                </PanelHeader>
                <div className={classes.mappingHeader}>
                  <div className={classes.mappingChild}>
                    <Typography variant="h5" className={classes.childHeader}>
                      {uiAssistant}
                    </Typography>
                    <ApplicationImg
                      assistant={uiAssistant.toLowerCase()}
                      size="small"
                    />
                  </div>
                  <div className={classes.mappingChild}>
                    <Typography variant="h5" className={classes.childHeader}>
                      NetSuite
                    </Typography>
                    <ApplicationImg assistant="netsuite" />
                  </div>
                </div>
                <CategoryMappings
                  integrationId={integrationId}
                  flowId={flowId}
                  sectionId={categoryId}
                />
                <ButtonComp
                  flowId={flowId}
                  integrationId={integrationId}
                  parentUrl={parentUrl} />
              </div>
            </div>
          </div>
        ) : (
          <Loader open hideBackDrop>
            Loading
            <Spinner />
          </Loader>
        )}
      </Drawer>
      <SettingsDrawer
        integrationId={integrationId}
        flowId={flowId}
        importId={importId}
      />
    </>
  );
}

const InitializationComp = ({integrationId, flowId, categoryId, parentUrl}) => {
  const history = useHistory();

  const dispatch = useDispatch();
  const match = useRouteMatch();
  const metadataLoaded = useSelector(
    state => !!selectors.categoryMapping(state, integrationId, flowId)
  );

  const mappingSaveStatus = useSelector(state =>
    selectors.categoryMappingSaveStatus(state, integrationId, flowId)
  );
  const mappedCategories = useSelectorMemo(selectors.mkMappedCategories, integrationId, flowId) || [];
  const isCurrentCategoryDeleted = useSelector(state => {
    const categoryMappingMetadata =
      selectors.categoryMapping(state, integrationId, flowId) || {};
    const { deleted = [] } = categoryMappingMetadata;

    return deleted?.[0]?.includes?.(categoryId);
  });

  useEffect(() => {
    if (!metadataLoaded) {
      dispatch(
        actions.integrationApp.settings.categoryMappings.requestMetadata(
          integrationId,
          flowId,
          categoryId
        )
      );
    }
  }, [
    dispatch,
    flowId,
    integrationId,
    metadataLoaded,
    categoryId,
  ]);
  useEffect(() => {
    const invalidCategory = !mappedCategories.find(c => c.id === categoryId);

    if (metadataLoaded && invalidCategory) {
      history.push(
        generatePath(match.path, {
          ...match.params,
          categoryId: 'commonAttributes',
        })
      );
    }
  }, [
    categoryId,
    flowId,
    history,
    mappedCategories,
    match.params,
    match.path,
    metadataLoaded,
  ]);

  useEffect(() => {
    if (mappingSaveStatus === 'close') {
      history.push(parentUrl);
      dispatch(
        actions.integrationApp.settings.categoryMappings.clear(
          integrationId,
          flowId
        )
      );
    } else if (mappingSaveStatus === 'saved' && isCurrentCategoryDeleted) {
      history.push(
        generatePath(match.path, {
          ...match.params,
          categoryId: 'commonAttributes',
        })
      );
      dispatch(
        actions.integrationApp.settings.categoryMappings.clearSaveStatus(
          integrationId,
          flowId
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, isCurrentCategoryDeleted, mappingSaveStatus, parentUrl]);

  return null;
};
const ButtonComp = ({flowId, integrationId, parentUrl}) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const mappingsChanged = useSelectorMemo(selectors.mkCategoryMappingsChanged, integrationId, flowId);
  const mappingSaveStatus = useSelector(state =>
    selectors.categoryMappingSaveStatus(state, integrationId, flowId)
  );

  const isSaving = mappingSaveStatus === 'requested';

  const handleSave = useCallback(() => {
    dispatch(
      actions.integrationApp.settings.categoryMappings.save(
        integrationId,
        flowId
      )
    );
  }, [dispatch, flowId, integrationId]);
  const handleSaveAndClose = useCallback(() => {
    dispatch(
      actions.integrationApp.settings.categoryMappings.save(
        integrationId,
        flowId,
        true
      )
    );
  }, [dispatch, flowId, integrationId]);
  const handleClose = useCallback(() => {
    history.push(parentUrl);
    dispatch(
      actions.integrationApp.settings.categoryMappings.clear(
        integrationId,
        flowId
      )
    );
  }, [dispatch, flowId, history, integrationId, parentUrl]);

  return (

    <ActionGroup className={classes.saveButtonGroup}>
      <FilledButton
        id={flowId}
        disabled={!mappingsChanged || isSaving}
        data-test="saveCategoryMappings"
        onClick={handleSave}>
        {isSaving ? 'Saving...' : 'Save'}
      </FilledButton>
      {(mappingsChanged || isSaving) && (
      <OutlinedButton
        id={flowId}
        disabled={isSaving}
        data-test="saveAndCloseImportMapping"
        onClick={handleSaveAndClose}>
        Save & close
      </OutlinedButton>
      )}
      <TextButton
        variant="text"
        data-test="saveImportMapping"
        disabled={isSaving}
        onClick={handleClose}>
        Close
      </TextButton>
    </ActionGroup>
  );
};
export default function CategoryMappingDrawerRoute(props) {
  const match = useRouteMatch();

  return (
    <Route path={`${match.url}/:flowId/utilitymapping/:categoryId`}>
      <LoadResources required resources="exports,imports,connections">
        <CategoryMappingDrawer {...props} parentUrl={match.url} />
      </LoadResources>
    </Route>
  );
}

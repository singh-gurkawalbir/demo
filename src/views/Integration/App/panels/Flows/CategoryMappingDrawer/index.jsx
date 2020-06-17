import React, { useState, useEffect, useCallback } from 'react';
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
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Button,
} from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
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
import ButtonGroup from '../../../../../../components/ButtonGroup';
import CollapseWindowIcon from '../../../../../../components/icons/CollapseWindowIcon';
import ExpandWindowIcon from '../../../../../../components/icons/ExpandWindowIcon';

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
    float: 'left',
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
  const {
    fields: generateFields,
    name,
    variation_themes: variationThemes,
    variation_attributes: variationAttributes,
  } =
    useSelector(state =>
      selectors.categoryMappingGenerateFields(state, integrationId, flowId, {
        sectionId,
      })
    ) || {};
  const { collapseAction } =
    useSelector(state =>
      selectors.categoryMappingsCollapsedStatus(state, integrationId, flowId)
    ) || {};
  const { children = [], deleted } =
    useSelector(state =>
      selectors.mappingsForCategory(state, integrationId, flowId, {
        sectionId,
      })
    ) || {};
  const hasVariationMappings =
    (variationThemes && !!variationThemes.length) ||
    (variationAttributes && !!variationAttributes.length);

  useEffect(() => {
    setRequestedGenerateFields(false);
  }, [sectionId]);

  useEffect(() => {
    if (!generateFields && !requestedGenerateFields && isRoot) {
      dispatch(
        actions.integrationApp.settings.requestCategoryMappingMetadata(
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
  const handleDelete = e => {
    // Clicking of this icon should avoid collapsing this category section
    e.stopPropagation();
    dispatch(
      actions.integrationApp.settings.deleteCategory(
        integrationId,
        flowId,
        sectionId
      )
    );
  };

  const handleRestore = e => {
    // Clicking of this icon should avoid collapsing this category section
    e.stopPropagation();
    dispatch(
      actions.integrationApp.settings.restoreCategory(
        integrationId,
        flowId,
        sectionId
      )
    );
  };

  const handleVariation = e => {
    // Clicking of this icon should avoid collapsing this category section
    e.stopPropagation();
    history.push(`${match.url}/variations/${sectionId}`);
  };

  if (!generateFields) {
    return (
      <Loader open hideBackDrop>
        {`Loading ${sectionId}  metadata`}
        <Spinner />
      </Loader>
    );
  }

  return (
    <div className={isRoot ? classes.mappingContainer : classes.default}>
      <ExpansionPanel
        expanded={expanded}
        elevation={0}
        onChange={handleChange}
        className={
          isRoot ? classes.rootExpansionPanel : classes.childExpansionPanel
        }>
        <ExpansionPanelSummary
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
                <Tooltip title="Hide categories" placement="bottom">
                  <IconButton size="small" color="inherit">
                    <ShowContentIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Enable categories" placement="bottom">
                  <IconButton size="small" color="inherit">
                    <HideContentIcon />
                  </IconButton>
                </Tooltip>
              )}
            </span>
          </div>

          {hasVariationMappings && (
            <Tooltip title="Configure variations" placement="bottom">
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
                <Tooltip title="Restore category" placement="bottom">
                  <IconButton
                    onClick={handleRestore}
                    size="small"
                    color="inherit"
                    className={classes.deleteIcon}>
                    <RestoreIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Delete category" placement="bottom">
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
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classes.fullWidth}>
            <Mappings
              id={`${flowId}-${sectionId}`}
              flowId={flowId}
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
                  isParentCommonCategory={isCommonCategory}
                  generateFields={generateFields || emptySet}
                  sectionId={child.id}
                />
              ))}
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

function CategoryMappingDrawer({ integrationId, parentUrl }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { flowId, categoryId } = match.params;
  const [requestedMetadata, setRequestedMetadata] = useState(false);
  const mappingsChanged = useSelector(state =>
    selectors.categoryMappingsChanged(state, integrationId, flowId)
  );
  const mappingSaveStatus = useSelector(state =>
    selectors.categoryMappingSaveStatus(state, integrationId, flowId)
  );
  const isSaving = mappingSaveStatus === 'requested';
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
  const { collapseStatus = 'collapsed' } = useSelector(state =>
    selectors.categoryMappingsCollapsedStatus(state, integrationId, flowId)
  );
  const uiAssistant = useSelector(state => {
    const categoryMappingMetadata =
      selectors.categoryMapping(state, integrationId, flowId) || {};
    const { uiAssistant = '' } = categoryMappingMetadata;

    return `${uiAssistant.charAt(0).toUpperCase()}${uiAssistant.slice(1)}`;
  });
  const isCurrentCategoryDeleted = useSelector(state => {
    const categoryMappingMetadata =
      selectors.categoryMapping(state, integrationId, flowId) || {};
    const { deleted = [] } = categoryMappingMetadata;

    return deleted.includes(categoryId);
  });
  const mappedCategories =
    useSelector(state =>
      selectors.mappedCategories(state, integrationId, flowId)
    ) || [];
  const currentSectionLabel =
    (mappedCategories.find(category => category.id === categoryId) || {})
      .name || categoryId;

  useEffect(() => {
    if (!metadataLoaded && !requestedMetadata) {
      dispatch(
        actions.integrationApp.settings.requestCategoryMappingMetadata(
          integrationId,
          flowId,
          categoryId
        )
      );
      setRequestedMetadata(true);
    }
  }, [
    dispatch,
    flowId,
    integrationId,
    metadataLoaded,
    requestedMetadata,
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

  const handleClose = useCallback(() => {
    history.push(parentUrl);
    dispatch(
      actions.integrationApp.settings.categoryMappings.clear(
        integrationId,
        flowId
      )
    );
  }, [dispatch, flowId, history, integrationId, parentUrl]);
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
                <ButtonGroup className={classes.saveButtonGroup}>
                  <Button
                    id={flowId}
                    variant="outlined"
                    color="primary"
                    disabled={!mappingsChanged || isSaving}
                    data-test="saveCategoryMappings"
                    onClick={handleSave}>
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                  {(mappingsChanged || isSaving) && (
                    <Button
                      id={flowId}
                      variant="outlined"
                      color="secondary"
                      disabled={isSaving}
                      data-test="saveAndCloseImportMapping"
                      onClick={handleSaveAndClose}>
                      Save & close
                    </Button>
                  )}
                  <Button
                    variant="text"
                    data-test="saveImportMapping"
                    disabled={isSaving}
                    onClick={handleClose}>
                    Close
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
        ) : (
          <Loader open hideBackDrop>
            Loading Mappings.
            <Spinner />
          </Loader>
        )}
      </Drawer>
    </>
  );
}

export default function CategoryMappingDrawerRoute(props) {
  const match = useRouteMatch();

  return (
    <Route path={`${match.url}/:flowId/utilitymapping/:categoryId`}>
      <LoadResources required resources="flows,exports,imports,connections">
        <CategoryMappingDrawer {...props} parentUrl={match.url} />
      </LoadResources>
    </Route>
  );
}

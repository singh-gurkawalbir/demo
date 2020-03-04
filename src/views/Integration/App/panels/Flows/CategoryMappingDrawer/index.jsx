import { useState, useEffect, Fragment, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, useRouteMatch, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Drawer,
  Typography,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Button,
  Divider,
} from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
import actions from '../../../../../../actions';
import LoadResources from '../../../../../../components/LoadResources';
import Loader from '../../../../../../components/Loader';
import Spinner from '../../../../../../components/Spinner';
import PanelHeader from '../../../../../../components/PanelHeader';
import TrashIcon from '../../../../../../components/icons/TrashIcon';
import RestoreIcon from '../../../../../../components/icons/RestoreIcon';
import ApplicationImg from '../../../../../../components/icons/ApplicationImg';
import ArrowUpIcon from '../../../../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../../../components/icons/ArrowDownIcon';
import VariationIcon from '../../../../../../components/icons/AdjustInventoryIcon';
import Mappings from './BasicMapping';
import Filters from './Filters';
import CategoryList from './CategoryList';
import DrawerTitleBar from './TitleBar';
import ButtonGroup from '../../../../../../components/ButtonGroup';
import FullScreenCloseIcon from '../../../../../../components/icons/FullScreenCloseIcon';

const emptySet = [];
const drawerWidth = 200;
const useStyles = makeStyles(theme => ({
  drawerPaper: {
    // marginTop: theme.appBarHeight,
    width: `60%`,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
    overflowX: 'hidden',
  },
  mappingContainer: {
    padding: '0 0 10px 20px',
    border: 'solid 1px',
    borderColor: theme.palette.background.default,
  },
  refreshButton: {
    marginLeft: theme.spacing(1),
    marginRight: 0,
  },
  saveButtonGroup: {
    margin: '10px 10px 10px 10px',
    float: 'right',
  },
  fullWidth: {
    width: '100%',
  },
  settingsForm: {
    maxHeight: `calc(100vh - 120px)`,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  drawerPaperInner: {
    width: drawerWidth,
    position: 'relative',
  },
  mappingHeader: {
    padding: theme.spacing(1),
    marginLeft: '20px',
    background: theme.palette.background.default,
  },
  toolbar: theme.mixins.toolbar,
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
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
    minWidth: 200,
    background: theme.palette.background.paper2,
    borderRight: `solid 1px ${theme.palette.secondary.lightest}`,
    paddingTop: theme.spacing(2),
  },
  deleteIcon: {
    position: 'absolute',
    right: '20px',
  },
  variationIcon: {
    position: 'absolute',
    right: '50px',
  },
  content: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(0, 0, 3, 0),
  },
  header: {
    background: 'blue',
  },
  listItem: {
    color: theme.palette.text.primary,
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
  default: {
    marginBottom: 10,
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
  const { fields: generateFields, name, variation_themes: variationThemes } =
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
      <Loader open>
        {`Loading ${sectionId}  metadata`}
        <Spinner />
      </Loader>
    );
  }

  return (
    <div className={isRoot ? classes.mappingContainer : classes.default}>
      <ExpansionPanel
        expanded={expanded}
        onChange={handleChange}
        className={isRoot ? '' : classes.childExpansionPanel}>
        <ExpansionPanelSummary
          aria-controls="panel1bh-content"
          id="panel1bh-header">
          {expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
          <Typography className={classes.secondaryHeading} variant="body2">
            {name}
          </Typography>
          {!!variationThemes && !!variationThemes.length && (
            <VariationIcon
              className={classes.variationIcon}
              onClick={handleVariation}
            />
          )}
          {!isCommonCategory && (
            <div>
              {deleted ? (
                <RestoreIcon
                  className={classes.deleteIcon}
                  onClick={handleRestore}
                />
              ) : (
                <TrashIcon
                  className={classes.deleteIcon}
                  onClick={handleDelete}
                />
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
  const mappedCategories =
    useSelector(state =>
      selectors.mappedCategories(state, integrationId, flowId)
    ) || [];
  const currentSectionLabel =
    (mappedCategories.find(category => category.id === categoryId) || {})
      .name || categoryId;
  const handleClose = useCallback(() => {
    history.push(parentUrl);
  }, [history, parentUrl]);
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
        flowId
      )
    );
    handleClose();
  }, [dispatch, flowId, handleClose, integrationId]);

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
    <Fragment>
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
            <Grid container wrap="nowrap">
              <Grid item className={classes.subNav}>
                <CategoryList integrationId={integrationId} flowId={flowId} />
              </Grid>
              <Grid item className={classes.content}>
                <PanelHeader
                  className={classes.header}
                  title={currentSectionLabel}>
                  <Filters
                    integrationId={integrationId}
                    flowId={flowId}
                    uiAssistant={uiAssistant}
                  />
                  {collapseStatus === 'collapsed' ? (
                    <Button variant="text" onClick={handleExpandAll}>
                      <FullScreenCloseIcon /> Expand All
                    </Button>
                  ) : (
                    <Button variant="text" onClick={handleCollapseAll}>
                      <FullScreenCloseIcon /> Collapse All
                    </Button>
                  )}
                </PanelHeader>
                <Grid container className={classes.mappingHeader}>
                  <Grid item xs={6}>
                    <Typography variant="h5" className={classes.childHeader}>
                      {uiAssistant}
                      <ApplicationImg
                        assistant={uiAssistant.toLowerCase()}
                        size="small"
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h5" className={classes.childHeader}>
                      NetSuite
                      <ApplicationImg assistant="netsuite" />
                    </Typography>
                  </Grid>
                </Grid>
                <CategoryMappings
                  integrationId={integrationId}
                  flowId={flowId}
                  sectionId={categoryId}
                />
              </Grid>
            </Grid>

            <Divider />
            <ButtonGroup className={classes.saveButtonGroup}>
              <Button
                id={flowId}
                variant="outlined"
                color="primary"
                data-test="saveImportMapping"
                onClick={handleSave}>
                Save
              </Button>
              <Button
                id={flowId}
                variant="outlined"
                color="secondary"
                data-test="saveAndCloseImportMapping"
                onClick={handleSaveAndClose}>
                Save & Close
              </Button>
              <Button
                variant="text"
                data-test="saveImportMapping"
                onClick={handleClose}>
                Close
              </Button>
            </ButtonGroup>
          </div>
        ) : (
          <Loader open>
            Loading Mappings.
            <Spinner />
          </Loader>
        )}
      </Drawer>
    </Fragment>
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

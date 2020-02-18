import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Grid, Typography } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import * as selectors from '../../../../../../reducers';
import DrawerTitleBar from './TitleBar';
import LoadResources from '../../../../../../components/LoadResources';
import actions from '../../../../../../actions';
import Loader from '../../../../../../components/Loader';
import Spinner from '../../../../../../components/Spinner';
import Filters from './Filters';
import PanelHeader from '../../../../../../components/PanelHeader';
import TrashIcon from '../../../../../../components/icons/TrashIcon';
import Mappings from './MappingsWrapper';
import CategoryList from './CategoryList';
import ApplicationImg from '../../../../../../components/icons/ApplicationImg';
import ArrowUpIcon from '../../../../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../../../components/icons/ArrowDownIcon';
import VariationIcon from '../../../../../../components/icons/AdjustInventoryIcon';

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

function CategoryMappings({ integrationId, flowId, sectionId, isRoot = true }) {
  const [requestedGenerateFields, setRequestedGenerateFields] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [expanded, setExpanded] = useState(isRoot);
  const handleDelete = e => {
    // Clicking of this icon should avoid collapsing this category section
    e.stopPropagation();
  };

  const handleVariation = e => {
    // Clicking of this icon should avoid collapsing this category section
    e.stopPropagation();
  };

  const { fields: generateFields, name, variation_themes: variationThemes } =
    useSelector(state =>
      selectors.categoryMappingGenerateFields(state, integrationId, flowId, {
        sectionId,
      })
    ) || {};
  const { children = [] } =
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

  const handleChange = () => {
    setExpanded(!expanded);
  };

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
          <TrashIcon className={classes.deleteIcon} onClick={handleDelete} />
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

function CategoryMappingDrawer({ integrationId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
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
  const mappedCategories =
    useSelector(state =>
      selectors.mappedCategories(state, integrationId, flowId)
    ) || [];
  const currentSectionLabel =
    (mappedCategories.find(category => category.id === categoryId) || {})
      .name || categoryId;
  const handleClose = () => {};

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

  if (!integrationName) {
    return <LoadResources required resources="integrations" />;
  }

  return (
    <Drawer
      anchor="right"
      open={!!match}
      classes={{
        paper: classes.drawerPaper,
      }}
      onClose={handleClose}>
      <DrawerTitleBar flowId={flowId} />
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
                <Filters integrationId={integrationId} flowId={flowId} />
              </PanelHeader>
              <Grid container className={classes.mappingHeader}>
                <Grid item xs={6}>
                  <Typography variant="h5" className={classes.childHeader}>
                    Amazon <ApplicationImg assistant="amazonmws" size="small" />
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
        </div>
      ) : (
        <Loader open>
          Loading Mappings.
          <Spinner />
        </Loader>
      )}
    </Drawer>
  );
}

export default function CategoryMappingDrawerRoute(props) {
  const match = useRouteMatch();

  return (
    <Route exact path={`${match.url}/:flowId/utilitymapping/:categoryId`}>
      <LoadResources required resources="flows,exports,imports,connections">
        <CategoryMappingDrawer {...props} parentUrl={match.url} />
      </LoadResources>
    </Route>
  );
}

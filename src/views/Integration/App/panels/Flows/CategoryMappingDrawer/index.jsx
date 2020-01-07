import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, useRouteMatch, NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { List, ListItem, Grid, Link } from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
import DrawerTitleBar from './TitleBar';
import LoadResources from '../../../../../../components/LoadResources';
import actions from '../../../../../../actions';
import Loader from '../../../../../../components/Loader';
import Spinner from '../../../../../../components/Spinner';
import Filters from './Filters';
import PanelHeader from '../../../../common/PanelHeader';
import AddIcon from '../../../../../../components/icons/TrashIcon';
import Mappings from './MappingsWrapper';
import IconTextButton from '../../../../../../components/IconTextButton';

const drawerWidth = 200;
const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: `80%`,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
  },
  filter: {
    float: 'right',
  },
  settingsForm: {
    maxHeight: `calc(100vh - 120px)`,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaperInner: {
    width: drawerWidth,
    position: 'relative',
  },
  toolbar: theme.mixins.toolbar,
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
}));

function CategoryMappings({
  integrationId,
  flowId,
  sectionId,
  extractFields,
  generateFields,
  metadata,
}) {
  const [amazonAttributeFilter, setAmazonAttributeFilter] = useState('all');
  const [fieldMappingsFilter, setFieldMappingsFilter] = useState('mapped');
  const classes = useStyles();
  const handleAmzonAttributeChange = useCallback(val => {
    setAmazonAttributeFilter(val);
  }, []);
  const handleFieldMappingsFilterChange = useCallback(val => {
    setFieldMappingsFilter(val);
  }, []);
  const handleDelete = () => {};
  const mappings =
    useSelector(state => {
      if (metadata) return metadata;

      return selectors.mappingsForCategory(state, integrationId, flowId, {
        sectionId,
        amazonAttributeFilter,
        fieldMappingsFilter,
      });
    }) || {};
  const { fieldMappings = [], children = [] } = mappings;

  return (
    <div>
      {!metadata && (
        <Filters
          handleAmzonAttributeChange={handleAmzonAttributeChange}
          mappings={mappings}
          handleFieldMappingsFilterChange={handleFieldMappingsFilterChange}
        />
      )}

      <PanelHeader className={classes.header} title={mappings.name}>
        <IconTextButton
          data-test={`configure${mappings.id}`}
          component={Link}
          onClick={handleDelete}>
          <AddIcon /> Delete
        </IconTextButton>
      </PanelHeader>
      <Mappings
        id={`${flowId}-${sectionId}`}
        flowId={flowId}
        integrationId={integrationId}
        sectionId={sectionId}
        extractFields={generateFields}
        generateFields={extractFields}
        mappings={{ fields: fieldMappings }}
      />
      {children.length > 0 &&
        children.map(child => (
          <CategoryMappings
            integrationId={integrationId}
            flowId={flowId}
            extractFields={extractFields}
            generateFields={generateFields}
            key={child.id}
            metadata={child}
            sectionId={child.id}
          />
        ))}
    </div>
  );
}

function CategoryMappingDrawer({ integrationId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const match = useRouteMatch();
  const { flowId, categoryId } = match.params;
  const flow =
    useSelector(state => selectors.resource(state, 'flows', flowId)) || {};
  const flowName = flow.name || flow._id;
  const [requestedMetadata, setRequestedMetadata] = useState(false);
  const integrationName = useSelector(state => {
    const integration = selectors.resource(
      state,
      'integrations',
      integrationId
    );

    return integration ? integration.name : null;
  });
  const metadata = useSelector(state =>
    selectors.categoryMapping(state, integrationId, flowId)
  );
  const { extractsMetadata, generatesMetadata } = useSelector(state =>
    selectors.categoryMappingMetadata(state, integrationId, flowId)
  );
  const mappedCategories =
    useSelector(state =>
      selectors.mappedCategories(state, integrationId, flowId)
    ) || [];
  const handleClose = () => {};

  useEffect(() => {
    if (!metadata && !requestedMetadata) {
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
    metadata,
    requestedMetadata,
    categoryId,
  ]);

  if (!integrationName) {
    return <LoadResources required resources="integrations" />;
  }

  return (
    <Drawer
      // variant="persistent"
      anchor="right"
      open={!!match}
      classes={{
        paper: classes.drawerPaper,
      }}
      onClose={handleClose}>
      <DrawerTitleBar title={`Edit Mappings: ${flowName}`} />
      {metadata ? (
        <div className={classes.root}>
          <Grid container wrap="nowrap">
            <Grid item className={classes.subNav}>
              <List>
                {mappedCategories.map(({ name, id }) => (
                  <ListItem key={id}>
                    <NavLink
                      className={classes.listItem}
                      activeClassName={classes.activeListItem}
                      to={id}
                      data-test={id}>
                      {name}
                    </NavLink>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item className={classes.content}>
              <CategoryMappings
                integrationId={integrationId}
                extractFields={extractsMetadata}
                generateFields={generatesMetadata}
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
      <LoadResources required resources="exports,imports,flows,connections">
        <CategoryMappingDrawer {...props} parentUrl={match.url} />
      </LoadResources>
    </Route>
  );
}

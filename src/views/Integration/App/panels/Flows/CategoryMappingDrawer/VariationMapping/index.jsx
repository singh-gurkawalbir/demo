import { Drawer, makeStyles, Typography, Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useCallback, Fragment } from 'react';
import {
  useRouteMatch,
  useHistory,
  Route,
  useLocation,
} from 'react-router-dom';
import * as selectors from '../../../../../../../reducers';
import PanelHeader from '../../../../../../../components/PanelHeader';
import LoadResources from '../../../../../../../components/LoadResources';
import ApplicationImg from '../../../../../../../components/icons/ApplicationImg';
import DrawerTitleBar from '../TitleBar';
import VariationAttributesList from './AttributesList';
import VariationMappings from './MappingsWrapper';

const drawerWidth = 200;
const useStyles = makeStyles(theme => ({
  drawerPaper: {
    // marginTop: theme.appBarHeight,
    width: 750,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    overflowX: 'hidden',
  },
  form: {
    maxHeight: `calc(100vh - 180px)`,
    padding: theme.spacing(2, 3),
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

function VariationMappingDrawer({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const { flowId, subCategoryId, variation } = match.params;
  const classes = useStyles();
  const history = useHistory();
  const uiAssistant = useSelector(state => {
    const categoryMappingMetadata =
      selectors.categoryMapping(state, integrationId, flowId) || {};
    const { uiAssistant = '' } = categoryMappingMetadata;

    return `${uiAssistant.charAt(0).toUpperCase()}${uiAssistant.slice(1)}`;
  });
  const firstVariation =
    useSelector(state => {
      // propery being read as is from IA metadata, to facilitate initialization and to avoid re-adjust while sending back.
      // eslint-disable-next-line camelcase
      const { variation_themes = [] } =
        selectors.categoryMappingGenerateFields(state, integrationId, flowId, {
          sectionId: subCategoryId,
        }) || {};
      const variation = variation_themes.find(
        theme => theme.id === 'variation_theme'
      );

      return (
        variation &&
        variation.variation_attributes &&
        variation.variation_attributes[0]
      );
    }) || {};
  const handleClose = useCallback(() => {
    history.push(parentUrl);
  }, [history, parentUrl]);

  if (!variation) {
    history.push(`${match.url}/${firstVariation}`);

    return null;
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
        <DrawerTitleBar
          title={`Configure ${uiAssistant} variation themes: ${uiAssistant} - NetSuie`}
          flowId={flowId}
          addCategory
          onClose={handleClose}
        />
        <div className={classes.root}>
          <Grid container wrap="nowrap">
            <Grid item className={classes.subNav}>
              <VariationAttributesList
                integrationId={integrationId}
                flowId={flowId}
                categoryId={subCategoryId}
              />
            </Grid>
            <Grid item className={classes.content}>
              <PanelHeader
                className={classes.header}
                title="Map variant attributes"
              />
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
              <VariationMappings
                integrationId={integrationId}
                flowId={flowId}
                sectionId={subCategoryId}
                variation={variation}
              />
            </Grid>
          </Grid>
        </div>
      </Drawer>
    </Fragment>
  );
}

export default function VariationMappingDrawerRoute(props) {
  const match = useRouteMatch();
  const location = useLocation();

  return (
    <Route
      exact
      path={[
        `${match.url}/:flowId/utilitymapping/:categoryId/variations/:subCategoryId`,
        `${match.url}/:flowId/utilitymapping/:categoryId/variations/:subCategoryId/:variation`,
      ]}>
      <LoadResources required resources="flows,exports,imports,connections">
        <VariationMappingDrawer
          {...props}
          parentUrl={location.pathname.replace(/\/variations\/.*$/, '')}
        />
      </LoadResources>
    </Route>
  );
}

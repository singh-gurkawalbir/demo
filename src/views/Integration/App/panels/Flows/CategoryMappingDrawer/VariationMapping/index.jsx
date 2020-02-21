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
import VariationAttributesList from './AtrributesList';
import VariationMappings from './Mappings';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 750,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    zIndex: theme.zIndex.drawer + 1,
  },
  form: {
    maxHeight: `calc(100vh - 180px)`,
    padding: theme.spacing(2, 3),
  },
}));

function VariationMappingDrawer({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const { flowId, subCategoryId } = match.params;
  const classes = useStyles();
  const history = useHistory();
  const uiAssistant = useSelector(state => {
    const categoryMappingMetadata =
      selectors.categoryMapping(state, integrationId, flowId) || {};
    const { uiAssistant = '' } = categoryMappingMetadata;

    return `${uiAssistant.charAt(0).toUpperCase()}${uiAssistant.slice(1)}`;
  });
  const handleClose = useCallback(() => {
    history.push(parentUrl);
  }, [history, parentUrl]);

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
                categoryId={subCategoryId}
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
      path={`${match.url}/:flowId/utilitymapping/:categoryId/variations/:subCategoryId`}>
      <LoadResources required resources="flows,exports,imports,connections">
        <VariationMappingDrawer
          {...props}
          parentUrl={location.pathname.replace(/\/variations\/.*$/, '')}
        />
      </LoadResources>
    </Route>
  );
}

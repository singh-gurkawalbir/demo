import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import {
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
import DrawerTitleBar from './TitleBar';
import LoadResources from '../../../../../../components/LoadResources';
import actions from '../../../../../../actions';
import Loader from '../../../../../../components/Loader';
import Spinner from '../../../../../../components/Spinner';

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
  settingsForm: {
    maxHeight: `calc(100vh - 120px)`,
  },
}));

function CategoryMappingDrawer({ integrationId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const match = useRouteMatch();
  const { flowId } = match.params;
  const flow =
    useSelector(state => selectors.resource(state, 'flows', flowId)) || {};
  const flowName = flow.name || flow._id;
  const [amazonAttributeFilter, setAmazonAttributeFilter] = useState('all');
  const [fieldMappingsFilter, setFieldMappingsFilter] = useState('mapped');
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
  const handleAmzonAttributeChange = val => {
    setAmazonAttributeFilter(val);
  };

  const handleFieldMappingsFilterChange = val => {
    setFieldMappingsFilter(val);
  };

  const handleClose = () => {};

  useEffect(() => {
    if (!metadata && !requestedMetadata) {
      dispatch(
        actions.integrationApp.settings.requestCategoryMappingMetadata(
          integrationId,
          flowId
        )
      );
      setRequestedMetadata(true);
    }
  }, [dispatch, flowId, integrationId, metadata, requestedMetadata]);

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
        <div className={classes.content}>
          <Grid container>
            <Grid item xs>
              <Typography variant="h4">Product Mappings</Typography>
            </Grid>
            <Grid item xs>
              <FormControl className={classes.formControl}>
                <InputLabel>Amazon Attributes</InputLabel>
                <Select
                  id="demo-simple-select"
                  label="Amazon Attributes"
                  value={amazonAttributeFilter || 'all'}
                  onChange={handleAmzonAttributeChange}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="required">Required</MenuItem>
                  <MenuItem value="preferred">Preferred</MenuItem>
                  <MenuItem value="conditional">Conditional</MenuItem>
                </Select>
              </FormControl>
              <Select
                id="demo-simple-select"
                label="sometext"
                value={fieldMappingsFilter}
                onChange={handleFieldMappingsFilterChange}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="mapped">Mapped</MenuItem>
                <MenuItem value="unmapped">Unmapped</MenuItem>
              </Select>
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
    <Route exact path={`${match.url}/:flowId/utilitymapping/:sectionId`}>
      <LoadResources required resources="exports,imports,flows,connections">
        <CategoryMappingDrawer {...props} parentUrl={match.url} />
      </LoadResources>
    </Route>
  );
}

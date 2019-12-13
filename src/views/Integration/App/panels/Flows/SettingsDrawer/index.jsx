import { useCallback, useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import * as selectors from '../../../../../../reducers';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../forms/utils';
import { ActionsFactory } from '../../../../../../components/ResourceFormFactory';
import DrawerTitleBar from '../../../../../../components/drawer/TitleBar';
import LoadResources from '../../../../../../components/LoadResources';
import getRoutePath from '../../../../../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    minWidth: 824,
    maxWidth: 1300,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
  },
  settingsForm: {
    maxHeight: `calc(100vh - 120px)`,
    // maxHeight: 'unset',
    // padding: theme.spacing(2, 3),
  },
}));

function SettingsDrawer({ integrationId, storeId }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { flowId } = match.params;
  const flow =
    useSelector(state => selectors.resource(state, 'flows', flowId)) || {};
  const flowName = flow.name || flow._id;
  // TODO: Fix this convoluted way of getting settings for a specific flow.
  // the data layer should have a simple, clean, selector api, that, given a flowId,
  // returns the flow settings. Right now to look up this info, i need to
  // jump through hoops to accomplish a simple lookup. It was also a brutal task to
  // trace existing code and find the solution to this. There were SO many proxied
  // props (all of which would cause re-renders of deep component trees)
  // We have a data-layer for a reason. There is absolutely no reason to proxy data-layer
  // results deeply through many nested components.
  const formState = useSelector(state =>
    selectors.integrationAppSettingsFormState(state, integrationId, flowId)
  );
  const { settings: fields, sections } = useSelector(
    state => selectors.getIAFlowSettings(state, integrationId, flowId),
    shallowEqual
  );
  const fieldMeta = useMemo(
    () =>
      integrationSettingsToDynaFormMetadata(
        { fields, sections },
        integrationId,
        true,
        { resource: flow }
      ),
    [fields, flow, integrationId, sections]
  );
  const handleClose = useCallback(() => {
    history.push(getRoutePath(match.url));
  }, [history, match.url]);

  // console.log('render <SettingsDrawer>');

  return (
    <Drawer
      // variant="persistent"
      anchor="right"
      open={!!match}
      classes={{
        paper: classes.drawerPaper,
      }}
      onClose={handleClose}>
      <DrawerTitleBar title={`Settings: ${flowName}`} />

      {fieldMeta && (
        <ActionsFactory
          className={classes.settingsForm}
          integrationId={integrationId}
          flowId={flowId}
          storeId={storeId}
          onSubmitComplete={handleClose}
          // TODO: why do we need to spread the form state here?
          // what does this accomplish? In some places we do not do this.
          {...formState}
          fieldMeta={fieldMeta}
        />
      )}
    </Drawer>
  );
}

export default function SettingsDrawerRoute(props) {
  const match = useRouteMatch();

  return (
    <Route exact path={`${match.url}/:flowId/settings`}>
      <LoadResources required resources="exports,imports,flows,connections">
        <SettingsDrawer {...props} />
      </LoadResources>
    </Route>
  );
}

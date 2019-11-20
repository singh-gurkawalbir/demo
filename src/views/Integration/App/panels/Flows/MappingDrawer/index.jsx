import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer } from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
import DrawerTitleBar from '../../../../../../components/drawer/TitleBar';
import LoadResources from '../../../../../../components/LoadResources';
import StandaloneImportMapping from '../../../../../../components/AFE/ImportMapping/StandaloneImportMapping';
import SelectImport from './SelectImport';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 660,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
  },
  form: {
    maxHeight: `calc(100vh - 180px)`,
    padding: theme.spacing(2, 3),
  },
}));

function MappingDrawer() {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { flowId, importId } = match.params;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));
  const flowName = flow.name || flow._id;
  const imp = useSelector(state =>
    selectors.resource(state, 'imports', importId)
  );
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Drawer
      // variant="persistent"
      anchor="right"
      open={!!match}
      classes={{
        paper: classes.drawerPaper,
      }}
      onClose={handleClose}>
      <DrawerTitleBar title={`Edit mapping(s) for flow ${flowName}`} />
      <LoadResources required="true" resources="imports">
        {importId ? (
          <StandaloneImportMapping
            // why is this prop called resourceId? Is it possible to pass in
            // any resourceID? I think now.. since it probably ONLY works with
            // am importId, this prop should be called as such.
            resourceId={importId}
            // TODO: Why do we need to pass in a connectionId?
            // is this the connectionID that exists on the import resource?
            // if so, why doesn't this child component look-up the
            // connectionId on its own?
            connectionId={imp._connectionId}
            onClose={handleClose}
          />
        ) : (
          <SelectImport flowId={flowId} />
        )}
      </LoadResources>
    </Drawer>
  );
}

export default function MappingDrawerRoute(props) {
  const match = useRouteMatch();

  return (
    <Route
      exact
      path={[
        `${match.url}/:flowId/mapping`,
        `${match.url}/:flowId/mapping/:importId`,
      ]}>
      <MappingDrawer {...props} />
    </Route>
  );
}

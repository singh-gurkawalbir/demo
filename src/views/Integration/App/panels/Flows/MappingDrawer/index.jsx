import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer } from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
import DrawerTitleBar from '../../../../../../components/drawer/TitleBar';
import LoadResources from '../../../../../../components/LoadResources';
import StandaloneMapping from '../../../../../../components/AFE/ImportMapping/StandaloneMapping';
import SelectImport from './SelectImport';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 800,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    borderTop: `solid 1px ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(3),
    maxHeight: `calc(100vh - 180px)`,
  },
}));

function MappingDrawer() {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { flowId, importId } = match.params;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));
  const flowName = flow.name || flow._id;
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
      <DrawerTitleBar title={`Edit mapping for flow ${flowName}`} />
      <div className={classes.content}>
        <LoadResources required="true" resources="imports">
          {importId ? (
            <StandaloneMapping
              id={`${importId}-${flowId}`}
              // why is this prop called resourceId? Is it possible to pass in
              // any resourceID? I think now.. since it probably ONLY works with
              // am importId, this prop should be called as such.
              resourceId={importId}
              flowId={flowId}
              onClose={handleClose}
            />
          ) : (
            <SelectImport flowId={flowId} />
          )}
        </LoadResources>
      </div>
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

import { Fragment, useCallback } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import DrawerTitleBar from '../../../../../components/drawer/TitleBar';
import LoadResources from '../../../../../components/LoadResources';
import StandaloneMapping from '../../../../../components/AFE/ImportMapping/StandaloneMapping';
import SelectImport from './SelectImport';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 824,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    borderTop: `solid 1px ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(0, 0, 0, 3),
    display: 'flex',
  },
  buttonGroup: {
    '& button': { marginRight: theme.spacing(1) },
  },
  // TODO:check for better way to handle width when drawer open and closes
  fullWidthDrawerClose: {
    width: 'calc(100% - 60px)',
  },
  fullWidthDrawerOpen: {
    width: `calc(100% - ${theme.drawerWidth}px)`,
  },
}));

function MappingDrawer() {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { flowId, importId } = match.params;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));
  const flowName = flow.name || flow._id;
  const mappingEditorId = `${importId}-${flowId}`;
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);
  const { showSalesforceNetsuiteAssistant } = useSelector(state =>
    selectors.mapping(state, mappingEditorId)
  );
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  return (
    <Drawer
      // variant="persistent"
      anchor="right"
      open={!!match}
      classes={{
        paper: clsx(classes.drawerPaper, {
          [classes.fullWidthDrawerClose]:
            !drawerOpened && showSalesforceNetsuiteAssistant,
          [classes.fullWidthDrawerOpen]:
            drawerOpened && showSalesforceNetsuiteAssistant,
        }),
      }}
      onClose={handleClose}>
      <DrawerTitleBar title={`Edit mapping for flow ${flowName}`} />
      <div className={classes.content}>
        <LoadResources
          required="true"
          resources="imports, exports, connections">
          {importId ? (
            <Fragment>
              <StandaloneMapping
                id={mappingEditorId}
                onClose={handleClose}
                // why is this prop called resourceId? Is it possible to pass in
                // any resourceID? I think now.. since it probably ONLY works with
                // am importId, this prop should be called as such.
                resourceId={importId}
                flowId={flowId}
              />
            </Fragment>
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

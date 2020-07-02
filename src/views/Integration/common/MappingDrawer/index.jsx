import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer } from '@material-ui/core';
import * as selectors from '../../../../reducers';
import DrawerTitleBar from '../../../../components/drawer/TitleBar';
import LoadResources from '../../../../components/LoadResources';
import StandaloneMapping from '../../../../components/AFE/ImportMapping/StandaloneMapping';
import SelectImport from './SelectImport';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 824,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: '-4px 4px 8px rgba(0,0,0,0.15)',
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    padding: theme.spacing(2, 3),
    display: 'flex',
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
  const { flowId, importId, subRecordMappingId } = match.params;
  const mappingEditorId = `${importId}-${flowId}`;
  const hasPreviewPanel = useSelector(state => {
    const mappingPreviewType = selectors.mappingPreviewType(state, importId);
    return !!mappingPreviewType;
  });

  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  return (
    <Drawer
      // variant="persistent"
      anchor="right"
      open={!!match}
      classes={{
        paper: clsx(classes.drawerPaper, {
          [classes.fullWidthDrawerClose]: !drawerOpened && hasPreviewPanel,
          [classes.fullWidthDrawerOpen]: drawerOpened && hasPreviewPanel,
        }),
      }}
      // eslint-disable-next-line react/jsx-handler-names
      onClose={history.goBack}>
      <DrawerTitleBar title="Edit mapping" />
      <div className={classes.content}>
        <LoadResources
          required="true"
          resources="imports, exports, connections">
          {importId ? (
            <>
              <StandaloneMapping
                id={mappingEditorId}
                // eslint-disable-next-line react/jsx-handler-names
                onClose={history.goBack}
                // why is this prop called resourceId? Is it possible to pass in
                // any resourceID? I think not.. since it probably ONLY works with
                // am importId, this prop should be called as such.
                resourceId={importId}
                flowId={flowId}
                subRecordMappingId={subRecordMappingId}
              />
            </>
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
        `${match.url}/:flowId/mapping/:importId/:subRecordMappingId`,
      ]}>
      <MappingDrawer {...props} />
    </Route>
  );
}

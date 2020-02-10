import { Typography, Drawer, makeStyles } from '@material-ui/core';
import { useCallback } from 'react';
import { useRouteMatch, useHistory, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../../../reducers';
import DrawerTitleBar from '../../../../../../components/drawer/TitleBar';
import LoadResources from '../../../../../../components/LoadResources';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 500,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    zIndex: theme.zIndex.drawer + 1,
  },
  form: {
    maxHeight: `calc(100vh - 180px)`,
    // maxHeight: 'unset',
    padding: theme.spacing(2, 3),
  },
}));

function AddCategoryMappingDrawer({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const classes = useStyles();
  const history = useHistory();
  const integrationName = useSelector(state => {
    const integration = selectors.resource(
      state,
      'integrations',
      integrationId
    );

    return integration ? integration.name : null;
  });
  const handleClose = useCallback(() => {
    history.push(parentUrl);
  }, [history, parentUrl]);

  return (
    <Drawer
      anchor="right"
      classes={{
        paper: classes.drawerPaper,
      }}
      open={!!match}
      onClose={handleClose}>
      <DrawerTitleBar title="Add Category" />
      <Typography>Hello{integrationName}</Typography>
    </Drawer>
  );
}

export default function AddCategoryMappingDrawerRoute({
  integrationId,
  parentUrl,
}) {
  const match = useRouteMatch();

  return (
    <LoadResources required resources="integrations">
      <Route exact path={`${match.url}/:categoryId`}>
        <AddCategoryMappingDrawer
          integrationId={integrationId}
          parentUrl={parentUrl}
        />
      </Route>
    </LoadResources>
  );
}

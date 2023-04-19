import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Route, useHistory, useRouteMatch, NavLink } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Drawer, List, ListItem } from '@mui/material';
import { selectors } from '../../../reducers';
import DrawerTitleBar from '../../../components/drawer/TitleBar';
import LoadResources from '../../../components/LoadResources';
import ResourceForm from '../../../components/ResourceFormFactory';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  subNavOpen: {
    width: 1116,
  },
  subNavClosed: {
    width: 824,
  },
  drawerPaper: {
    border: 'solid 1px',
    boxShadow: '-4px 4px 8px rgba(0,0,0,0.15)',
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.background.paper,

  },
  root: {
    padding: theme.spacing(0),
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    display: 'flex',
    height: '100%',
    borderTop: `1px solid ${theme.palette.background.paper2}`,
  },
  subNav: {
    minWidth: 200,
    borderRight: `solid 1px ${theme.palette.secondary.lightest}`,
    paddingTop: theme.spacing(2),
    background: theme.palette.background.default,
  },
  content: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(0, 3, 3, 3),
    overflowX: 'auto',
  },
  listItem: {
    color: theme.palette.text.primary,
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
}));

function OfflineConnectionDrawer() {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { integrationId, connectionId } = match.params;
  const offlineFilterConfig = useMemo(
    () => ({
      type: 'tiles',
      filter: { _integrationId: integrationId },
    }),
    [integrationId]
  );
  const tile = useSelectorMemo(
    selectors.makeResourceListSelector,
    offlineFilterConfig
  ).resources[0];
  const showSubNav =
    tile && tile.offlineConnections && tile.offlineConnections.length > 1;
  const integrationConnections = useSelector(
    state => {
      const connections = selectors.integrationConnectionList(
        state,
        integrationId
      );

      return tile.offlineConnections.map(connId =>
        connections.find(conn => conn._id === connId)
      );
    },
    (left, right) => left && right && left.length === right.length
  );
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);
  const handleSubmitComplete = useCallback(() => {
    const currentConnectionIndex = tile.offlineConnections.indexOf(
      connectionId
    );

    if (tile.offlineConnections[currentConnectionIndex + 1]) {
      history.replace(`${tile.offlineConnections[currentConnectionIndex + 1]}`);
    } else {
      handleClose();
    }
  }, [connectionId, handleClose, history, tile.offlineConnections]);

  return (
    <Drawer
      anchor="right"
      open={!!match}
      classes={{
        paper: clsx(
          classes.drawerPaper,
          showSubNav ? classes.subNavOpen : classes.subNavClosed
        ),
      }}
      onClose={handleClose}>
      <DrawerTitleBar title="Fix offline connections" />

      <LoadResources required="true" resources="connections">
        <div className={classes.container}>
          <div className={classes.subNav} hidden={!showSubNav}>
            <List>
              {integrationConnections &&
                integrationConnections.map(connection => (
                  <ListItem key={connection._id}>
                    <NavLink
                      replace
                      className={classes.listItem}
                      activeClassName={classes.activeListItem}
                      to={`${connection._id}`}>
                      {connection.name || connection._id}
                    </NavLink>
                  </ListItem>
                ))}
            </List>
          </div>
          <div className={classes.content}>
            <ResourceForm
              resourceType="connections"
              resourceId={connectionId}
              onSubmitComplete={handleSubmitComplete}
            />
          </div>
        </div>
      </LoadResources>
    </Drawer>
  );
}

export default function OfflineConnectionDrawerRoute() {
  const match = useRouteMatch();

  return (
    <Route
      exact
      path={[`${match.url}/:integrationId/offlineconnections/:connectionId`]}>
      <OfflineConnectionDrawer />
    </Route>
  );
}

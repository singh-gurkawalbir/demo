import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { withRouter, Link, useRouteMatch } from 'react-router-dom';
import { Typography, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import HomePageCardContainer from '../../../../components/HomePageCard/HomePageCardContainer';
import Header from '../../../../components/HomePageCard/Header';
import Content from '../../../../components/HomePageCard/Content';
import ApplicationImg from '../../../../components/icons/ApplicationImg';
import AddIcon from '../../../../components/icons/AddIcon';
import ApplicationImages from '../../../../components/HomePageCard/Content/ApplicationImages';
import CardTitle from '../../../../components/HomePageCard/Content/CardTitle';
import Footer from '../../../../components/HomePageCard/Footer';
import FooterActions from '../../../../components/HomePageCard/Footer/FooterActions';
import Info from '../../../../components/HomePageCard/Footer/Info';
import IntegrationTag from '../../../../components/tags/IntegrationTag';
import Manage from '../../../../components/HomePageCard/Footer/Manage';
import PermissionsManageIcon from '../../../../components/icons/PermissionsManageIcon';
import PermissionsMonitorIcon from '../../../../components/icons/PermissionsMonitorIcon';
import { INTEGRATION_ACCESS_LEVELS, SUITESCRIPT_CONNECTORS } from '../../../../constants';
import { tileStatus } from '../../../../utils/home';
import getRoutePath from '../../../../utils/routePaths';
import { selectors } from '../../../../reducers';
import CeligoTruncate from '../../../../components/CeligoTruncate';
import Status from '../../../../components/Buttons/Status';
import { useSelectorMemo } from '../../../../hooks';
import { drawerPaths, buildDrawerUrl } from '../../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  tileName: {
    color: theme.palette.secondary.main,
    wordBreak: 'break-word',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  action: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    color: theme.palette.secondary.light,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  status: {
    position: 'relative',
    '& span': {
      fontSize: '14px',
      color: theme.palette.primary.main,
    },
    '&:hover': {
      '& * > span.MuiTypography-root': {
        color: theme.palette.primary.light,
      },
    },
  },
  headerTileStatus: {
    fontSize: 13,
    paddingLeft: 0,
    '& > * .MuiButton-startIcon': {
      margin: 0,
    },
  },
}));

function SuiteScriptTile({ tile, history, isDragInProgress, isTileDragged }) {
  const match = useRouteMatch();
  const classes = useStyles();
  const accessLevel = useSelector(state => selectors.userAccessLevelOnConnection(state, tile.ssLinkedConnectionId));
  const ssLinkedConnection = useSelector(state => selectors.resource(state, 'connections', tile.ssLinkedConnectionId));
  const isOffline = useSelector(state =>
    selectors.isConnectionOffline(state, tile.ssLinkedConnectionId)
  );

  const connector = SUITESCRIPT_CONNECTORS.find(c => c._id === tile._connectorId);
  const status = tileStatus(tile);
  const {
    urlToIntegrationSettings,
    urlToIntegrationStatus} = useSelectorMemo(selectors.mkHomeTileRedirectUrl, tile);

  const handleTileClick = useCallback(
    event => {
      event.stopPropagation();
      if (isOffline) {
        history.push(getRoutePath(buildDrawerUrl({
          path: drawerPaths.RESOURCE.EDIT,
          baseUrl: match.url,
          params: { resourceType: 'connections', id: tile.ssLinkedConnectionId },
        })));

        return;
      }
      history.push(getRoutePath(urlToIntegrationSettings));
    },
    [isOffline, history, urlToIntegrationSettings, match.url, tile.ssLinkedConnectionId]
  );

  const handleStatusClick = useCallback(
    event => {
      event.stopPropagation();
      if (isOffline) {
        history.push(getRoutePath(buildDrawerUrl({
          path: drawerPaths.RESOURCE.EDIT,
          baseUrl: match.url,
          params: { resourceType: 'connections', id: tile.ssLinkedConnectionId },
        })));

        return;
      }
      history.push(urlToIntegrationStatus);
    },
    [history, isOffline, match.url, tile.ssLinkedConnectionId, urlToIntegrationStatus]
  );
  // IO-13418
  const getApplication = application =>
    application === 'magento' ? 'magento1' : application;

  return (
    <div>
      <HomePageCardContainer onClick={handleTileClick} isDragInProgress={isDragInProgress} isTileDragged={isTileDragged}>
        <Header>
          <Status
            variant={status.variant}
            size="large"
            onClick={handleStatusClick}
            className={classes.headerTileStatus}>
            {status.label}
          </Status>
        </Header>
        <Content>
          <CardTitle>
            <Typography variant="h3" className={classes.tileName} onClick={handleTileClick}>
              <CeligoTruncate isLoggable delay={100} lines={2} placement="bottom">
                {tile.displayName}
              </CeligoTruncate>
            </Typography>
          </CardTitle>
          {tile.connector && tile.connector.applications && (
          <ApplicationImages>
            <ApplicationImg
              type={getApplication(tile.connector.applications[0])}
                />
            <span>
              <AddIcon />
            </span>
            <ApplicationImg
              type={getApplication(tile.connector.applications[1])}
                />
          </ApplicationImages>
          )}
        </Content>
        <Footer>
          <FooterActions>
            {accessLevel && (
            <Manage>
              {accessLevel === INTEGRATION_ACCESS_LEVELS.MONITOR ? (
                <Tooltip
                  title="You have monitor permissions"
                  placement="bottom">
                  <Link
                    color="inherit"
                    className={classes.action}
                    to={getRoutePath(urlToIntegrationSettings)}>
                    <PermissionsMonitorIcon />
                  </Link>
                </Tooltip>
              ) : (
                <Tooltip
                  title="You have manage permissions"
                  placement="bottom">
                  <Link
                    color="inherit"
                    className={classes.action}
                    to={getRoutePath(urlToIntegrationSettings)}>
                    <PermissionsManageIcon />
                  </Link>
                </Tooltip>
              )}
            </Manage>
            )}
            {ssLinkedConnection?.netsuite?.account && <IntegrationTag label={`NS Account #${ssLinkedConnection.netsuite.account}`} />}
          </FooterActions>
          <Info
            variant={tile._connectorId ? 'Integration app' : 'Legacy'}
            label={connector?.user?.company}
            />
        </Footer>
      </HomePageCardContainer>
    </div>
  );
}

export default withRouter(SuiteScriptTile);

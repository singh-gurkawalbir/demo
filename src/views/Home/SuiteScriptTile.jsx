import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Typography, Tooltip, makeStyles, IconButton } from '@material-ui/core';
import HomePageCardContainer from '../../components/HomePageCard/HomePageCardContainer';
import Header from '../../components/HomePageCard/Header';
import Status from '../../components/Status';
import StatusCircle from '../../components/StatusCircle';
import Content from '../../components/HomePageCard/Content';
import ApplicationImg from '../../components/icons/ApplicationImg';
import AddIcon from '../../components/icons/AddIcon';
import ApplicationImages from '../../components/HomePageCard/Content/ApplicationImages';
import CardTitle from '../../components/HomePageCard/Content/CardTitle';
import Footer from '../../components/HomePageCard/Footer';
import FooterActions from '../../components/HomePageCard/Footer/FooterActions';
import Info from '../../components/HomePageCard/Footer/Info';
import Tag from '../../components/HomePageCard/Footer/Tag';
import Manage from '../../components/HomePageCard/Footer/Manage';
import PermissionsManageIcon from '../../components/icons/PermissionsManageIcon';
import PermissionsMonitorIcon from '../../components/icons/PermissionsMonitorIcon';
import ConnectionDownIcon from '../../components/icons/unLinkedIcon';
import { INTEGRATION_ACCESS_LEVELS, TILE_STATUS, SUITESCRIPT_CONNECTORS } from '../../utils/constants';
import {
  tileStatus,
  isTileStatusConnectionDown,
} from './util';
import getRoutePath from '../../utils/routePaths';
import { selectors } from '../../reducers';
import CeligoTruncate from '../../components/CeligoTruncate';

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
}));

function SuiteScriptTile({ tile, history, isDragInProgress, isTileDragged }) {
  const classes = useStyles();
  const accessLevel = useSelector(state => selectors.userAccessLevelOnConnection(state, tile.ssLinkedConnectionId));
  const ssLinkedConnection = useSelector(state => selectors.resource(state, 'connections', tile.ssLinkedConnectionId));
  const connector = SUITESCRIPT_CONNECTORS.find(c => c._id === tile._connectorId);
  const status = tileStatus(tile);
  const isConnectionDown = isTileStatusConnectionDown(tile);
  let urlToIntegrationSettings = `/suitescript/${tile.ssLinkedConnectionId}/integrations/${tile._integrationId}`;

  if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
    urlToIntegrationSettings = `/suitescript/${tile.ssLinkedConnectionId}/integrationapps/${tile._connectorId}/setup`;
  } else if (tile.status === TILE_STATUS.UNINSTALL) {
    urlToIntegrationSettings = `/suitescript/${tile.ssLinkedConnectionId}/integrationapps/${tile.urlName}/${tile._integrationId}/uninstall`;
  } else if (tile._connectorId) {
    urlToIntegrationSettings = `/suitescript/${tile.ssLinkedConnectionId}/integrationapps/${tile.urlName}/${tile._integrationId}/flows`;
  }

  const handleTileClick = useCallback(
    event => {
      event.stopPropagation();

      history.push(getRoutePath(urlToIntegrationSettings));
    },
    [history, urlToIntegrationSettings]
  );
  const handleConnectionDownStatusClick = useCallback(event => {
    event.stopPropagation();
    // TODO - open connection edit
  }, []);

  const handleStatusClick = useCallback(
    event => {
      event.stopPropagation();
      if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
        history.push(
          getRoutePath(
            `/suitescript/${tile.ssLinkedConnectionId}/integrationapps/${tile._connectorId}/setup`
          )
        );
      } else if (tile._connectorId) {
        history.push(
          getRoutePath(`/suitescript/${tile.ssLinkedConnectionId}/integrationapps/${tile.urlName}/${tile._integrationId}/dashboard`)
        );
      } else {
        history.push(
          getRoutePath(
            `/suitescript/${tile.ssLinkedConnectionId}/integrations/${tile._integrationId}/dashboard`
          )
        );
      }
    },
    [tile.status, tile._connectorId, tile.ssLinkedConnectionId, tile.urlName, tile._integrationId, history]
  );
  // IO-13418
  const getApplication = application =>
    application === 'magento' ? 'magento1' : application;

  return (
    <div>
      <HomePageCardContainer onClick={handleTileClick} isDragInProgress={isDragInProgress} isTileDragged={isTileDragged}>
        <Header>
          <Status
            label={status.label}
            onClick={handleStatusClick}
            className={classes.status}>
            <StatusCircle variant={status.variant} />
          </Status>
          {isConnectionDown && (
          <Tooltip data-public title="Connection down" placement="bottom" className={classes.tooltip}>
            <IconButton size="small" color="inherit" onClick={handleConnectionDownStatusClick} className={classes.status}>
              <ConnectionDownIcon />
            </IconButton>
          </Tooltip>
          )}
        </Header>
        <Content>
          <CardTitle>
            <Typography variant="h3" className={classes.tileName} onClick={handleTileClick}>
              <CeligoTruncate dataPublic delay={100} lines={2} placement="bottom">
                {tile.name}
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
                  data-public
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
                  data-public
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
            {ssLinkedConnection?.netsuite?.account && <Tag variant={`NS Account #${ssLinkedConnection.netsuite.account}`} />}
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

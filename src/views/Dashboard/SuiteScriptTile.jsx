import React, { useCallback, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Typography, Tooltip, Button, makeStyles } from '@material-ui/core';
import { useDrag, useDrop } from 'react-dnd-cjs';
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
import { INTEGRATION_ACCESS_LEVELS, TILE_STATUS, SUITESCRIPT_CONNECTORS } from '../../utils/constants';
import {
  tileStatus,
  dragTileConfig,
  dropTileConfig
} from './util';
import getRoutePath from '../../utils/routePaths';
import ModalDialog from '../../components/ModalDialog';
import { getDomain } from '../../utils/resource';
import * as selectors from '../../reducers';

const useStyles = makeStyles(theme => ({
  tileName: {
    color: theme.palette.secondary.light,
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
    '& > * :hover': {
      color: theme.palette.primary.main,
    },
  },
}));

function SuiteScriptTile({ tile, history, onMove, onDrop, index }) {
  const classes = useStyles();
  const [showNotYetSupportedDialog, setShowNotYetSupportedDialog] = useState(
    false
  );
  const accessLevel = useSelector(state => selectors.userAccessLevelOnConnection(state, tile.ssLinkedConnectionId));
  const ssLinkedConnection = useSelector(state => selectors.resource(state, 'connections', tile.ssLinkedConnectionId));
  const connector = SUITESCRIPT_CONNECTORS.find(c => c._id === tile._connectorId);
  const status = tileStatus(tile);
  let urlToIntegrationSettings = `/suitescript/${tile.ssLinkedConnectionId}/integrations/${tile._integrationId}`;

  if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
    urlToIntegrationSettings = `/suitescript/${tile.ssLinkedConnectionId}/integrationapps/${tile.urlName}/${tile._integrationId}/setup`;
  } else if (tile.status === TILE_STATUS.UNINSTALL) {
    urlToIntegrationSettings = `/suitescript/${tile.ssLinkedConnectionId}/integrationapps/${tile.urlName}/${tile._integrationId}/uninstall`;
  } else if (tile._connectorId) {
    urlToIntegrationSettings = `/suitescript/${tile.ssLinkedConnectionId}/integrationapps/${tile.urlName}/${tile._integrationId}/flows`;
  }

  const isNotYetSupported = [].includes(getDomain());
  const handleStatusClick = useCallback(
    event => {
      event.stopPropagation();

      if (isNotYetSupported) {
        setShowNotYetSupportedDialog(true);

        return false;
      }

      if (tile.status === TILE_STATUS.HAS_OFFLINE_CONNECTIONS) {
        // TODO - open connection edit
      } else if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
        history.push(
          getRoutePath(
            `/suitescript/${tile.ssLinkedConnectionId}/integrationapps/${tile.urlName}/${tile._integrationId}/setup`
          )
        );
      } else {
        history.push(
          getRoutePath(
            `/suitescript/${tile.ssLinkedConnectionId}/integrations/${tile._integrationId}/dashboard`
          )
        );
      }
    },
    [
      history,
      tile.urlName,
      isNotYetSupported,
      tile._integrationId,
      tile.ssLinkedConnectionId,
      tile.status,
    ]
  );
  const handleLinkClick = useCallback(
    event => {
      event.stopPropagation();

      if (isNotYetSupported) {
        event.preventDefault();
        setShowNotYetSupportedDialog(true);
      }
    },
    [isNotYetSupported]
  );
  const handleNotYetSupportedDialogCloseClick = useCallback(
    () => setShowNotYetSupportedDialog(false),
    []
  );
  const handleTileClick = useCallback(
    event => {
      event.stopPropagation();

      if (isNotYetSupported) {
        setShowNotYetSupportedDialog(true);
      }
    },
    [isNotYetSupported]
  );
  // IO-13418
  const getApplication = application =>
    application === 'magento' ? 'magento1' : application;
  // #region Drag&Drop related
  const ref = useRef(null);
  // isOver is set to true when hover happens over component
  const [, drop] = useDrop(dropTileConfig(ref, index, onMove));
  const [{ isDragging }, drag] = useDrag(dragTileConfig(index, onDrop));
  // Opacity to blur selected tile
  const opacity = isDragging ? 0.2 : 1;

  drag(drop(ref));

  // #endregion
  return (
    <>
      {showNotYetSupportedDialog && (
        <ModalDialog show onClose={handleNotYetSupportedDialogCloseClick}>
          Not Yet Available
          <Typography>
            This Integration{tile._connectorId && ' App'} is not yet available
            from this UI. To access your Integration
            {tile._connectorId && ' App'}, switch back to the{' '}
            <a href="/">legacy UI</a>.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNotYetSupportedDialogCloseClick}>
            Close
          </Button>
        </ModalDialog>
      )}
      <div style={{ opacity }} ref={ref}>
        <HomePageCardContainer onClick={handleTileClick}>
          <Header>
            <Status
              label={status.label}
              onClick={handleStatusClick}
              className={classes.status}>
              <StatusCircle variant={status.variant} />
            </Status>
          </Header>
          <Content>
            <CardTitle>
              <Typography variant="h3">
                <Link
                  color="inherit"
                  to={getRoutePath(urlToIntegrationSettings)}
                  className={classes.tileName}
                  onClick={handleLinkClick}>
                  {tile.displayName}
                </Link>
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
                        to={getRoutePath(urlToIntegrationSettings)}
                        onClick={handleLinkClick}>
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
                        to={getRoutePath(urlToIntegrationSettings)}
                        onClick={handleLinkClick}>
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
    </>
  );
}

export default withRouter(SuiteScriptTile);

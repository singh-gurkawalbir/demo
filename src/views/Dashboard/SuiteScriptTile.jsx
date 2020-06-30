import React, { useCallback, useState, useRef } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Typography, Tooltip, Button } from '@material-ui/core';
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
import { INTEGRATION_ACCESS_LEVELS, TILE_STATUS } from '../../utils/constants';
import {
  tileStatus,
  suiteScriptTileName,
  dragTileConfig,
  dropTileConfig,
} from './util';
import getRoutePath from '../../utils/routePaths';
import { getIntegrationAppUrlName } from '../../utils/integrationApps';
import ModalDialog from '../../components/ModalDialog';

function SuiteScriptTile({ tile, history, onMove, onDrop, index }) {
  const [showNotYetSupportedDialog, setShowNotYetSupportedDialog] = useState(
    false
  );
  const accessLevel =
    tile.integration &&
    tile.integration.permissions &&
    tile.integration.permissions.accessLevel;
  const integrationAppName = getIntegrationAppUrlName(tile.name, true);
  const status = tileStatus(tile);
  let urlToIntegrationSettings = `/suiteScript/${tile._ioConnectionId}/integrations/${tile._integrationId}/settings`;

  if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
    urlToIntegrationSettings = `/suiteScript/${tile._ioConnectionId}/integrationapps/${integrationAppName}/${tile._integrationId}/setup`;
  } else if (tile.status === TILE_STATUS.UNINSTALL) {
    urlToIntegrationSettings = `/suiteScript/${tile._ioConnectionId}/integrationapps/${integrationAppName}/${tile._integrationId}/uninstall`;
  } else if (tile._connectorId) {
    urlToIntegrationSettings = `/suiteScript/${tile._ioConnectionId}/integrationapps/${integrationAppName}/${tile._integrationId}/settings`;
  }

  const isNotYetSupported = true;
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
            `/suiteScript/${tile._ioConnectionId}/integrationapps/${integrationAppName}/${tile._integrationId}/setup`
          )
        );
      } else {
        history.push(
          getRoutePath(
            `/suiteScript/${tile._ioConnectionId}/integrations/${tile._integrationId}/dashboard`
          )
        );
      }
    },
    [
      history,
      integrationAppName,
      isNotYetSupported,
      tile._integrationId,
      tile._ioConnectionId,
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
          <>Not Yet Available</>
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
            <Status label={status.label} onClick={handleStatusClick}>
              <StatusCircle variant={status.variant} />
            </Status>
          </Header>
          <Content>
            <CardTitle>
              <Typography variant="h3">
                <Link
                  color="inherit"
                  to={getRoutePath(urlToIntegrationSettings)}
                  onClick={handleLinkClick}>
                  {suiteScriptTileName(tile)}
                </Link>
              </Typography>
            </CardTitle>
            {tile.connector &&
              tile.connector.applications &&
              tile.connector.applications.length > 1 && (
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
                        to={getRoutePath(urlToIntegrationSettings)}
                        onClick={handleLinkClick}>
                        <PermissionsManageIcon />
                      </Link>
                    </Tooltip>
                  )}
                </Manage>
              )}
              {tile.tag && <Tag variant={`NS Account #${tile.tag}`} />}
            </FooterActions>
            <Info
              variant={tile._connectorId ? 'Integration app' : 'Legacy'}
              label={tile.connector && tile.connector.owner}
            />
          </Footer>
        </HomePageCardContainer>
      </div>
    </>
  );
}

export default withRouter(SuiteScriptTile);

import React, { useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Truncate from 'react-truncate';
import { Typography, Tooltip, makeStyles, Zoom } from '@material-ui/core';
import { useDrag, useDrop } from 'react-dnd-cjs';
import { selectors } from '../../reducers';
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
import { tileStatus, dragTileConfig, dropTileConfig } from './util';
import getRoutePath from '../../utils/routePaths';
import actions from '../../actions';
import { getIntegrationAppUrlName } from '../../utils/integrationApps';
import { getTemplateUrlName } from '../../utils/template';

const useStyles = makeStyles(theme => ({
  tileName: {
    color: theme.palette.secondary.main,
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

function Tile({ tile, history, onMove, onDrop, index }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isTruncated, setIsTruncated] = useState(false);
  const numFlowsText = `${tile.numFlows} Flow${tile.numFlows === 1 ? '' : 's'}`;
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', tile && tile._integrationId)
  );
  const isCloned = integration?.install?.find(step => step?.isClone);
  const templateName = useSelector(state => {
    if (integration && integration._templateId) {
      const template = selectors.resource(
        state,
        'marketplacetemplates',
        integration._templateId
      );

      return getTemplateUrlName(template && template.applications);
    }

    return null;
  });
  const accessLevel =
    tile.integration &&
    tile.integration.permissions &&
    tile.integration.permissions.accessLevel;
  const status = tileStatus(tile);
  const integrationAppTileName =
    tile._connectorId && tile.name ? getIntegrationAppUrlName(tile.name) : '';
  let urlToIntegrationSettings = templateName
    ? `/templates/${templateName}/${tile._integrationId}`
    : `/integrations/${tile._integrationId}`;
  let urlToIntegrationUsers = templateName
    ? `/templates/${templateName}/${tile._integrationId}/users`
    : `/integrations/${tile._integrationId}/users`;

  if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
    urlToIntegrationSettings = `${isCloned ? '/clone' : ''}/integrationapps/${integrationAppTileName}/${tile._integrationId}/setup`;
    urlToIntegrationUsers = urlToIntegrationSettings;
  } else if (tile.status === TILE_STATUS.UNINSTALL) {
    urlToIntegrationSettings = `/integrationapps/${integrationAppTileName}/${tile._integrationId}/uninstall`;
    urlToIntegrationUsers = urlToIntegrationSettings;
  } else if (tile._connectorId) {
    urlToIntegrationSettings = `/integrationapps/${integrationAppTileName}/${tile._integrationId}`;
    urlToIntegrationUsers = `/integrationapps/${integrationAppTileName}/${tile._integrationId}/users`;
  }

  let app1;
  let app2;

  if (
    tile.connector &&
    tile.connector.applications &&
    tile.connector.applications.length
  ) {
    [app1, app2] = tile.connector.applications;

    if (app1 === 'netsuite') {
      // Make NetSuite always the second application
      [app1, app2] = [app2, app1];
    }
    // Slight hack here. Both Magento1 and magento2 use same applicationId 'magento', but we need to show different images.
    if (tile.name && tile.name.indexOf('Magento 1') !== -1 && app1 === 'magento') {
      app1 = 'magento1';
    }
  }

  const handleStatusClick = useCallback(
    event => {
      event.stopPropagation();

      if (tile.status === TILE_STATUS.HAS_OFFLINE_CONNECTIONS) {
        // https://celigo.atlassian.net/browse/IO-16798. Need to remove fix connection drawer changes.
        if (tile._connectorId) {
          history.push(
            getRoutePath(
              `/integrationapps/${integrationAppTileName}/${tile._integrationId}/connections`
            )
          );
        } else {
          history.push(
            getRoutePath(
              `/integrations/${tile._integrationId}/connections`
            )
          );
        }
      } else if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
        history.push(
          getRoutePath(
            `${isCloned ? '/clone' : ''}/integrationapps/${integrationAppTileName}/${tile._integrationId}/setup`
          )
        );
      } else {
        dispatch(
          actions.patchFilter('jobs', {
            status: status.variant === 'error' ? 'error' : 'all',
          })
        );

        if (tile._connectorId) {
          history.push(
            getRoutePath(
              `/integrationapps/${integrationAppTileName}/${tile._integrationId}/dashboard`
            )
          );
        } else {
          history.push(
            getRoutePath(`/integrations/${tile._integrationId}/dashboard`)
          );
        }
      }
    },
    [
      dispatch,
      history,
      integrationAppTileName,
      status.variant,
      tile._connectorId,
      tile._integrationId,
      tile.status,
      isCloned,
    ]
  );

  // #region Drag&Drop related
  const ref = useRef(null);
  // isOver is set to true when hover happens over component
  const [, drop] = useDrop(dropTileConfig(ref, index, onMove));
  const [{ isDragging }, drag] = useDrag(dragTileConfig(index, onDrop, ref));
  // need to show different style for selected tile
  const isCardSelected = !!isDragging;

  drag(drop(ref));
  // #endregion

  return (
    <div ref={ref}>
      <HomePageCardContainer isCardSelected={isCardSelected}>
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
            <Typography variant="h3" className={classes.tileName}>
              {isTruncated ? (
                <Tooltip
                  title={<span className={classes.tooltipNameFB}> {tile.name}</span>}
                  TransitionComponent={Zoom}
                  placement="top"
                  enterDelay={100}>
                  <Truncate lines={2} ellipsis="..." onTruncate={setIsTruncated}>
                    <Link
                      color="inherit"
                      to={getRoutePath(urlToIntegrationSettings)}
                      className={classes.tileName}>
                      {tile.name}
                    </Link>
                  </Truncate>
                </Tooltip>
              ) : (
                <Truncate lines={2} ellipsis="..." onTruncate={setIsTruncated}>
                  <Link
                    color="inherit"
                    to={getRoutePath(urlToIntegrationSettings)}
                    className={classes.tileName}>
                    {tile.name}
                  </Link>
                </Truncate>
              )}
            </Typography>
          </CardTitle>
          {tile.connector &&
              tile.connector.applications &&
              tile.connector.applications.length > 1 && (
                <ApplicationImages>
                  <ApplicationImg type={app1} />
                  <span>
                    <AddIcon />
                  </span>
                  <ApplicationImg type={app2} />
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
                    to={getRoutePath(urlToIntegrationUsers)}>
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
                    to={getRoutePath(urlToIntegrationUsers)}>
                    <PermissionsManageIcon />
                  </Link>
                </Tooltip>
              )}
            </Manage>
            )}
            {tile.tag && <Tag variant={tile.tag} />}
          </FooterActions>
          <Info
            variant={tile._connectorId ? 'Integration app' : numFlowsText}
            label={tile.connector && tile.connector.owner}
            />
        </Footer>
      </HomePageCardContainer>
    </div>
  );
}

export default withRouter(Tile);

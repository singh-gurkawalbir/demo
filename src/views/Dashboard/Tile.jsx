import { Fragment, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Typography, Tooltip, makeStyles, Button } from '@material-ui/core';
import { useDrag, useDrop } from 'react-dnd-cjs';
import * as selectors from '../../reducers';
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
import { getDomain } from '../../utils/resource';
import ModalDialog from '../../components/ModalDialog';
import { getTemplateUrlName } from '../../utils/template';

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

function Tile({ tile, history, onMove, onDrop, index }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showNotYetSupportedDialog, setShowNotYetSupportedDialog] = useState(
    false
  );
  const numFlowsText = `${tile.numFlows} Flow${tile.numFlows === 1 ? '' : 's'}`;
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', tile && tile._integrationId)
  );
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
    urlToIntegrationSettings = `/integrationapps/${integrationAppTileName}/${tile._integrationId}/setup`;
    urlToIntegrationUsers = urlToIntegrationSettings;
  } else if (tile.status === TILE_STATUS.UNINSTALL) {
    urlToIntegrationSettings = `/integrationapps/${integrationAppTileName}/${tile._integrationId}/uninstall`;
    urlToIntegrationUsers = urlToIntegrationSettings;
  } else if (tile._connectorId) {
    // TODO: InstallSteps check here is temporary. Nees to to change this as part of IA2.o implementation.
    if (
      integration &&
      integration.installSteps &&
      integration.installSteps.length
    ) {
      urlToIntegrationSettings = `/integrations/${integration._id}`;
      urlToIntegrationUsers = `/integrations/${integration._id}/users`;
    } else {
      urlToIntegrationSettings = `/integrationapps/${integrationAppTileName}/${tile._integrationId}`;
      urlToIntegrationUsers = `/integrationapps/${integrationAppTileName}/${tile._integrationId}/users`;
    }
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
  }

  const isNotYetSupported =
    tile._connectorId &&
    getDomain() === 'integrator.io' &&
    ![
      '5c8f30229f701b3e9a0aa817', // SFNSIO
      '56cc2a64a42f08124832753a', // JIRA
      '57a82017810491d30e1c9760', // OpenAir
      '55022fc3285348c76a000005', // Zendesk
      '54fa0b38a7044f9252000036', // Shopify
      '5717912fbc5a8ca446571f1e', // Magento2
      '57179182e0a908200c2781d9', // BigCommerce
      '5db8164d9df868329731fca0', // Square POS
      '58d94e6b2e4b300dbf6b01bc', // eBay
      '5b754a8fddbb3b71d6046c87', // Amazon MCF
      '58c90bccc13f547763bf2fc1', // Amazon
      // '586cb88fc1d53d6a279d527e', // CAM
      '5a546b705556c2539f4a8dba', // Shipwire
      '5bfe38e363afaf4b872b4ee0', // Returnly
      '58859b520b11ee387108165a', // ShipStation
      '58918b104d8fb45c6d440604', // DCL
      '5c0606bc4d7fd970be52991b', // Ramp Logistics - Shopify
      '5833ea9127b52153647f3b7e', // Magento 1.X - NetSuite
      '599cd8f3088905113f495813', // Facebook Catalog Manager - NetSuite
      '5ad75b2f9c7b5a57e9f08247', // Stripe (POS) - NetSuite
      '5b23d976ce9a79398dcd5711', // NetSuite Sales Order Auto-Billing
      '596de15e96a0f67a1a9d2053', // WooCommerce - NetSuite
      '5b2973cda8c36e54ce9a9a7a', // NetSuite Auto-create Customer Deposit
      '598a9a130ce0c234420a6735', // Google Merchant Center - NetSuite
      '5b3dc945449020198fe8597a', // SkuVault - NetSuite
      '5e8d6f912387e356b6769bc5', // Amazon EU
      '5e8d6ca02387e356b6769bb8', // Shopify EU
      '5e7d921e2387e356b67669ce', // SFNSIO EU
    ].includes(tile._connectorId);
  const handleStatusClick = useCallback(
    event => {
      event.stopPropagation();

      if (isNotYetSupported) {
        setShowNotYetSupportedDialog(true);

        return false;
      }

      if (tile.status === TILE_STATUS.HAS_OFFLINE_CONNECTIONS) {
        history.push(
          getRoutePath(
            `/dashboard/${tile._integrationId}/offlineconnections/${
              tile.offlineConnections[0]
            }`
          )
        );
      } else if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
        history.push(
          getRoutePath(
            `/integrationapps/${integrationAppTileName}/${tile._integrationId}/setup`
          )
        );
      } else {
        if (status.variant === 'error') {
          /**
           * TODO Check if there is a better way to set the status filter on the Job Dashboard.
           */
          dispatch(actions.patchFilter('jobs', { status: 'error' }));
        }

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
      isNotYetSupported,
      status.variant,
      tile._connectorId,
      tile._integrationId,
      tile.offlineConnections,
      tile.status,
    ]
  );
  const handleLinkClick = useCallback(
    event => {
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

        return false;
      }

      history.push(getRoutePath(urlToIntegrationSettings));
    },
    [history, isNotYetSupported, urlToIntegrationSettings]
  );
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
    <Fragment>
      {showNotYetSupportedDialog && (
        <ModalDialog show onClose={handleNotYetSupportedDialogCloseClick}>
          <Fragment>Not Yet Available</Fragment>
          <Typography>
            This Integration App is not yet available from this UI. To access
            your Integration App, switch back to the <a href="/">legacy UI</a>.
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
                  {tile.name}
                </Link>
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
                        to={getRoutePath(urlToIntegrationUsers)}
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
                        to={getRoutePath(urlToIntegrationUsers)}
                        onClick={handleLinkClick}>
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
    </Fragment>
  );
}

export default withRouter(Tile);

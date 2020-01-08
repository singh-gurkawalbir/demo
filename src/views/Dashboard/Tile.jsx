import { Fragment, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Typography, Tooltip, makeStyles, Button } from '@material-ui/core';
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
import { tileStatus } from './util';
import getRoutePath from '../../utils/routePaths';
import actions from '../../actions';
import { getIntegrationAppUrlName } from '../../utils/integrationApps';
import { getDomain } from '../../utils/resource';
import ModalDialog from '../../components/ModalDialog';

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

function Tile({ tile, history }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showNotYetSupportedDialog, setShowNotYetSupportedDialog] = useState(
    false
  );
  const numFlowsText = `${tile.numFlows} Flow${tile.numFlows === 1 ? '' : 's'}`;
  const accessLevel =
    tile.integration &&
    tile.integration.permissions &&
    tile.integration.permissions.accessLevel;
  const status = tileStatus(tile);
  const integrationAppTileName =
    tile._connectorId && tile.name ? getIntegrationAppUrlName(tile.name) : '';
  let urlToIntegrationSettings = `/integrations/${tile._integrationId}`;
  let urlToIntegrationUsers = `/integrations/${tile._integrationId}/admin/users`;

  if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
    urlToIntegrationSettings = `/integrationapps/${integrationAppTileName}/${tile._integrationId}/setup`;
    urlToIntegrationUsers = urlToIntegrationSettings;
  } else if (tile.status === TILE_STATUS.UNINSTALL) {
    urlToIntegrationSettings = `/integrationapps/${integrationAppTileName}/${tile._integrationId}/uninstall`;
    urlToIntegrationUsers = urlToIntegrationSettings;
  } else if (tile._connectorId) {
    urlToIntegrationSettings = `/integrationapps/${integrationAppTileName}/${tile._integrationId}`;
    urlToIntegrationUsers = `/integrationapps/${integrationAppTileName}/${tile._integrationId}/admin/users`;
  }

  const isNotYetSupported =
    tile._connectorId &&
    getDomain() === 'integrator.io' &&
    !['54fa0b38a7044f9252000036', '5c8f30229f701b3e9a0aa817'].includes(
      tile._connectorId
    );
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
      <HomePageCardContainer>
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
                <ApplicationImg type={tile.connector.applications[0]} />
                <span>
                  <AddIcon />
                </span>
                <ApplicationImg type={tile.connector.applications[1]} />
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
    </Fragment>
  );
}

export default withRouter(Tile);

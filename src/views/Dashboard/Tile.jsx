import { useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Typography, Tooltip, makeStyles } from '@material-ui/core';
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
  const numFlowsText = `${tile.numFlows} Flow${tile.numFlows === 1 ? '' : 's'}`;
  const accessLevel =
    tile.integration &&
    tile.integration.permissions &&
    tile.integration.permissions.accessLevel;
  const status = tileStatus(tile);
  let urlToIntegrationSettings = `/integrations/${tile._integrationId}`;
  let urlToIntegrationUsers = `/integrations/${tile._integrationId}/admin/users`;

  if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
    urlToIntegrationSettings = `/connectors/${tile._integrationId}/setup`;
    urlToIntegrationUsers = urlToIntegrationSettings;
  } else if (tile.status === TILE_STATUS.UNINSTALL) {
    urlToIntegrationSettings = `/connectors/${tile._integrationId}/uninstall`;
    urlToIntegrationUsers = urlToIntegrationSettings;
  } else if (tile._connectorId) {
    urlToIntegrationSettings = `/integrationApp/${tile._integrationId}`;
    urlToIntegrationUsers = `/integrationApp/${tile._integrationId}/admin/users`;
  }

  function handleStatusClick(event) {
    event.stopPropagation();

    if (tile.status === TILE_STATUS.HAS_OFFLINE_CONNECTIONS) {
      // TODO - open connection edit
    } else if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
      history.push(getRoutePath(`/connectors/${tile._integrationId}/setup`));
    } else {
      if (status.variant === 'error') {
        /**
         * TODO Check if there is a better way to set the status filter on the Job Dashboard.
         */
        dispatch(actions.patchFilter('jobs', { status: 'error' }));
      }

      if (tile._connectorId) {
        history.push(
          getRoutePath(`/integrationApp/${tile._integrationId}/dashboard`)
        );
      } else {
        history.push(
          getRoutePath(`/integrations/${tile._integrationId}/dashboard`)
        );
      }
    }
  }

  return (
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
              className={classes.tileName}>
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
                    to={getRoutePath(urlToIntegrationUsers)}>
                    <PermissionsMonitorIcon />
                  </Link>
                </Tooltip>
              ) : (
                <Tooltip title="You have manage permissions" placement="bottom">
                  <Link
                    color="inherit"
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
  );
}

export default withRouter(Tile);

import { withRouter, Link } from 'react-router-dom';
import { Typography, Tooltip } from '@material-ui/core';
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

function SuiteScriptTile({ tile, history }) {
  const accessLevel =
    tile.integration &&
    tile.integration.permissions &&
    tile.integration.permissions.accessLevel;
  const status = tileStatus(tile);
  let urlToIntegrationSettings = `/suiteScript/${tile._ioConnectionId}/integrations/${tile._integrationId}/settings`;

  if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
    urlToIntegrationSettings = `/suiteScript/${tile._ioConnectionId}/connectors/${tile._integrationId}/setup`;
  } else if (tile.status === TILE_STATUS.UNINSTALL) {
    urlToIntegrationSettings = `/suiteScript/${tile._ioConnectionId}/connectors/${tile._integrationId}/uninstall`;
  } else if (tile._connectorId) {
    urlToIntegrationSettings = `/suiteScript/${tile._ioConnectionId}/connectors/${tile._integrationId}/settings`;
  }

  function handleStatusClick(event) {
    event.stopPropagation();

    if (tile.status === TILE_STATUS.HAS_OFFLINE_CONNECTIONS) {
      // TODO - open connection edit
    } else if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
      history.push(
        getRoutePath(
          `/suiteScript/${tile._ioConnectionId}/connectors/${tile._integrationId}/setup`
        )
      );
    } else {
      history.push(
        getRoutePath(
          `/suiteScript/${tile._ioConnectionId}/integrations/${tile._integrationId}/dashboard`
        )
      );
    }
  }

  return (
    <HomePageCardContainer>
      <Header>
        <Status label={status.label} onClick={handleStatusClick}>
          <StatusCircle variant={status.variant} />
        </Status>
      </Header>
      <Content>
        <CardTitle>
          <Typography variant="h3">
            <Link color="inherit" to={getRoutePath(urlToIntegrationSettings)}>
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
                    to={getRoutePath(urlToIntegrationSettings)}>
                    <PermissionsMonitorIcon />
                  </Link>
                </Tooltip>
              ) : (
                <Tooltip title="You have manage permissions" placement="bottom">
                  <Link
                    color="inherit"
                    to={getRoutePath(urlToIntegrationSettings)}>
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
  );
}

export default withRouter(SuiteScriptTile);

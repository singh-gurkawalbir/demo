import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
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

function Tile({ tile, history }) {
  const dispatch = useDispatch();
  const numFlowsText = `${tile.numFlows} Flow${tile.numFlows === 1 ? '' : 's'}`;
  const accessLevel =
    tile.integration &&
    tile.integration.permissions &&
    tile.integration.permissions.accessLevel;
  const status = tileStatus(tile);
  const integrationAppTileName =
    tile._connectorId && tile.name ? getIntegrationAppUrlName(tile.name) : '';

  function handleClick() {
    if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
      history.push(
        getRoutePath(
          `/integrationapps/${integrationAppTileName}/${tile._integrationId}/setup`
        )
      );
    } else if (tile.status === TILE_STATUS.UNINSTALL) {
      history.push(
        getRoutePath(
          `/integrationapps/${integrationAppTileName}/${tile._integrationId}/uninstall`
        )
      );
    } else if (tile._connectorId) {
      history.push(
        getRoutePath(
          `/integrationapps/${integrationAppTileName}/${tile._integrationId}`
        )
      );
    } else {
      history.push(getRoutePath(`/integrations/${tile._integrationId}`));
    }
  }

  function handleStatusClick(event) {
    event.stopPropagation();

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
  }

  return (
    <HomePageCardContainer onClick={handleClick}>
      <Header>
        <Status label={status.label} onClick={handleStatusClick}>
          <StatusCircle variant={status.variant} />
        </Status>
      </Header>
      <Content>
        <CardTitle>
          <Typography variant="h3">{tile.name}</Typography>
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
                <PermissionsMonitorIcon />
              ) : (
                <PermissionsManageIcon />
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

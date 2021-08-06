
import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Typography, Tooltip, makeStyles, IconButton } from '@material-ui/core';
import { selectors } from '../../reducers';
import HomePageCardContainer from '../../components/HomePageCard/HomePageCardContainer';
import Header from '../../components/HomePageCard/Header';
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
import { INTEGRATION_ACCESS_LEVELS, TILE_STATUS } from '../../utils/constants';
import { tileStatus, isTileStatusConnectionDown } from './util';
import getRoutePath from '../../utils/routePaths';
import actions from '../../actions';
import { getIntegrationAppUrlName, isIntegrationAppVerion2 } from '../../utils/integrationApps';
import { getTemplateUrlName } from '../../utils/template';
import TileNotification from '../../components/HomePageCard/TileNotification';
import { useSelectorMemo } from '../../hooks';
import CeligoTruncate from '../../components/CeligoTruncate';
import ActionButton from '../../components/ActionButton';
import Status from '../../components/Buttons/Status';

const useStyles = makeStyles(theme => ({
  tileName: {
    color: theme.palette.secondary.main,
    wordBreak: 'break-word',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  action: {
    marginLeft: 0,
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
  connectionDownRedDot: {
    width: theme.spacing(1),
    height: theme.spacing(1),
    position: 'absolute',
    right: theme.spacing(-0.5),
    top: 0,
  },
  tagExpire: {
    bottom: 90,
    position: 'absolute',
  },
  noAppImages: {
    display: 'none',
  },
  headerTileStatus: {
    paddingLeft: 0,
    '& > * .MuiButton-startIcon': {
      margin: 0,
    },
  },
}));

function AppLogosContainer({ tile }) {
  const applications = useSelectorMemo(selectors.mkTileApplications, tile);

  if (applications.length < 2) {
    return null;
  }

  return (
    <ApplicationImages noOfApps={applications.length}>
      {
        applications
          .map(app => (<div key={app}><ApplicationImg type={app} /></div>))
          .reduce((acc, x) => acc === null ? x : (
            <>
              {acc}
              <span>
                <AddIcon />
              </span>
              {x}
            </>
          ), null)
      }
    </ApplicationImages>
  );
}

function Tile({
  tile,
  history,
  isDragInProgress,
  isTileDragged,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const numFlowsText = `${tile.numFlows} Flow${tile.numFlows === 1 ? '' : 's'}`;
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', tile && tile._integrationId)
  );
  const isCloned = integration?.install?.find(step => step?.isClone);
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const supportsMultiStore = integration?.settings?.supportsMultiStore;
  const {licenseMessageContent, expired, trialExpired, showTrialLicenseMessage, resumable, licenseId} = useSelector(state =>
    selectors.tileLicenseDetails(state, tile), shallowEqual
  );
  const isIntegrationV2 = isIntegrationAppVerion2(integration, true);

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
  const isConnectionDown = isTileStatusConnectionDown(tile);
  const integrationAppTileName =
    tile._connectorId && tile.name ? getIntegrationAppUrlName(tile.name) : '';
  let urlToIntegrationSettings = templateName
    ? `/templates/${templateName}/${tile._integrationId}`
    : `/integrations/${tile._integrationId}`;
  let urlToIntegrationUsers = templateName
    ? `/templates/${templateName}/${tile._integrationId}/users`
    : `/integrations/${tile._integrationId}/users`;

  if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
    if (tile._connectorId) {
      urlToIntegrationSettings = `${isCloned ? '/clone' : ''}/integrationapps/${integrationAppTileName}/${tile._integrationId}/setup`;
    } else {
      urlToIntegrationSettings = `integrations/${tile._integrationId}/setup`;
    }
    urlToIntegrationUsers = urlToIntegrationSettings;
  } else if (tile.status === TILE_STATUS.UNINSTALL) {
    urlToIntegrationSettings = `/integrationapps/${integrationAppTileName}/${tile._integrationId}/uninstall`;
    urlToIntegrationUsers = urlToIntegrationSettings;
  } else if (tile._connectorId) {
    urlToIntegrationSettings = `/integrationapps/${integrationAppTileName}/${tile._integrationId}`;
    urlToIntegrationUsers = `/integrationapps/${integrationAppTileName}/${tile._integrationId}/users`;
  }
  const handleConnectionDownStatusClick = useCallback(event => {
    event.stopPropagation();
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
  }, [history, integrationAppTileName, tile._connectorId, tile._integrationId]);

  const handleStatusClick = useCallback(
    event => {
      event.stopPropagation();
      if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
        if (tile._connectorId) {
          history.push(
            getRoutePath(
              `${isCloned ? '/clone' : ''}/integrationapps/${integrationAppTileName}/${tile._integrationId}/setup`
            )
          );
        } else {
          history.push(
            getRoutePath(
              `/integrations/${tile._integrationId}/setup`
            )
          );
        }
      } else if (isUserInErrMgtTwoDotZero) {
        history.push(getRoutePath(urlToIntegrationSettings));
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
    [tile.status, tile._connectorId, tile._integrationId, isUserInErrMgtTwoDotZero, history, isCloned, integrationAppTileName, dispatch, status.variant, urlToIntegrationSettings]
  );

  const handleUsersClick = useCallback(event => {
    event.stopPropagation();
    history.push(getRoutePath(urlToIntegrationUsers));
  }, [history, urlToIntegrationUsers]);

  const handleTileClick = useCallback(
    event => {
      event.stopPropagation();

      history.push(getRoutePath(urlToIntegrationSettings));
    },
    [history, urlToIntegrationSettings]
  );

  return (
    <div>
      <HomePageCardContainer isDragInProgress={isDragInProgress} isTileDragged={isTileDragged}>
        <Header>
          <Status
            variant={status.variant}
            size="large"
            onClick={handleStatusClick}
            className={classes.headerTileStatus}>
            {status.label}
          </Status>
          {isConnectionDown && (
          <Tooltip data-public title="Connection down" placement="bottom" className={classes.tooltip}>
            <IconButton
              size="small"
              color="inherit"
              onClick={handleConnectionDownStatusClick}
              className={classes.status}>
              <span>
                <StatusCircle
                  size="small"
                  className={classes.connectionDownRedDot}
                  variant="error" />
              </span>
              <ConnectionDownIcon />
            </IconButton>
          </Tooltip>
          )}
        </Header>
        <Content>
          <CardTitle>
            <Typography
              variant="h3"
              className={classes.tileName}
              onClick={handleTileClick}>
              <CeligoTruncate
                dataPublic
                delay={100}
                lines={2}
                placement="bottom">
                {tile.name}
              </CeligoTruncate>
            </Typography>
          </CardTitle>

          {!(expired && tile.tag) ? <AppLogosContainer tile={tile} /> : ''}

        </Content>
        <Footer>
          <FooterActions>
            {accessLevel && (
            <Manage>
              {accessLevel === INTEGRATION_ACCESS_LEVELS.MONITOR ? (
                <ActionButton
                  tooltip="You have monitor permissions"
                  data-public
                  onClick={handleUsersClick}>
                  <PermissionsMonitorIcon />
                </ActionButton>
              ) : (
                <ActionButton
                  placement="bottom"
                  data-public
                  tooltip="You have manage permissions"
                  className={classes.action}
                  onClick={handleUsersClick}>
                  <PermissionsManageIcon />
                </ActionButton>
              )}
            </Manage>
            )}
            {expired && tile.tag && (<Tag label={tile.tag} className={classes.tagExpire} />)}
            {!expired && tile.tag && (<Tag label={tile.tag} />)}
          </FooterActions>
          <Info
            variant={tile._connectorId ? 'Integration app' : numFlowsText}
            label={tile.connector && tile.connector.owner}
            />
        </Footer>{
          tile._connectorId && licenseMessageContent && (
          <TileNotification
            content={licenseMessageContent} showTrialLicenseMessage={showTrialLicenseMessage} expired={expired} connectorId={tile._connectorId}
            trialExpired={trialExpired}
            licenseId={licenseId}
            supportsMultiStore={supportsMultiStore}
            tileStatus={tile.status}
            isIntegrationV2={isIntegrationV2} integrationId={tile._integrationId}
            integrationAppTileName={integrationAppTileName} resumable={resumable} accessLevel={accessLevel} />
          )
        }
      </HomePageCardContainer>
    </div>
  );
}
export default withRouter(Tile);

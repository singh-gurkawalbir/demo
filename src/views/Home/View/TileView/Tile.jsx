import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../reducers';
import HomePageCardContainer from '../../../../components/HomePageCard/HomePageCardContainer';
import Header from '../../../../components/HomePageCard/Header';
import Content from '../../../../components/HomePageCard/Content';
import ApplicationImg from '../../../../components/icons/ApplicationImg';
import AddIcon from '../../../../components/icons/AddIcon';
import ApplicationImages from '../../../../components/HomePageCard/Content/ApplicationImages';
import CardTitle from '../../../../components/HomePageCard/Content/CardTitle';
import Footer from '../../../../components/HomePageCard/Footer';
import FooterActions from '../../../../components/HomePageCard/Footer/FooterActions';
import Info from '../../../../components/HomePageCard/Footer/Info';
import IntegrationTag from '../../../../components/tags/IntegrationTag';
import Manage from '../../../../components/HomePageCard/Footer/Manage';
import PermissionsManageIcon from '../../../../components/icons/PermissionsManageIcon';
import PermissionsMonitorIcon from '../../../../components/icons/PermissionsMonitorIcon';
import { INTEGRATION_ACCESS_LEVELS, TILE_STATUS } from '../../../../constants';
import { tileStatus, isTileStatusConnectionDown } from '../../../../utils/home';
import getRoutePath from '../../../../utils/routePaths';
import actions from '../../../../actions';
import TileNotification from '../../../../components/HomePageCard/TileNotification';
import { useSelectorMemo } from '../../../../hooks';
import CeligoTruncate from '../../../../components/CeligoTruncate';
import ActionButton from '../../../../components/ActionButton';
import Status from '../../../../components/Buttons/Status';
import TileActions from './TileActions';
import ActionGroup from '../../../../components/ActionGroup';
import IconButtonWithTooltip from '../../../../components/IconButtonWithTooltip';
import { getTextAfterCount } from '../../../../utils/string';
import OfflineConnectionsIcon from '../../../../components/icons/OfflineConnectionsIcon';

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
  tagWithLicenseMessage: {
    bottom: 90,
    position: 'absolute',
  },
  headerTileStatus: {
    fontSize: 13,
    paddingLeft: 0,
    '& > .MuiButton-startIcon': {
      margin: 0,
    },
  },
  actionGroupWrapper: {
    '&:last-child': {
      marginRight: theme.spacing(-1),
    },
  },
  connectionIcon: {
    '&:hover': {
      backgroundColor: theme.palette.background.paper2,
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
  const numFlowsText = getTextAfterCount('Flow', tile.numFlows);
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const {licenseMessageContent, expired, trialExpired, showTrialLicenseMessage, resumable, licenseId} = useSelector(state =>
    selectors.tileLicenseDetails(state, tile), shallowEqual
  );

  const {
    urlToIntegrationSettings,
    urlToIntegrationUsers,
    urlToIntegrationConnections,
    urlToIntegrationStatus,
  } = useSelectorMemo(selectors.mkHomeTileRedirectUrl, tile);

  const accessLevel = tile.integration?.permissions?.accessLevel;
  const status = tileStatus(tile);
  const isConnectionDown = isTileStatusConnectionDown(tile);

  const handleConnectionDownStatusClick = useCallback(event => {
    event.stopPropagation();
    history.push(urlToIntegrationConnections);
  }, [history, urlToIntegrationConnections]);

  const handleStatusClick = useCallback(
    event => {
      event.stopPropagation();
      if (tile.status === TILE_STATUS.IS_PENDING_SETUP || isUserInErrMgtTwoDotZero) {
        history.push(urlToIntegrationStatus);
      } else {
        dispatch(
          actions.patchFilter('jobs', {
            status: status.variant === 'error' ? 'error' : 'all',
          })
        );

        history.push(urlToIntegrationStatus);
      }
    },
    [dispatch, history, isUserInErrMgtTwoDotZero, status.variant, tile.status, urlToIntegrationStatus]
  );

  const handleUsersClick = useCallback(event => {
    event.stopPropagation();
    history.push(getRoutePath(urlToIntegrationUsers));
  }, [history, urlToIntegrationUsers]);

  const handleTileClick = useCallback(
    event => {
      event.stopPropagation();
      if (tile._connectorId && tile.supportsChild) {
        dispatch(actions.resource.integrations.isTileClick(tile?._integrationId, true));
      }

      history.push(getRoutePath(urlToIntegrationSettings));
    },
    [history, urlToIntegrationSettings, dispatch, tile?._integrationId, tile._connectorId, tile.supportsChild]
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
          <ActionGroup className={classes.actionGroupWrapper}>
            {isConnectionDown && (
            <IconButtonWithTooltip
              className={classes.connectionIcon}
              onClick={handleConnectionDownStatusClick}
              tooltipProps={{title: 'Connection down', placement: 'bottom'}}
              buttonSize={{size: 'small'}}>
              <OfflineConnectionsIcon />
            </IconButtonWithTooltip>
            )}
            <TileActions tile={tile} />
          </ActionGroup>
        </Header>
        <Content>
          <CardTitle>
            <Typography
              variant="h3"
              className={classes.tileName}
              onClick={handleTileClick}>
              <CeligoTruncate
                isLoggable
                delay={100}
                lines={2}
                placement="bottom">
                {tile.name}
              </CeligoTruncate>
            </Typography>
          </CardTitle>

          {!(licenseMessageContent && tile.tag) ? <AppLogosContainer tile={tile} /> : ''}

        </Content>
        <Footer>
          <FooterActions>
            {accessLevel && (
            <Manage>
              {accessLevel === INTEGRATION_ACCESS_LEVELS.MONITOR ? (
                <ActionButton
                  tooltip="You have monitor permissions"
                  onClick={handleUsersClick}>
                  <PermissionsMonitorIcon />
                </ActionButton>
              ) : (
                <ActionButton
                  placement="bottom"
                  tooltip="You have manage permissions"
                  className={classes.action}
                  onClick={handleUsersClick}>
                  <PermissionsManageIcon />
                </ActionButton>
              )}
            </Manage>
            )}
            {licenseMessageContent && tile.tag && (<IntegrationTag label={tile.tag} className={classes.tagWithLicenseMessage} />)}
            {!licenseMessageContent && tile.tag && (<IntegrationTag label={tile.tag} />)}
          </FooterActions>
          <Info
            variant={tile._connectorId ? 'Integration app' : numFlowsText}
            label={tile.connector && tile.connector.owner}
            />
        </Footer>{
          tile._connectorId && licenseMessageContent && (
          <TileNotification
            content={licenseMessageContent}
            showTrialLicenseMessage={showTrialLicenseMessage}
            expired={expired}
            connectorId={tile._connectorId}
            trialExpired={trialExpired}
            licenseId={licenseId}
            tileStatus={tile.status}
            isIntegrationV2={tile.iaV2}
            integrationId={tile._integrationId}
            mode={tile.mode}
            name={tile.name}
            _connectorId={tile._connectorId}
            supportsMultiStore={tile.supportsMultiStore}
            resumable={resumable}
            accessLevel={accessLevel}
          />
          )
        }
      </HomePageCardContainer>
    </div>
  );
}
export default withRouter(Tile);

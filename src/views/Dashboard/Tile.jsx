import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Typography, Tooltip, makeStyles, Button, IconButton } from '@material-ui/core';
import { useDrag, useDrop } from 'react-dnd-cjs';
import moment from 'moment';
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
import ConnectionDownIcon from '../../components/icons/unLinkedIcon';
import { INTEGRATION_ACCESS_LEVELS, TILE_STATUS, USER_ACCESS_LEVELS } from '../../utils/constants';
import { tileStatus, isTileStatusConnectionDown, dragTileConfig, dropTileConfig } from './util';
import getRoutePath from '../../utils/routePaths';
import actions from '../../actions';
import { getIntegrationAppUrlName, isIntegrationAppVerion2 } from '../../utils/integrationApps';
import { getTemplateUrlName } from '../../utils/template';
import TileNotification from '../../components/HomePageCard/TileNotification';
import { useSelectorMemo } from '../../hooks';
import CeligoTruncate from '../../components/CeligoTruncate';

const useStyles = makeStyles(theme => ({
  tileName: {
    color: theme.palette.secondary.main,
    wordBreak: 'break-word',
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

function Tile({ tile, history, onMove, onDrop, index }) {
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
  const remainingDays = date =>
    Math.ceil((moment(date) - moment()) / 1000 / 60 / 60 / 24);
  const licenses = useSelector(state =>
    selectors.licenses(state)
  );

  const license = tile._connectorId && tile._integrationId && licenses.find(l => l._integrationId === tile._integrationId);
  const expiresInDays = license && remainingDays(license.expires);
  let licenseMessageContent = '';
  let expired = false;
  const resumable = license?.resumable && [INTEGRATION_ACCESS_LEVELS.OWNER, USER_ACCESS_LEVELS.ACCOUNT_ADMIN].includes(accessLevel);

  if (resumable) {
    licenseMessageContent = `Your subscription was renewed on ${moment(license.expires).format('MMM Do, YYYY')}. Click Reactivate to continue.`;
  } else if (expiresInDays <= 0) {
    expired = true;
    licenseMessageContent = `Your license expired on ${moment(license.expires).format('MMM Do, YYYY')}. Contact sales to renew your license.`;
  } else if (expiresInDays > 0 && expiresInDays <= 30) {
    licenseMessageContent = `Your license will expire in ${expiresInDays} day${expiresInDays === 1 ? '' : 's'}. Contact sales to renew your license.`;
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
      if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
        event.stopPropagation();
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
      } else if (!isUserInErrMgtTwoDotZero) {
        event.stopPropagation();
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
    [tile.status, tile._connectorId, tile._integrationId, isUserInErrMgtTwoDotZero, history, isCloned, integrationAppTileName, dispatch, status.variant]
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

  // #region Drag&Drop related
  const ref = useRef(null);
  // isOver is set to true when hover happens over component
  const [, drop] = useDrop(dropTileConfig(ref, index, onMove));
  const [{ isDragging }, drag, preview] = useDrag(dragTileConfig(index, onDrop, ref));
  // need to show different style for selected tile
  const isCardSelected = !!isDragging;

  drop(preview(ref));
  // #endregion

  return (
    <div ref={ref}>
      <HomePageCardContainer onClick={handleTileClick} drag={drag} isCardSelected={isCardSelected} >
        <Header>
          <Status
            label={status.label}
            onClick={handleStatusClick}
            className={classes.status}>
            <StatusCircle variant={status.variant} />
          </Status>
          {isConnectionDown && (
          <Tooltip data-public title="Connection down" placement="bottom" className={classes.tooltip}>
            <IconButton size="small" color="inherit" onClick={handleConnectionDownStatusClick} className={classes.status}>
              <span><StatusCircle size="small" className={classes.connectionDownRedDot} variant="error" /></span><ConnectionDownIcon />
            </IconButton>
          </Tooltip>
          )}
        </Header>
        <Content>
          <CardTitle>
            <Typography variant="h3" className={classes.tileName}>
              <div onClick={handleTileClick}>
                <CeligoTruncate dataPublic delay={100} lines={2} placement="bottom">
                  {tile.name}
                </CeligoTruncate>
              </div>
            </Typography>
          </CardTitle>

          {!(expired && tile.tag) ? <AppLogosContainer tile={tile} /> : ''}

        </Content>
        <Footer>
          <FooterActions>
            {accessLevel && (
            <Manage>
              {accessLevel === INTEGRATION_ACCESS_LEVELS.MONITOR ? (
                <Tooltip
                  data-public
                  title="You have monitor permissions"
                  placement="bottom">
                  <Button
                    color="inherit"
                    className={classes.action}
                    onClick={handleUsersClick}>
                    <PermissionsMonitorIcon />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip
                  data-public
                  title="You have manage permissions"
                  placement="bottom">
                  <Button
                    color="inherit"
                    className={classes.action}
                    onClick={handleUsersClick}>
                    <PermissionsManageIcon />
                  </Button>
                </Tooltip>
              )}
            </Manage>
            )}
            {expired && tile.tag && (<Tag variant={tile.tag} className={classes.tagExpire} />)}
            {!expired && tile.tag && (<Tag variant={tile.tag} />)}
          </FooterActions>
          <Info
            variant={tile._connectorId ? 'Integration app' : numFlowsText}
            label={tile.connector && tile.connector.owner}
            />
        </Footer>{
          tile._connectorId && licenseMessageContent && (
          <TileNotification
            content={licenseMessageContent} expired={expired} connectorId={tile._connectorId}
            licenseId={license._id}
            isIntegrationV2={isIntegrationV2} integrationId={tile._integrationId}
            integrationAppTileName={integrationAppTileName} resumable={resumable} accessLevel={accessLevel} />
          )
        }
      </HomePageCardContainer>
    </div>
  );
}
export default withRouter(Tile);

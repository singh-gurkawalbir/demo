import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import InfoIconButton from '../../../../InfoIconButton';
import { selectors } from '../../../../../reducers';
import IntegrationTag from '../../../../tags/IntegrationTag';
import Tag from '../../../../tags/Tag';
import { INTEGRATION_ACCESS_LEVELS } from '../../../../../constants';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import IntegrationPinnedIcon from '../../../../icons/IntegrationPinnedIcon';
import actions from '../../../../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    maxWidth: 360,
    wordWrap: 'break-word',
    flexDirection: 'column',
  },
  nameCellDescription: {
    display: 'flex',
  },
  nameCellLink: {
    marginRight: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  nameCellTags: {
    marginTop: theme.spacing(1),
  },
  nameCellIntegrationTag: {
    marginRight: theme.spacing(3),
  },
  nameCellInfoIcon: {
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: 0,
  },
}));

export default function NameCell({ tile }) {
  const {name,
    description,
    tag,
    ssLinkedConnectionId,
    pinned} = tile;
  const dispatch = useDispatch();
  const classes = useStyles();
  const {urlToIntegrationSettings} = useSelectorMemo(selectors.mkHomeTileRedirectUrl, tile);

  const ssAccessLevel = useSelector(state => selectors.userAccessLevelOnConnection(state, ssLinkedConnectionId));

  const ssAccountName = useSelector(state => {
    const ssLinkedConnection = selectors.resource(state, 'connections', ssLinkedConnectionId);

    return ssLinkedConnection?.netsuite?.account;
  });

  const integrationTag = tag || (ssAccountName && `NS Account #${ssAccountName}`) || '';
  const accessLevel = ssLinkedConnectionId ? ssAccessLevel
    : tile.integration?.permissions?.accessLevel;
  const handleClick = () => {
    if (tile._connectorId && tile.supportsChild) {
      dispatch(actions.resource.integrations.isTileClick(tile?._integrationId, true));
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.nameCellDescription}>
        {pinned && <IntegrationPinnedIcon />}
        <Link to={urlToIntegrationSettings} className={classes.nameCellLink} onClick={handleClick}>{name}</Link>
        <InfoIconButton
          info={description}
          escapeUnsecuredDomains
          size="xs"
          className={classes.nameCellInfoIcon}
          title={name}
        />
      </div>
      {(integrationTag || accessLevel) && (
      <div className={clsx(classes.nameCellDescription, classes.nameCellTags)}>
        {integrationTag && <IntegrationTag label={integrationTag} className={classes.nameCellIntegrationTag} />}
        {accessLevel === INTEGRATION_ACCESS_LEVELS.MONITOR && <Tag label="Monitor only" /> }
      </div>
      )}
    </div>
  );
}

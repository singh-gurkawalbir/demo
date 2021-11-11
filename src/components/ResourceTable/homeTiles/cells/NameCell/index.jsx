import React from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import InfoIconButton from '../../../../InfoIconButton';
import { selectors } from '../../../../../reducers';
import IntegrationTag from '../../../../tags/IntegrationTag';
import Tag from '../../../../tags/Tag';
import { INTEGRATION_ACCESS_LEVELS } from '../../../../../utils/constants';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import IntegrationPinnedIcon from '../../../../icons/IntegrationPinnedIcon';

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
  const { name,
    description,
    tag,
    ssLinkedConnectionId,
    pinned} = tile;
  const classes = useStyles();
  const {urlToIntegrationSettings} = useSelectorMemo(selectors.homeTileRedirectUrl, tile);

  const ssAccessLevel = useSelector(state => selectors.userAccessLevelOnConnection(state, ssLinkedConnectionId));

  const ssAccountName = useSelector(state => {
    const ssLinkedConnection = selectors.resource(state, 'connections', ssLinkedConnectionId);

    return ssLinkedConnection?.netsuite?.account;
  });

  const integrationTag = tag || (ssAccountName && `NS Account #${ssAccountName}`) || '';
  const accessLevel = ssLinkedConnectionId ? ssAccessLevel
    : tile.integration?.permissions?.accessLevel;

  return (
    <div className={classes.root}>
      {pinned && <IntegrationPinnedIcon />}
      <div className={classes.nameCellDescription}>
        <Link to={urlToIntegrationSettings} className={classes.nameCellLink}>{name}</Link>
        <InfoIconButton info={description} escapeUnsecuredDomains size="xs" className={classes.nameCellInfoIcon} />
      </div>
      <div className={clsx(classes.nameCellDescription, classes.nameCellTags)}>
        {integrationTag && <IntegrationTag label={integrationTag} className={classes.nameCellIntegrationTag} />}
        {accessLevel === INTEGRATION_ACCESS_LEVELS.MONITOR && <Tag label="Monitor only" /> }
      </div>
    </div>
  );
}

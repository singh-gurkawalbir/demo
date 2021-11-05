import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import InfoIconButton from '../../../../InfoIconButton';
import { selectors } from '../../../../../reducers';
import IntegrationTag from '../../../../tags/IntegrationTag';
import Tag from '../../../../tags/Tag';
import { INTEGRATION_ACCESS_LEVELS } from '../../../../../utils/constants';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';

// todo: ashu css
const useStyles = makeStyles({
  root: {
    display: 'flex',
    maxWidth: 360,
    wordWrap: 'break-word',
  },
  tags: {
    display: 'inherit',
  },
});

export default function NameCell({ tile }) {
  const { name,
    description,
    tag,
    ssLinkedConnectionId} = tile;
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
      <Link to={urlToIntegrationSettings}>{name}</Link>

      <InfoIconButton info={description} escapeUnsecuredDomains size="xs" />
      <div className={classes.tags}>
        {integrationTag && <IntegrationTag label={integrationTag} />}
        {accessLevel === INTEGRATION_ACCESS_LEVELS.MONITOR && <Tag label="Monitor only" /> }
      </div>
    </div>
  );
}

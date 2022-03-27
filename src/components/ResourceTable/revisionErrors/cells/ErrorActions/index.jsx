import { IconButton } from '@material-ui/core';
import React from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import ActionsIcon from '../../../../icons/ListViewIcon';
import { DRAWER_URL_PREFIX } from '../../../../../utils/drawerURLs';

export default function ErrorActions({ errorId }) {
  const match = useRouteMatch();
  const history = useHistory();
  const handleErrorAction = () => {
    history.push(`${match.url}/${DRAWER_URL_PREFIX}/error/${errorId}`);
  };

  return <IconButton onClick={handleErrorAction}><ActionsIcon /></IconButton>;
}

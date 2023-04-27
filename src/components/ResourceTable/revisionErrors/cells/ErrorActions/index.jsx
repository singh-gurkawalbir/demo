import { IconButton } from '@mui/material';
import React from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import ActionsIcon from '../../../../icons/ListViewIcon';
import { drawerPaths, buildDrawerUrl } from '../../../../../utils/rightDrawer';

export default function ErrorActions({ errorId }) {
  const match = useRouteMatch();
  const history = useHistory();
  const handleErrorAction = () => {
    history.push(buildDrawerUrl({
      path: drawerPaths.LCM.VIEW_REVISION_ERROR_INFO,
      baseUrl: match.url,
      params: { errorId },
    }));
  };

  return <IconButton data-test="error-actions" onClick={handleErrorAction} size="large"><ActionsIcon /></IconButton>;
}

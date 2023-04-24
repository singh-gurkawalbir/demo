import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useRouteMatch, useHistory } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { selectors } from '../../../../../../reducers';
import ResourceDrawer from '../../../../../../components/drawer/Resource';
import PanelHeader from '../../../../../../components/PanelHeader';
import ResourceTable from '../../../../../../components/ResourceTable';
import LoadResources from '../../../../../../components/LoadResources';
import AddIcon from '../../../../../../components/icons/AddIcon';
import { generateNewId } from '../../../../../../utils/resource';
import actions from '../../../../../../actions';
import { TextButton } from '../../../../../../components/Buttons';
import { drawerPaths, buildDrawerUrl } from '../../../../../../utils/rightDrawer';

export default function ApiTokenSection({ integrationId }) {
  const location = useLocation();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();
  const list = useSelector(state =>
    selectors.accessTokenList(state, { integrationId })
  );
  const { _connectorId } = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );

  return (
    <>
      <ResourceDrawer match={match} />

      <PanelHeader title="API tokens">
        <TextButton
          data-test="newAccessToken"
          onClick={() => {
            const newId = generateNewId();

            history.push(buildDrawerUrl({
              path: drawerPaths.RESOURCE.ADD,
              baseUrl: location.pathname,
              params: { resourceType: 'accesstokens', id: newId },
            }));

            const patchSet = [
              {
                op: 'add',
                path: '/_integrationId',
                value: integrationId,
              },
              {
                op: 'add',
                path: '/_connectorId',
                value: _connectorId,
              },
            ];

            dispatch(actions.resource.patchStaged(newId, patchSet));
          }}
          startIcon={<AddIcon />}>
          Create API token
        </TextButton>
      </PanelHeader>

      <Box sx={{ padding: theme => theme.spacing(3, 3, 12, 3) }}>
        <LoadResources required resources="accesstokens">
          {list.resources && list.resources.length === 0 ? (
            <ResourceTable
              resourceType="accesstokens"
              resources={list.resources}
            />
          ) : (
            <Typography
              sx={{
                margin: theme => theme.spacing(-3, 0, 0, -3),
                paddingLeft: theme => theme.spacing(2),
              }}>
              No API tokens yet exist for this integration.
            </Typography>
          )}
        </LoadResources>
      </Box>
    </>
  );
}

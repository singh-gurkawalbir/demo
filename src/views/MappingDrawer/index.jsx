import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../reducers';
import LoadResources from '../../components/LoadResources';
import Mapping from '../../components/Mapping';
import SelectImport from './SelectImport';
import RightDrawer from '../../components/drawer/Right';

// const useStyles = makeStyles(theme => ({
//   drawerPaper: {
//     marginTop: theme.appBarHeight,
//     width: 824,
//     border: 'solid 1px',
//     borderColor: theme.palette.secondary.lightest,
//     boxShadow: '-4px 4px 8px rgba(0,0,0,0.15)',
//     zIndex: theme.zIndex.drawer + 1,
//   },
//   content: {
//     padding: theme.spacing(2, 3),
//     display: 'flex',
//   },

//   // TODO:check for better way to handle width when drawer open and closes
//   fullWidthDrawerClose: {
//     width: 'calc(100% - 60px)',
//   },
//   fullWidthDrawerOpen: {
//     width: `calc(100% - ${theme.drawerWidth}px)`,
//   },
// }));

const MappingWrapper = ({integrationId}) => {
  console.log('asdfg');
  const history = useHistory();
  const match = useRouteMatch();
  const { flowId, importId, subRecordMappingId } = match.params;

  const isMonitorLevelUser = useSelector(state => {
    if (integrationId) {
      return selectors.isFormAMonitorLevelAccess(state, integrationId);
    }

    // TODO for DIV flows
    return true;
  });

  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Mapping
      onClose={handleClose}
      flowId={flowId}
      resourceId={importId}
      subRecordMappingId={subRecordMappingId}
      disabled={isMonitorLevelUser}
    />

  );
};
export default function MappingDrawerRoute(props) {
  const match = useRouteMatch();

  console.log('match.url', match.url);

  return (
    <RightDrawer
      path={[
        'mapping/flows/:flowId/imports/:importId/subrecord/:subRecordMappingId/view',
        'mapping/flows/:flowId/imports/:importId/view',
        'mapping/flows/:flowId/imports/:importId',
        'mapping/flows/:flowId',
      ]}
      height="tall"
      width="default"
      title="Edit Mapping"
      variant="temporary"
      >
      <LoadResources
        required="true"
        resources="imports, exports, connections">
        <Switch>
          <Route
            path={[
              `${match.url}/mapping/flows/:flowId/imports/:importId/subrecord/:subRecordMappingId/view`,
              `${match.url}/mapping/flows/:flowId/imports/:importId/view`,
            ]} >
            <MappingWrapper {...props} />
          </Route>
          <Route
            exact
            path={
              [
                `${match.url}/mapping/flows/:flowId`,
                `${match.url}/mapping/flows/:flowId/imports/:importId`,
              ]
            }
            >
            <SelectImport />
          </Route>
        </Switch>
      </LoadResources>

    </RightDrawer>
  );
}

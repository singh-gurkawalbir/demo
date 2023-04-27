import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import ScriptLogs from '.';
import { selectors } from '../../reducers';
import RightDrawer from '../../components/drawer/Right';
import DrawerHeader from '../../components/drawer/Right/DrawerHeader';
import LoadResources from '../../components/LoadResources';
import actions from '../../actions';
import { drawerPaths } from '../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  scriptLogsDrawerHeader: {
    background: theme.palette.background.paper,
  },
}));
const ScriptLogsWrapper = () => {
  const match = useRouteMatch();
  const dispatch = useDispatch();

  const { scriptId } = match.params;

  useEffect(() =>
    () => {
      if (scriptId) {
        dispatch(actions.logs.scripts.clear({scriptId}));
      }
    }, [dispatch, scriptId]);

  return (
    <ScriptLogs
      scriptId={scriptId}
      />
  );
};
const ScriptLogsDrawerHeader = () => {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const { scriptId } = match.params;
  const scriptName = useSelector(state => {
    const script = selectors.resource(state, 'scripts', scriptId);

    return script?.name || '';
  });

  const handleClose = useCallback(
    () => {
      history.goBack();
    },
    [history],
  );

  return (
    <DrawerHeader
      className={classes.scriptLogsDrawerHeader}
      hideBackButton="true"
      title={`Execution log: ${scriptName}`}
      onClose={handleClose}
      />
  );
};
export default function ScriptLogsDrawerRoute() {
  return (
    <RightDrawer path={drawerPaths.LOGS.SCRIPT} width="full" >
      <LoadResources
        required="true"
        resources="connections,imports,exports,scripts">
        <>
          <ScriptLogsDrawerHeader />
          <ScriptLogsWrapper />
        </>
      </LoadResources>
    </RightDrawer>
  );
}

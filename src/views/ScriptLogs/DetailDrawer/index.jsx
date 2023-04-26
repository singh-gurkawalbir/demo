import React, { useEffect, useCallback } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import DrawerHeader from '../../../components/drawer/Right/DrawerHeader';
import { selectors } from '../../../reducers';
import DrawerContent from '../../../components/drawer/Right/DrawerContent';
import RightDrawer from '../../../components/drawer/Right';
import CeligoTimeAgo from '../../../components/CeligoTimeAgo';
import { drawerPaths } from '../../../utils/rightDrawer';

const emptyObj = {};
const useStyles = makeStyles(theme => ({
  wrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    '& > div': {
      marginBottom: theme.spacing(2),
    },
  },
  messageContainer: {
    height: '-webkit-fill-available',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(3),
    overflow: 'hidden',
    '& > div': {
      overflowY: 'auto',
      wordBreak: 'break-word',
    },
  },
}));

const ScriptLogDetailDrawerHeader = () => {
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
      title={`View execution log details: ${scriptName}`}
      onClose={handleClose}
    />
  );
};

const ScriptLogDrawerBody = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const classes = useStyles();
  const { scriptId, flowId, index } = match.params;
  const {time, logLevel, message, functionType} = useSelector(state => {
    const script = selectors.scriptLog(state, {scriptId, flowId});

    try {
      const _index = parseInt(index, 10);

      return script?.logs[_index] || emptyObj;
    } catch {
      // do nothing
    }

    return emptyObj;
  }, shallowEqual);

  useEffect(() => {
    if (!time) {
      history.goBack();
    }
  }, [history, time]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <div>
          Timestamp: <CeligoTimeAgo date={time} />
        </div>
        <div>
          Type: {logLevel}
        </div>
        <div>
          Function type: {functionType}
        </div>
      </div>
      <div className={classes.messageContainer}>
        Message:
        <div>
          {message}
        </div>
      </div>
    </div>
  );
};
export default function ViewLogDetailDrawer() {
  return (
    <RightDrawer path={[drawerPaths.LOGS.FLOW_SCRIPT_DETAIL, drawerPaths.LOGS.SCRIPT_DETAIL]}>
      <ScriptLogDetailDrawerHeader />
      <DrawerContent>
        <ScriptLogDrawerBody />
      </DrawerContent>
    </RightDrawer>
  );
}

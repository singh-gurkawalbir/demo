import React, { useEffect, useCallback } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import RightDrawer from '../../../../../components/drawer/Right';
import DrawerContent from '../../../../../components/drawer/Right/DrawerContent';
import DrawerHeader from '../../../../../components/drawer/Right/DrawerHeader';

const emptyObj = {};
const useStyles = makeStyles(theme => ({
  title: {
    display: 'flex',
    fontSize: 14,
    padding: theme.spacing(4, 0, 6, 0),
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
    justifyContent: 'center',
    color: theme.palette.secondary.main,
  },
  wrapper: {
    '& > div': {
      marginBottom: theme.spacing(2),
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
  const {time, logLevel, message} = useSelector(state => {
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
      <div>
        Timestamp: {time}
      </div>
      <div>
        Type: {logLevel}
      </div>
      <div>
        Message:
        <br />
        {message}
      </div>
    </div>
  );
};
export default function ViewLogDetailDrawer() {
  return (
    <RightDrawer
      variant="temporary"
      path={[
        'scriptLog/:scriptId/:flowId/:index',
        'scriptLog/:scriptId/:index',
      ]}
      >
      <ScriptLogDetailDrawerHeader />
      <DrawerContent>
        <ScriptLogDrawerBody />
      </DrawerContent>
    </RightDrawer>
  );
}

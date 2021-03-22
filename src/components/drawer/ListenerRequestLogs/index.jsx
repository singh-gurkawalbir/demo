import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RightDrawer from '../Right';
import DrawerHeader from '../Right/DrawerHeader';
import DrawerContent from '../Right/DrawerContent';
import DrawerFooter from '../Right/DrawerFooter';
import DrawerSubHeader from '../Right/DrawerSubHeader';
import ActionGroup from '../../ActionGroup';
import LogsDrawerActions from './LogsDrawerActions';
import LogsTable from './LogsTable';
import Help from '../../Help';
import ApplicationImg from '../../icons/ApplicationImg';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import { FILTER_KEY } from '../../../utils/listenerLogs';

const useStyles = makeStyles(theme => ({
  helpTextButton: {
    padding: 0,
  },
  appLogo: {
    paddingRight: theme.spacing(2),
    borderRight: `1px solid ${theme.palette.secondary.lightest}`,
  },
}));

function RouterWrappedContent({ flowId, exportId, handleClose }) {
  const classes = useStyles();
  const applicationType = useSelector(state => selectors.applicationType(state, 'exports', exportId));

  return (
    <>
      <DrawerHeader title="View listener debug logs" hideBackButton >
        <ActionGroup>
          <Help
            title="Debug logs"
            className={classes.helpTextButton}
            helpKey="listener.debugLogs" />
        </ActionGroup>
        <ActionGroup position="right">
          <ApplicationImg
            className={classes.appLogo}
            size="small"
            type={applicationType}
            alt={applicationType || 'Application image'}
            />
        </ActionGroup>
      </DrawerHeader>

      <DrawerSubHeader>
        <LogsDrawerActions flowId={flowId} exportId={exportId} />
      </DrawerSubHeader>

      <DrawerContent noPadding >
        <LogsTable flowId={flowId} exportId={exportId} />
      </DrawerContent>

      <DrawerFooter>
        <ActionGroup>
          <Button
            color="primary"
            variant="outlined"
            data-test="closeLogs"
            onClick={handleClose}>
            Close
          </Button>
        </ActionGroup>
      </DrawerFooter>
    </>
  );
}

export default function ListenerRequestLogs({ flowId, exportId }) {
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(actions.logs.listener.clear(exportId));
    dispatch(actions.clearFilter(FILTER_KEY));
    if (history.length > 2) {
      history.goBack();
    } else {
      history.replace(match.url);
    }
  }, [dispatch, exportId, history, match.url]);

  return (
    <RightDrawer
      path="logs"
      variant="permanent"
      height="tall"
      width="full"
      onClose={handleClose} >
      <RouterWrappedContent flowId={flowId} exportId={exportId} handleClose={handleClose} />
    </RightDrawer>
  );
}

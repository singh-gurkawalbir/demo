import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
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
import { OutlinedButton } from '../../Buttons';

const useStyles = makeStyles(theme => ({
  helpTextButton: {
    padding: 0,
  },
  appLogo: {
    paddingRight: theme.spacing(2),
    borderRight: `1px solid ${theme.palette.secondary.lightest}`,
  },
  titleHeader: {
    '& > h4': {
      marginRight: `${theme.spacing(-0.5)}px !important`,
    },
  },
}));

function RouterWrappedContent({ flowId, resourceType, resourceId, handleClose }) {
  const classes = useStyles();
  const applicationType = useSelector(state => selectors.applicationType(state, resourceType, resourceId));

  return (
    <>
      <DrawerHeader title="View listener debug logs" hideBackButton className={classes.titleHeader} >
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
        <LogsDrawerActions flowId={flowId} resourceId={resourceId} resourceType={resourceType} />
      </DrawerSubHeader>

      <DrawerContent noPadding >
        <LogsTable flowId={flowId} resourceId={resourceId} resourceType={resourceType} />
      </DrawerContent>

      <DrawerFooter>
        <ActionGroup>
          <OutlinedButton
            data-test="closeLogs"
            onClick={handleClose}>
            Close
          </OutlinedButton>
        </ActionGroup>
      </DrawerFooter>
    </>
  );
}

export default function ListenerRequestLogs({ flowId, resourceType, resourceId }) {
  const history = useHistory();
  const match = useRouteMatch();

  const handleClose = useCallback(() => {
    if (history.length > 2) {
      history.goBack();
    } else {
      history.replace(match.url);
    }
  }, [history, match.url]);

  return (
    <RightDrawer
      path="logs"
      variant="permanent"
      height="tall"
      width="full"
      onClose={handleClose} >
      <RouterWrappedContent flowId={flowId} resourceType={resourceType} resourceId={resourceId} handleClose={handleClose} />
    </RightDrawer>
  );
}

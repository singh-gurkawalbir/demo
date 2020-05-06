import { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import DrawerTitleBar from '../../../components/drawer/TitleBar';
import ErrorDetails from '../ErrorDetails';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight + theme.pageBarHeight,
    width: 1300,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export default function ErrorDetailsDrawer({
  flowId,
  resourceId,
  errorId,
  mode = 'view',
  onClose,
}) {
  const classes = useStyles();
  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  return (
    <Drawer
      anchor="right"
      open
      classes={{
        paper: classes.drawerPaper,
        width: classes.xl,
      }}>
      <DrawerTitleBar onClose={onClose} title="Error Record" />
      <ErrorDetails
        flowId={flowId}
        errorId={errorId}
        resourceId={resourceId}
        onClose={handleClose}
        mode={mode}
      />
    </Drawer>
  );
}

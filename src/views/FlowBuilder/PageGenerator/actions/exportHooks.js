import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Icon from '../../../../components/icons/HookIcon';
import actions from '../../../../actions';
import DrawerTitleBar from '../../../../components/drawer/TitleBar';
import Hooks from '../../../../components/Hooks';
import helpTextMap from '../../../../components/Help/helpTextMap';
import {
  getSelectedHooksPatchSet,
  getDefaultValuesForHooks,
} from '../../../../utils/hooks';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 600,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    backgroundColor: theme.palette.background.white,
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    borderTop: `solid 1px ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(0, 0, 0, 3),
    width: '100%',
    display: 'flex',
  },
}));

function ExportHooks({ flowId, isViewMode, resource, onClose, open }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const resourceId = resource._id;
  const resourceType = 'exports';
  const defaultValue = getDefaultValuesForHooks(resource);
  const handleSave = useCallback(
    selectedHooks => {
      const patchSet = getSelectedHooksPatchSet(selectedHooks, resource);

      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged(resourceType, resourceId, 'value')
      );
      onClose();
    },
    [dispatch, onClose, resource, resourceId]
  );
  const handleDrawerClose = useCallback(() => onClose(false), [onClose]);

  return (
    <Drawer
      anchor="right"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}>
      <DrawerTitleBar onClose={handleDrawerClose} title="Hooks" />
      <div className={classes.content}>
        <Hooks
          onSave={handleSave}
          onCancel={onClose}
          disabled={isViewMode}
          defaultValue={defaultValue}
          flowId={flowId}
          resourceId={resourceId}
          resourceType={resourceType}
        />
      </div>
    </Drawer>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'exportHooks',
  position: 'right',
  Icon,
  helpText: helpTextMap['fb.pg.exports.hooks'],
  Component: ExportHooks,
};

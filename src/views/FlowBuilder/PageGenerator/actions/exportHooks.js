import { useCallback, Fragment } from 'react';
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
    backgroundColor: theme.palette.background.paper2,
    zIndex: theme.zIndex.drawer + 1,
  },
}));

function HooksDialog({ flowId, isViewMode, resource, onClose }) {
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
  const handleDrawerClose = () => onClose(false);

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      classes={{
        paper: classes.drawerPaper,
      }}
      open>
      <DrawerTitleBar onClose={handleDrawerClose} title="Hooks" />
      <Hooks
        onSave={handleSave}
        onCancel={onClose}
        disabled={isViewMode}
        defaultValue={defaultValue}
        flowId={flowId}
        resourceId={resourceId}
        resourceType={resourceType}
      />
    </Drawer>
  );
}

function ExportHooks(props) {
  const { open } = props;

  return <Fragment>{open && <HooksDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'exportHooks',
  position: 'right',
  Icon,
  helpText: helpTextMap['fb.pg.exports.hooks'],
  Component: ExportHooks,
};

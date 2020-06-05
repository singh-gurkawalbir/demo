import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Icon from '../../../../components/icons/HookIcon';
import actions from '../../../../actions';
import Hooks from '../../../../components/Hooks';
import DrawerTitleBar from '../../../../components/drawer/TitleBar';
import {
  getSelectedHooksPatchSet,
  getDefaultValuesForHooks,
} from '../../../../utils/hooks';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    paddingBottom: theme.appBarHeight,
    width: 600,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: '-4px 4px 8px rgba(0,0,0,0.15)',
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    padding: theme.spacing(0, 3, 0, 2),
    width: '100%',
    display: 'flex',
  },
}));

function PageProcessorHooks({
  flowId,
  resource,
  resourceType,
  isViewMode,
  onClose,
  open,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const resourceId = resource._id;
  const defaultValue = useMemo(() => getDefaultValuesForHooks(resource), [
    resource,
  ]);
  const handleSave = useCallback(
    selectedHooks => {
      const patchSet = getSelectedHooksPatchSet(selectedHooks, resource);

      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged(resourceType, resourceId, 'value')
      );
      onClose();
    },
    [dispatch, onClose, resource, resourceId, resourceType]
  );
  const handleDrawerClose = useCallback(() => onClose(false), [onClose]);

  return (
    <Drawer
      anchor="right"
      classes={{
        paper: classes.drawerPaper,
      }}
      open={open}>
      <DrawerTitleBar
        onClose={handleDrawerClose}
        title="Hooks"
        helpKey="export.hooks"
        helpTitle="Hooks"
      />
      <div className={classes.content}>
        <Hooks
          onSave={handleSave}
          disabled={isViewMode}
          onCancel={onClose}
          defaultValue={defaultValue}
          resourceType={resourceType}
          resourceId={resourceId}
          flowId={flowId}
        />
      </div>
    </Drawer>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'pageProcessorHooks',
  position: 'middle',
  Icon,
  Component: PageProcessorHooks,
};

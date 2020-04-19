import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Drawer } from '@material-ui/core';
import LoadResources from '../LoadResources';
import * as selectors from '../../reducers';
import AddOrSelect from './AddOrSelect';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../constants/resource';
import DrawerTitleBar from '../drawer/TitleBar';
import ResourceFormWithStatusPanel from '../ResourceFormWithStatusPanel';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 660,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export default function ResourceSetupDrawer(props) {
  const {
    resourceId,
    onSubmitComplete,
    onClose,
    addOrSelect,
    connectionType,
    resourceType = 'connections',
  } = props;
  const classes = useStyles();
  const isAuthorized = useSelector(state =>
    selectors.isAuthorized(state, resourceId)
  );

  useEffect(() => {
    if (isAuthorized && !addOrSelect)
      onSubmitComplete(resourceId, isAuthorized);
  }, [isAuthorized, resourceId, onSubmitComplete, addOrSelect]);

  const title = useMemo(
    () => `Setup ${RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]}`,
    [resourceType]
  );

  return (
    <LoadResources required resources={resourceType}>
      <Drawer
        anchor="right"
        open
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={onClose}>
        <DrawerTitleBar title={title} />
        <div>
          {addOrSelect ? (
            <AddOrSelect {...props} />
          ) : (
            <ResourceFormWithStatusPanel
              editMode={false}
              resourceType={resourceType}
              resourceId={resourceId}
              cancelButtonLabel="Cancel"
              onSubmitComplete={onSubmitComplete}
              connectionType={connectionType}
              onCancel={onClose}
            />
          )}
        </div>
      </Drawer>
    </LoadResources>
  );
}

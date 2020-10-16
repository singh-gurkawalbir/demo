import React, { useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Drawer } from '@material-ui/core';
import LoadResources from '../LoadResources';
import { selectors } from '../../reducers';
import AddOrSelect from './AddOrSelect';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../constants/resource';
import DrawerTitleBar from '../drawer/TitleBar';
import ResourceFormWithStatusPanel from '../ResourceFormWithStatusPanel';
import ResourceFormActionsPanel from '../drawer/Resource/Panel/ResourceFormActionsPanel';
import { generateNewId } from '../../utils/resource';
import ResourceDrawer from '../drawer/Resource';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: 660,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: '-4px 4px 8px rgba(0,0,0,0.15)',
    zIndex: theme.zIndex.drawer + 1,
  },
  resourceFormWrapper: {
    padding: theme.spacing(3),
    borderColor: 'rgb(0,0,0,0.1)',
    borderStyle: 'solid',
    borderWidth: '1px 0 0 0',
  },
}));

export default function ResourceSetupDrawer(props) {
  const {
    resourceId,
    onSubmitComplete,
    onClose,
    addOrSelect,
    resourceType = 'connections',
  } = props;
  const classes = useStyles();
  const isAuthorized = useSelector(state =>
    selectors.isAuthorized(state, resourceId)
  );

  useEffect(() => {
    if (isAuthorized && !addOrSelect) onSubmitComplete(resourceId, isAuthorized);
  }, [isAuthorized, resourceId, onSubmitComplete, addOrSelect]);

  const title = `Setup ${RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]}`;

  const [newId] = useState(generateNewId());

  return (
    <LoadResources required resources={resourceType}>
      <Drawer
        anchor="right"
        open
        classes={{
          paper: classes.drawerPaper,
        }}
        >
        <DrawerTitleBar title={title} onClose={onClose} />
        <ResourceDrawer />

        <div>
          {addOrSelect ? (
            <AddOrSelect {...props} />
          ) : (
            <>
              <ResourceFormWithStatusPanel
                occupyFullWidth
                formKey={newId}
                className={classes.resourceFormWrapper}
                resourceType={resourceType}
                resourceId={resourceId}
                onSubmitComplete={onSubmitComplete}
            />
              <ResourceFormActionsPanel
                formKey={newId}
                resourceType={resourceType}
                resourceId={resourceId}
                cancelButtonLabel="Cancel"
                submitButtonLabel="Save & close"
                onCancel={onClose}
              />
            </>
          )}
        </div>
      </Drawer>
    </LoadResources>
  );
}

import React from 'react';
import { Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import LoadResources from '../../../components/LoadResources';
import ResourceForm from '../../../components/ResourceFormFactory';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: 450,
    padding: theme.spacing(3),
  },
  panelContainer: {
    display: 'flex',
  },
}));

export default function ResourceDrawer(props) {
  const classes = useStyles();
  const { match, history } = props;
  const { id, resourceType, operation } = (match || {}).params || {};
  const isNew = operation === 'add';
  const open = !!match;
  const closeDrawer = () => {
    history.goBack();
  };

  // console.log(`resource drawer rendered`, match);
  const Hello = () => (
    // console.log('boom');

    <div>Hello World</div>
  );

  return (
    <Drawer
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
      onClose={closeDrawer}>
      <div className={classes.panelContainer}>
        {open && (
          <div>
            <LoadResources required resources={resourceType}>
              <ResourceForm
                key={`${isNew}-${id}`}
                isNew={isNew}
                resourceType={resourceType}
                resourceId={id}
                submitButtonLabel="Save"
                onSubmitComplete={() => {}}
                cancelButtonLabel="Back"
                onCancel={closeDrawer}
              />
              <Route
                path={`${match.url}/edit/:resourceType/:id`}
                component={Hello}
              />
            </LoadResources>
          </div>
        )}
      </div>
    </Drawer>
  );
}

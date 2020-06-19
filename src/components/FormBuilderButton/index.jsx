import React, { useCallback, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles, Button } from '@material-ui/core';
import * as selectors from '../../reducers';
import FieldHelp from '../DynaForm/FieldHelp';
import EditDrawer from '../AFE/SettingsFormEditor/Drawer';

const emptyObj = {};

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(-0.75),
  },
}));

export default function FormBuilderButton({resourceId, resourceType, integrationId}) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const [drawerKey, setDrawerKey] = useState(0);
  const settingsForm = useSelector(state => {
    const resource = selectors.resource(state, resourceType, resourceId);

    return (resource && resource.settingsForm) || emptyObj;
  });
  const allowFormEdit = useSelector(state =>
    selectors.canEditSettingsForm(state, resourceType, resourceId, integrationId)
  );

  const toggleEditMode = useCallback(
    e => {
      e.stopPropagation();
      setDrawerKey(drawerKey => drawerKey + 1);
      history.push(`${match.url}/editSettings`);
    },
    [history, match.url]
  );

  if (!allowFormEdit) return null;

  return (
    <div>
      <Button
        className={classes.button}
        data-test="form-editor-action"
        variant="text"
        onClick={toggleEditMode}>
        Launch form builder
      </Button>
      <FieldHelp
        id="settingsForm"
        helpKey="settingsForm"
        label="Settings form builder"
        noApi
      />
      <EditDrawer
        key={drawerKey}
        editorId={`settings-${resourceId}`}
        resourceId={resourceId}
        resourceType={resourceType}
        settingsForm={settingsForm}
        // eslint-disable-next-line react/jsx-handler-names
        onClose={history.goBack}
        />
    </div>
  );
}

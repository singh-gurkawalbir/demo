import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles, Button } from '@material-ui/core';
import { selectors } from '../../reducers';
import FieldHelp from '../DynaForm/FieldHelp';
import EditDrawer from '../AFE/SettingsFormEditor/Drawer';
import usePushRightDrawer from '../../hooks/usePushRightDrawer';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(-0.75),
    color: theme.palette.secondary.main,
    fontFamily: 'Roboto400',
  },
}));

export default function FormBuilderButton({resourceId, resourceType, integrationId, sectionId}) {
  const classes = useStyles();
  const history = useHistory();
  const handleOpenDrawer = usePushRightDrawer();
  const [drawerKey, setDrawerKey] = useState(0);

  const settingsForm = useSelectorMemo(selectors.mkGetCustomFormPerSectionId, resourceType, resourceId, sectionId || 'general')?.settingsForm;

  const allowFormEdit = useSelector(state =>
    selectors.canEditSettingsForm(state, resourceType, resourceId, integrationId)
  );

  const toggleEditMode = useCallback(
    e => {
      e.stopPropagation();
      setDrawerKey(drawerKey => drawerKey + 1);
      handleOpenDrawer('editSettings');
    },
    [handleOpenDrawer]
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
        sectionId={sectionId}
        // eslint-disable-next-line react/jsx-handler-names
        onClose={history.goBack}
        />
    </div>
  );
}

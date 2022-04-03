import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Button } from '@material-ui/core';
import actions from '../../actions';
import { selectors } from '../../reducers';
import FieldHelp from '../DynaForm/FieldHelp';
import { buildDrawerUrl, drawerPaths } from '../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(-0.75),
    color: theme.palette.secondary.main,
    fontFamily: 'Roboto400',
  },
}));
export const getSettingsEditorId = (resourceId, sectionId) => `settings-${resourceId}-${sectionId || 'general'}`;
export default function FormBuilderButton({resourceId, resourceType, integrationId, sectionId}) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const customSettingsEditorId = getSettingsEditorId(resourceId, sectionId);
  const allowFormEdit = useSelector(state =>
    selectors.canEditSettingsForm(state, resourceType, resourceId, integrationId)
  );

  const toggleEditMode = useCallback(
    e => {
      e.stopPropagation();
      dispatch(
        actions.editor.init(customSettingsEditorId, 'settingsForm', {
          integrationId,
          resourceId,
          resourceType,
          sectionId,
        })
      );
      history.push(buildDrawerUrl({
        path: drawerPaths.EDITOR,
        baseUrl: match.url,
        params: { editorId: customSettingsEditorId },
      }));
    },
    [dispatch, customSettingsEditorId, history, match.url, resourceId, resourceType, sectionId, integrationId]
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
    </div>
  );
}

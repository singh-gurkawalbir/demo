import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import actions from '../../actions';
import { selectors } from '../../reducers';
import FieldHelp from '../DynaForm/FieldHelp';
import useResourceSettingsContext from '../../hooks/useResourceSettingsContext';
import { buildDrawerUrl, drawerPaths } from '../../utils/rightDrawer';
import TextButton from '../Buttons/TextButton';

const useStyles = makeStyles({
  button: {
    padding: 0,

  },
  launchFormBuilderBtnWrapper: {
    display: 'flex',
    minWidth: 165,
    cursor: 'pointer',
  },
});
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
  const settingsContext = useResourceSettingsContext(resourceType, resourceId, integrationId);

  const toggleEditMode = useCallback(
    e => {
      e.stopPropagation();
      dispatch(
        actions.editor.init(customSettingsEditorId, 'settingsForm', {
          integrationId,
          resourceId,
          resourceType,
          sectionId,
          settingsContext,
        })
      );
      history.push(buildDrawerUrl({
        path: drawerPaths.EDITOR,
        baseUrl: match.url,
        params: { editorId: customSettingsEditorId },
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, customSettingsEditorId, history, match.url, resourceId, resourceType, sectionId, integrationId]
  );

  if (!allowFormEdit) return null;

  return (
    <div className={classes.launchFormBuilderBtnWrapper}>
      <TextButton
        color="secondary"
        className={classes.button}
        data-test="form-editor-action"
        variant="text"
        onClick={toggleEditMode}>
        Launch form builder
      </TextButton>
      <FieldHelp
        id="settingsForm"
        helpKey="settingsForm"
        label="Settings form builder"
        noApi
      />
    </div>
  );
}

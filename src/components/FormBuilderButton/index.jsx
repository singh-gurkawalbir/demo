import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Button } from '@material-ui/core';
import actions from '../../actions';
import { selectors } from '../../reducers';
import FieldHelp from '../DynaForm/FieldHelp';

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
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const editorId = `settings-${resourceId}-${sectionId || 'general'}`;

  const allowFormEdit = useSelector(state =>
    selectors.canEditSettingsForm(state, resourceType, resourceId, integrationId)
  );

  const toggleEditMode = useCallback(
    e => {
      e.stopPropagation();
      dispatch(
        actions.editor.init(editorId, 'settingsForm', {
          integrationId,
          resourceId,
          resourceType,
          sectionId,
        })
      );
      history.push(`${match.url}/editor/${editorId}`);
    },
    [dispatch, editorId, history, match.url, resourceId, resourceType, sectionId, integrationId]
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

import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles, Button } from '@material-ui/core';
import FieldHelp from '../DynaForm/FieldHelp';

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(-0.75),
  },
}));
export default function FormBuilderButton({onClick}) {
  const history = useHistory();
  const match = useRouteMatch();
  const classes = useStyles();

  const toggleEditMode = useCallback(
    e => {
      e.stopPropagation();
      if (typeof onClick === 'function') {
        onClick();
      }
      history.push(`${match.url}/editSettings`);
    },
    [onClick, history, match.url]
  );

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

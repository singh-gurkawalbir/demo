import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaCheckbox from '../../../../DynaForm/fields/checkbox/DynaCheckbox';
import ButtonGroup from '../../../../ButtonGroup';
import OutlinedButton from '../../../../Buttons/OutlinedButton';

const useStyles = makeStyles(theme => ({
  previewButtonGroup: {
    '& > :not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
}));

export default function PreviewButtonGroup({ editorId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const autoEvaluate = useSelector(state => selectors.editor(state, editorId).autoEvaluate);
  const saveInProgress = useSelector(state => {
    const {saveStatus} = selectors.editor(state, editorId);

    return saveStatus === 'requested';
  });

  const handlePreview = () => dispatch(actions.editor.previewRequest(editorId));
  const handleToggle = () => dispatch(actions.editor.toggleAutoPreview(editorId));

  return (
    <ButtonGroup className={classes.previewButtonGroup}>
      <DynaCheckbox
        id="disableAutoPreview"
        onFieldChange={handleToggle}
        disabled={saveInProgress}
        label="Auto preview"
        value={autoEvaluate} />
      {!autoEvaluate && (
        <OutlinedButton
          data-test="previewEditorResult"
          disabled={saveInProgress}
          onClick={handlePreview}>
          Preview
        </OutlinedButton>
      )}
    </ButtonGroup>
  );
}

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { selectors } from '../../../reducers';
import { makeStyles, Button, Divider } from '@material-ui/core';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import DynaCheckbox from '../../DynaForm/fields/checkbox/DynaCheckbox';
import ButtonGroup from '../../ButtonGroup';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(0.5, 1, 0),
    height: 24,
    width: 1,
  },
}));

export default function PreviewButtonGroup({ editorId }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  // eslint-disable-next-line no-unused-vars
  const autoEvaluate = useSelector(state => selectors._editor(state, editorId).autoEvaluate);

  const handlePreview = () => dispatch(actions._editor.previewRequest(editorId));
  const handleToggle = () => dispatch(actions._editor.toggleAutoPreview(editorId));

  return (
    <ButtonGroup>
      {!autoEvaluate && (
      <>
        <Button
          data-test="previewEditorResult"
          variant="outlined"
          color="secondary"
          onClick={handlePreview}>
          Preview
        </Button>
        <Divider orientation="vertical" className={classes.divider} />
      </>
      )}
      <DynaCheckbox
        hideLabelSpacing
        id="disableAutoPreview"
        onFieldChange={handleToggle}
        label="Auto preview"
        value={autoEvaluate} />
    </ButtonGroup>
  );
}

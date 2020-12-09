import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../../actions';
import TextToggle from '../../../TextToggle';
import Help from '../../../Help';
import { selectors } from '../../../../reducers';

const useStyles = makeStyles({
  helpTextButton: {
    padding: 0,
  },
});
const toggleEditorOptions = [
  { label: 'AFE 1.0', value: 1 },
  { label: 'AFE 2.0', value: 2 },
];

export default function ToggleAFEButton({ editorId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isEditorV2Supported = useSelector(state => selectors._editor(state, editorId).isEditorV2Supported);
  const editorVersion = useSelector(state => selectors._editorDataVersion(state, editorId));

  const handleVersionToggle = useCallback(
    newVersion => {
      dispatch(actions._editor.toggleVersion(editorId, newVersion));
    },
    [dispatch, editorId]
  );

  // TODO: should state be cleared on editor close?
  //   const handleCloseEditor = useCallback(
  //     () => {
  //       dispatch(actions._editor.clear(editorId));
  //       if (onClose) {
  //         onClose();
  //       }
  //     },
  //     [dispatch, id, onClose]
  //   );
  if (!isEditorV2Supported) return null;

  return (
    <>
      <TextToggle
       // disabled={disabled}
        value={editorVersion}
        onChange={handleVersionToggle}
        exclusive
        options={toggleEditorOptions}
      />
      <Help
        title="AFE"
        className={classes.helpTextButton}
        helpKey="afe.sampleDataSwitch"
      />
    </>
  );
}

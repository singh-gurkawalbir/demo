import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import EditorDrawer from '../EditorDrawer';
import actions from '../../../actions';
import TextToggle from '../../TextToggle';
import Help from '../../Help';
import { selectors } from '../../../reducers';

const useStyles = makeStyles({
  helpTextButton: {
    padding: 0,
  },
});
const toggleEditorOptions = [
  { label: 'AFE 1.0', value: 1 },
  { label: 'AFE 2.0', value: 2 },
];
const EditorToggleAction = ({ disabled, editorVersion, onVersionToggle }) => {
  const classes = useStyles();

  return (
    <>
      <TextToggle
        disabled={disabled}
        value={editorVersion}
        onChange={onVersionToggle}
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
};

export default function AFE2EditorDrawer({
  showVersionToggle,
  onVersionToggle,
  editorVersion,
  onClose,
  ...props
}) {
  const { id, disabled } = props;
  const dispatch = useDispatch();
  const {
    v1template,
    v2template,
  } = useSelector(state => selectors.editor(state, id));
  const handleVersionToggle = useCallback(
    newVersion => {
      if (newVersion === 2) {
        dispatch(actions.editor.patch(id, { template: v2template || '' }));
      } else {
        dispatch(actions.editor.patch(id, { template: v1template || '' }));
      }
      onVersionToggle(newVersion);
    },
    [dispatch, id, onVersionToggle, v1template, v2template]
  );
  const handleCloseEditor = useCallback(
    () => {
      dispatch(actions.editor.patch(id, { template: '', v1template: '', v2template: '' }));
      if (onClose) {
        onClose();
      }
    },
    [dispatch, id, onClose]
  );
  const editorToggleAction = useMemo(() => {
    if (showVersionToggle) {
      return (
        <EditorToggleAction
          editorVersion={editorVersion}
          disabled={disabled}
          onVersionToggle={handleVersionToggle}
        />
      );
    }
  }, [editorVersion, handleVersionToggle, disabled, showVersionToggle]);

  return <EditorDrawer toggleAction={editorToggleAction} onClose={handleCloseEditor} {...props} />;
}

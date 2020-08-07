import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import EditorDrawer from '../EditorDrawer';
import actions from '../../../actions';
import TextToggle from '../../TextToggle';
import Help from '../../Help';

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
  ...props
}) {
  const { id, disabled } = props;
  const dispatch = useDispatch();
  const handleVersionToggle = useCallback(
    newVersion => {
      dispatch(actions.editor.patch(id, { template: '' }));
      onVersionToggle(newVersion);
    },
    [dispatch, id, onVersionToggle]
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

  return <EditorDrawer toggleAction={editorToggleAction} {...props} />;
}

import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import EditorDrawer from '../EditorDrawer/new';
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

export default function _AFE2EditorDrawer_(props) {
  const {
    onVersionToggle,
    editorVersion,
    onClose,
    id,
    disabled,
  } = props;
  const dispatch = useDispatch();
  const { isEditorV2Supported } = useSelector(state => selectors._editor(state, id));

  const handleVersionToggle = useCallback(
    newVersion => {
      dispatch(actions._editor.toggleVersion(id, newVersion));
      if (onVersionToggle) {
        onVersionToggle(newVersion);
      }
    },
    [dispatch, id, onVersionToggle]
  );

  const handleCloseEditor = useCallback(
    () => {
      dispatch(actions._editor.clear(id));
      if (onClose) {
        onClose();
      }
    },
    [dispatch, id, onClose]
  );

  const editorToggleAction = useMemo(() => {
    if (isEditorV2Supported) {
      return (
        <EditorToggleAction
          editorVersion={editorVersion}
          disabled={disabled}
          onVersionToggle={handleVersionToggle}
        />
      );
    }
  }, [editorVersion, handleVersionToggle, disabled, isEditorV2Supported]);

  return <EditorDrawer toggleAction={editorToggleAction} onClose={handleCloseEditor} {...props} />;
}

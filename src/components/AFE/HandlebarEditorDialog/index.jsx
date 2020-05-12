import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import EditorDialog from '../EditorDialog';
import actions from '../../../actions';
import TextToggle from '../../TextToggle';

const useStyles = makeStyles(theme => ({
  editorToggleContainer: {
    marginRight: theme.spacing(2),
  },
}));
const toggleEditorOptions = [
  { label: 'AFE 1.0', value: 1 },
  { label: 'AFE 2.0', value: 2 },
];
const EditorToggleAction = ({ disabled, editorVersion, onVersionToggle }) => {
  const classes = useStyles();

  return (
    <div className={classes.editorToggleContainer}>
      <TextToggle
        disabled={disabled}
        value={editorVersion}
        onChange={onVersionToggle}
        exclusive
        options={toggleEditorOptions}
      />
    </div>
  );
};

export default function HanldebarEditorDialog({
  showVersionToggle,
  onVersionToggle,
  editorVersion,
  ...props
}) {
  const { id } = props;
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
          disabled={props.disabled}
          onVersionToggle={handleVersionToggle}
        />
      );
    }
  }, [editorVersion, handleVersionToggle, props.disabled, showVersionToggle]);

  return <EditorDialog toggleAction={editorToggleAction} {...props} />;
}

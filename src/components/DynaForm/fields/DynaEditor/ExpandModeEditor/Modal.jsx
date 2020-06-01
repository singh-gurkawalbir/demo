import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CodeEditor from '../../../../CodeEditor';
import ModalDialog from '../../../../ModalDialog';

const useStyles = makeStyles(() => ({
  editorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: '50vh',
    width: '65vh',
  },
}));

// Moved over existing modal related code here
// Nothing specific changes to mention - User can change content and click on Done to close modal
export default function EditorModal(props) {
  const { handleClose, label, editorProps } = props;
  const { id, value, mode, disabled, handleUpdate } = editorProps;
  const classes = useStyles();

  return (
    <ModalDialog
      show
      handleClose={handleClose}
      aria-labelledby="form-dialog-title">
      <div>{label}</div>
      <div className={classes.editorContainer}>
        <CodeEditor
          name={id}
          value={value}
          mode={mode}
          readOnly={disabled}
          onChange={handleUpdate}
        />
      </div>
      <div>
        <Button
          data-test="showEditor"
          onClick={handleClose}
          variant="outlined"
          color="primary">
          Done
        </Button>
      </div>
    </ModalDialog>
  );
}

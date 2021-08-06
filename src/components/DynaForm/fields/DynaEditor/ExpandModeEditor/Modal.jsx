import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CodeEditor from '../../../../CodeEditor';
import ModalDialog from '../../../../ModalDialog';

const useStyles = makeStyles(() => ({
  editorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: '50vh',
    overflowX: 'hidden',
  },
}));

// Moved over existing modal related code here
// Nothing specific changes to mention - User can change content and click on Done to close modal
export default function EditorModal(props) {
  const { handleClose, label, editorProps } = props;
  const { id, value, mode, disabled, handleUpdate } = editorProps;
  const [content, setContent] = useState(value);
  const classes = useStyles();

  const handleSaveAndClose = useCallback(() => {
    handleUpdate(content);
    handleClose();
  }, [content, handleClose, handleUpdate]);

  return (
    <ModalDialog
      show
      minWidth="sm"
      maxWidth="md"
      onClose={handleClose}
      aria-labelledby="form-dialog-title">
      <div>{label}</div>
      <div className={classes.editorContainer}>
        <CodeEditor
          name={id}
          value={content}
          mode={mode}
          readOnly={disabled}
          onChange={setContent}
        />
      </div>
      <div>
        <Button
          data-test="showEditor"
          variant="contained"
          onClick={handleSaveAndClose}
          color="primary">
          Done
        </Button>
      </div>
    </ModalDialog>
  );
}

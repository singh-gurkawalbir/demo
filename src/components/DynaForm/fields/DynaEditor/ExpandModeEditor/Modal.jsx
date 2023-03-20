import React, { useState, useCallback, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import CodeEditor from '../../../../CodeEditor';
import ModalDialog from '../../../../ModalDialog';
import { OutlinedButton } from '../../../../Buttons';
import FieldMessage from '../../FieldMessage';
import { isJsonString } from '../../../../../utils/string';
import isLoggableAttr from '../../../../../utils/isLoggableAttr';
import { isJsonValue } from '../../../../../utils/json';

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
  const { handleClose, label, editorProps, isLoggable, validateContent} = props;
  const { id, value, mode, disabled, handleUpdate } = editorProps;
  const [content, setContent] = useState(value);
  const [errorMessage, setErrorMessage] = useState('');
  const classes = useStyles();

  const handleSaveAndClose = useCallback(() => {
    handleUpdate(content);
    handleClose();
  }, [content, handleClose, handleUpdate]);

  useEffect(() => {
    // if value of the field changes in the background (triggered by onFieldChange)
    // overwrite the content of the modal
    // used by mock response field in imports
    if (value) {
      setContent(value);
    }
  }, [value]);

  useEffect(() => {
    if (id === 'settings') {
      if (content && typeof content === 'string' && !isJsonString(content)) {
        setErrorMessage('Settings must be a valid JSON');
      } else {
        setErrorMessage('');
      }
    } else if (typeof validateContent === 'function') {
      setErrorMessage(validateContent(content));
    } else if (validateContent && mode === 'json') {
      setErrorMessage(isJsonValue(content, label));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, id]);

  return (
    <ModalDialog
      show
      minWidth="sm"
      maxWidth="md"
      onClose={handleClose}
      aria-labelledby="form-dialog-title">
      <div>{label}</div>
      <div>
        <div className={classes.editorContainer} {...isLoggableAttr(isLoggable)}>
          <CodeEditor
            name={id}
            value={content}
            mode={mode}
            readOnly={disabled}
            onChange={setContent}
          />
        </div>
        { !!errorMessage && (
          <FieldMessage
            errorMessages={errorMessage}
            isValid={false}
          />
        )}
      </div>
      <div>
        <OutlinedButton
          data-test="showEditor"
          variant="contained"
          onClick={handleSaveAndClose}
          color="primary">
          Done
        </OutlinedButton>
      </div>
    </ModalDialog>
  );
}

import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import CodeEditor from '../../../CodeEditor';
import ActionButton from '../../../ActionButton';
import ExpandWindowIcon from '../../../icons/ExpandWindowIcon';
import ErroredMessageComponent from '../ErroredMessageComponent';
import FieldHelp from '../../FieldHelp';
import ExpandModeEditor from './ExpandModeEditor';

const useStyles = makeStyles(theme => ({
  label: {
    fontSize: '12px',
    marginTop: theme.spacing(1),
  },
  dynaEditorButton: {
    float: 'right',
    marginTop: theme.spacing(4),
  },
  inlineEditorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: theme.spacing(10),
  },
  wrapper: {
    flexDirection: 'row !important',
    alignItems: 'flex-start',
    display: 'flex',
  },
  dynaEditorWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  codeEditorWrapper: {
    width: '100%',
  },
  dynaEditorTextLabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
}));

export default function DynaEditor({
  id,
  mode,
  expandMode = 'modal',
  options,
  onFieldChange,
  value,
  className,
  label,
  editorClassName,
  disabled,
  saveMode,
  description,
  errorMessages,
  isValid,
  helpKey,
}) {
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const handleEditorClick = useCallback(() => {
    setShowEditor(!showEditor);
  }, [showEditor]);
  const handleUpdate = useCallback(
    editorVal => {
      let sanitizedVal = editorVal;

      // convert to json if form value is an object
      if (
        saveMode === 'json' ||
        (mode === 'json' && typeof value === 'object')
      ) {
        // user trying to remove the json. Handle removing the value during presave
        if (editorVal === '') {
          onFieldChange(id, '');

          return;
        }

        try {
          sanitizedVal = JSON.parse(editorVal);
        } catch (e) {
          return;
        }
      }

      onFieldChange(id, sanitizedVal);
    },
    [id, mode, onFieldChange, saveMode, value]
  );
  // Options handler would return the selected file type we would use that
  // and inject it as the mode of the editor so that syntax formating would work
  // according to the file format
  const getFileType = () => {
    if (options && options.file) return options.file;

    return mode;
  };

  const modeFromFileOption = getFileType();
  let resultantMode = mode;

  // In the event the user selected a different file type
  // we would use that
  // The default values for both the fields would be the same
  if (modeFromFileOption !== mode) {
    resultantMode = modeFromFileOption;
  }

  return (
    <div className={clsx(classes.wrapper, className)}>
      <div className={classes.dynaEditorWrapper}>
        {/* Below Component deals with showing editor in Modal/Drawer mode when user clicks on expand icon */}
        <ExpandModeEditor
          expandMode={expandMode}
          show={showEditor}
          handleClose={handleEditorClick}
          label={label}
          editorProps={{
            id,
            value,
            mode: resultantMode,
            disabled,
            handleUpdate,
          }}
        />
        <div className={classes.dynaEditorTextLabelWrapper}>
          <FormLabel>{label}</FormLabel>
          {helpKey && <FieldHelp helpKey={helpKey} />}
        </div>

        <div className={clsx(classes.inlineEditorContainer, editorClassName)}>
          <CodeEditor
            readOnly={disabled}
            name={`${id}-inline`}
            value={value}
            mode={mode}
            className={classes.codeEditorWrapper}
            onChange={handleUpdate}
          />
        </div>
        <ErroredMessageComponent
          description={description}
          errorMessages={errorMessages}
          isValid={isValid}
        />
      </div>
      <ActionButton
        data-test={id}
        onClick={handleEditorClick}
        className={classes.dynaEditorButton}>
        <ExpandWindowIcon />
      </ActionButton>
    </div>
  );
}

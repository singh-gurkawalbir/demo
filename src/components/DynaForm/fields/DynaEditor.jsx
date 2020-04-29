import { useState } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import CodeEditor from '../../../components/CodeEditor';
import ActionButton from '../../ActionButton';
import ExpandWindowIcon from '../../icons/ExpandWindowIcon';
import ModalDialog from '../../ModalDialog';
import ErroredMessageComponent from './ErroredMessageComponent';

const useStyles = makeStyles(theme => ({
  label: {
    fontSize: '12px',
    marginTop: theme.spacing(1),
  },
  editorButton: {
    float: 'right',
  },
  inlineEditorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    marginRight: theme.spacing(1),
    height: theme.spacing(10),
  },
  editorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: '50vh',
    width: '65vh',
  },
  wrapper: {
    flexDirection: `row !important`,
  },
  internalWrapper: {
    width: '100%',
  },
}));

export default function DynaEditor(props) {
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const {
    id,
    mode,
    options,
    onFieldChange,
    value,
    label,
    editorClassName,
    disabled,
    saveMode,
  } = props;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleUpdate = editorVal => {
    let sanitizedVal = editorVal;

    // convert to json if form value is an object
    if (saveMode === 'json' || (mode === 'json' && typeof value === 'object')) {
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
  };

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

  const editorDialog = (
    <ModalDialog
      show
      handleClose={handleEditorClick}
      aria-labelledby="form-dialog-title">
      <div>{label}</div>
      <div className={classes.editorContainer}>
        <CodeEditor
          name={id}
          value={value}
          mode={resultantMode}
          readOnly={disabled}
          onChange={value => handleUpdate(value)}
        />
      </div>
      <div>
        <Button
          data-test="showEditor"
          onClick={handleEditorClick}
          variant="outlined"
          color="primary">
          Done
        </Button>
      </div>
    </ModalDialog>
  );

  return (
    <div className={classes.wrapper}>
      <div className={classes.internalWrapper}>
        {showEditor && editorDialog}
        <FormLabel className={classes.label}>{label}</FormLabel>
        <div
          className={classNames(
            classes.inlineEditorContainer,
            editorClassName
          )}>
          <CodeEditor
            readOnly={disabled}
            name={`${id}-inline`}
            value={value}
            mode={mode}
            onChange={value => handleUpdate(value)}
          />
        </div>
        <ErroredMessageComponent {...props} />
      </div>
      <ActionButton
        data-test={id}
        onClick={handleEditorClick}
        className={classes.editorButton}>
        <ExpandWindowIcon />
      </ActionButton>
    </div>
  );
}

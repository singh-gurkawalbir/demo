import { useState, Fragment } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from 'mdi-react/OpenInNewIcon';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import CodeEditor from '../../../components/CodeEditor';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
    overflowY: 'off',
  },
  label: {
    fontSize: '12px',
  },
  editorButton: {
    float: 'right',
  },
  inlineEditorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    height: theme.spacing(10),
  },
  editorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: '50vh',
    width: '65vh',
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
    description,
    errorMessages,
    isValid,
    editorClassName,
  } = props;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleUpdate = value => {
    let sanitizedVal = value;

    if (mode === 'json') {
      try {
        sanitizedVal = JSON.parse(value);
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
    <Dialog
      open
      onClose={handleEditorClick}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{label}</DialogTitle>
      <DialogContent>
        <div className={classes.editorContainer}>
          <CodeEditor
            name={id}
            value={value}
            mode={resultantMode}
            onChange={value => handleUpdate(value)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleEditorClick}
          variant="contained"
          size="small"
          color="secondary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Fragment>
      <IconButton onClick={handleEditorClick} className={classes.editorButton}>
        <OpenInNewIcon />
      </IconButton>
      <div className={classes.container}>
        {showEditor && editorDialog}

        <FormLabel className={classes.label}>{label}</FormLabel>

        <div
          className={classNames(
            classes.inlineEditorContainer,
            editorClassName
          )}>
          <CodeEditor
            name={`${id}-inline`}
            value={value}
            mode={mode}
            onChange={value => handleUpdate(value)}
          />
        </div>
        <FormHelperText className={classes.helpText}>
          {isValid ? description : errorMessages}
        </FormHelperText>
      </div>
    </Fragment>
  );
}

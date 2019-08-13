import { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from 'mdi-react/EditIcon';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import * as selectors from '../../../reducers';
import JavaScriptEditorDialog from '../../../components/AFE/JavaScriptEditor/Dialog';

const useStyles = makeStyles(theme => ({
  label: {
    minWidth: 100,
  },
  inputContainer: {
    display: 'flex',
  },
  textField: {
    width: 'calc(50% - 30px)',
    paddingRight: theme.spacing(1),
  },
  editorButton: {},
}));

export default function DynaHook(props) {
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles(props);
  const { resources: allScripts } = useSelector(state =>
    selectors.resourceList(state, { type: 'scripts' })
  );
  const {
    id,
    disabled,
    isValid,
    name,
    onFieldChange,
    placeholder,
    required,
    value,
    label,
  } = props;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, editorValues) => {
    const { template } = editorValues;

    if (shouldCommit) {
      onFieldChange(id, template);
    }

    handleEditorClick();
  };

  const handleFieldChange = field => event => {
    onFieldChange(id, { ...value, [field]: event.target.value });
  };

  return (
    <Fragment>
      {showEditor && (
        <JavaScriptEditorDialog
          title="Script Editor"
          id={id}
          data="{}"
          scriptId={value._scriptId}
          entryFunction={value.function}
          onClose={handleClose}
        />
      )}

      <div className={classes.inputContainer}>
        <InputLabel className={classes.label} htmlFor="scriptId">
          {label}
        </InputLabel>

        <TextField
          key={id}
          name={name}
          label="Function"
          className={classes.textField}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          error={!isValid}
          value={value.function}
          onChange={handleFieldChange('function')}
        />
        <FormControl className={classes.textField}>
          <InputLabel className={classes.label} htmlFor="scriptId">
            Script
          </InputLabel>
          <Select
            id="scriptId"
            margin="dense"
            value={value._scriptId}
            onChange={handleFieldChange('_scriptId')}>
            {allScripts.map(s => (
              <MenuItem key={s._id} value={s._id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton
          onClick={handleEditorClick}
          className={classes.editorButton}>
          <EditIcon />
        </IconButton>
      </div>
    </Fragment>
  );
}

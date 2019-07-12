import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from 'mdi-react/EditIcon';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// import OpenInNewIcon from 'mdi-react/OpenInNewIcon';
import { FieldWrapper } from 'react-forms-processor/dist';
import * as selectors from '../../../reducers';
import JavaScriptEditorDialog from '../../../components/AFE/JavaScriptEditor/Dialog';

const mapStateToProps = state => {
  const allScripts = selectors.resourceList(state, { type: 'scripts' })
    .resources;

  return { allScripts };
};

@withStyles(theme => ({
  label: {
    minWidth: 100,
  },
  inputContainer: {
    display: 'flex',
  },
  textField: {
    width: 'calc(50% - 30px)',
    paddingRight: theme.spacing.unit,
  },
  editorButton: {},
}))
class DynaHook extends React.Component {
  state = {
    showEditor: false,
  };

  handleEditorClick = () => {
    this.setState({ showEditor: !this.state.showEditor });
  };

  handleClose = (shouldCommit, editorValues) => {
    const { template } = editorValues;
    const { id, onFieldChange } = this.props;

    if (shouldCommit) {
      onFieldChange(id, template);
      // console.log(id, editorValues);
    }

    this.handleEditorClick();
  };

  render() {
    const { showEditor } = this.state;
    const {
      classes,
      disabled,
      id,
      isValid,
      name,
      onFieldChange,
      placeholder,
      required,
      value,
      label,
      allScripts,
    } = this.props;
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
            onClose={this.handleClose}
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
            onClick={this.handleEditorClick}
            className={classes.editorButton}>
            <EditIcon />
          </IconButton>
        </div>
      </Fragment>
    );
  }
}

const ConnectedDynaHook = connect(
  mapStateToProps,
  null
)(DynaHook);
const FieldWrappedDynaHook = props => (
  <FieldWrapper {...props}>
    <ConnectedDynaHook />
  </FieldWrapper>
);

export default FieldWrappedDynaHook;

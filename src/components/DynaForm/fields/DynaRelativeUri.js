import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
// import EditIcon from 'mdi-react/EditIcon';
import OpenInNewIcon from 'mdi-react/OpenInNewIcon';
import { FieldWrapper } from 'react-forms-processor/dist';
import * as selectors from '../../../reducers';
import UrlEditorDialog from '../../../components/AFE/UrlEditor/Dialog';

const mapStateToProps = (state, ownProps) => {
  const { connectionId } = ownProps;

  if (!connectionId) return {};

  const connection = selectors.resource(state, 'connections', connectionId);

  return { connection };
};

@withStyles(() => ({
  textField: {
    minWidth: 200,
  },
  editorButton: {
    float: 'right',
  },
}))
class DynaRelativeUri extends React.Component {
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

  getSampleData = () => {
    const { connection } = this.props;

    if (!connection) return '{}';

    return JSON.stringify(
      {
        connection: {
          _id: connection._id,
          name: connection.name,
        },
      },
      null,
      2
    );
  };

  render() {
    const { showEditor } = this.state;
    const {
      classes,
      connection = {},
      disabled,
      errorMessages,
      id,
      isValid,
      name,
      onFieldChange,
      placeholder,
      required,
      value,
      label,
    } = this.props;
    const handleFieldChange = event => {
      const { value } = event.target;

      onFieldChange(id, value);
    };

    let description = '';
    const { type } = connection || {};

    if (type === 'http' || type === 'rest') {
      description = `Relative to: ${connection[type].baseURI}`;
    }

    return (
      <Fragment>
        {showEditor && (
          <UrlEditorDialog
            title="Relative URI Editor"
            id={id}
            data={this.getSampleData()}
            rule={value}
            onClose={this.handleClose}
          />
        )}
        <IconButton
          onClick={this.handleEditorClick}
          className={classes.editorButton}>
          <OpenInNewIcon />
        </IconButton>
        <TextField
          key={id}
          name={name}
          label={label}
          className={classes.textField}
          placeholder={placeholder}
          helperText={isValid ? description : errorMessages}
          disabled={disabled}
          required={required}
          error={!isValid}
          value={value}
          onChange={handleFieldChange}
        />
      </Fragment>
    );
  }
}

const ConnectedDynaRelativeUri = connect(
  mapStateToProps,
  null
)(DynaRelativeUri);
const FieldWrappedDynaRelativeUri = props => (
  <FieldWrapper {...props}>
    <ConnectedDynaRelativeUri {...props.fieldOpts} />
  </FieldWrapper>
);

export default FieldWrappedDynaRelativeUri;

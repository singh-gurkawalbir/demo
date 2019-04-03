import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from 'mdi-react/EditIcon';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import JsonEditorDialog from '../../JsonEditorDialog';

const mapStateToProps = (state, { field }) => {
  const { id, resourceId, resourceType } = field;
  const fieldMeta = selectors.resourceFormField(
    state,
    resourceType,
    resourceId,
    id
  );

  return { fieldMeta };
};

const mapDispatchToProps = (dispatch, { field }) => {
  const { id, resourceId, resourceType } = field;

  return {
    patchFormField: value => {
      // console.log(`patch ${fid} with:`, value);
      dispatch(
        actions.resource.patchFormField(resourceType, resourceId, id, value)
      );
    },
  };
};

class EditFieldButton extends Component {
  state = {
    showEditor: false,
  };

  handleEditorChange = newMeta => {
    const { patchFormField, onChange } = this.props;

    patchFormField(newMeta);

    if (typeof onChange === 'function') {
      onChange(newMeta);
    }
  };
  handleEditorToggle = () => {
    const { showEditor } = this.state;

    this.setState({ showEditor: !showEditor });
  };

  render() {
    const { showEditor } = this.state;
    const { className, fieldMeta = {} } = this.props;
    const fieldId = fieldMeta.fieldId || 'new';

    return (
      <Fragment>
        <IconButton className={className} onClick={this.handleEditorToggle}>
          <EditIcon fontSize="small" />
        </IconButton>
        {showEditor && (
          <JsonEditorDialog
            onChange={this.handleEditorChange}
            onClose={this.handleEditorToggle}
            value={fieldMeta}
            title={`Editing field ${fieldId}`}
            id={fieldMeta.fieldId}
          />
        )}
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditFieldButton);

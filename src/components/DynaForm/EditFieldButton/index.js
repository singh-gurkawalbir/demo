import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, {
  bindTrigger,
  bindMenu,
} from 'material-ui-popup-state/index';
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
    patchFormField: (value, op = 'replace') => {
      // console.log(`patch ${fid} with:`, value);
      dispatch(
        actions.resource.patchFormField(resourceType, resourceId, id, value, op)
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

  handleDelete = () => {
    const { patchFormField, onChange } = this.props;

    patchFormField(null, 'remove');

    if (typeof onChange === 'function') {
      onChange();
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

    /* eslint-disable react/jsx-handler-names */
    return (
      <Fragment>
        <PopupState variant="popover" popupId="demo-popup-menu">
          {popupState => (
            <Fragment>
              <IconButton className={className} {...bindTrigger(popupState)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <Menu {...bindMenu(popupState)}>
                <MenuItem
                  onClick={() => {
                    popupState.close();
                    this.handleEditorToggle();
                  }}>
                  Edit field
                </MenuItem>
                <MenuItem onClick={popupState.close}>
                  Insert new field before
                </MenuItem>
                <MenuItem onClick={popupState.close}>
                  Insert new field after
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    popupState.close();
                    this.handleDelete();
                  }}>
                  Delete
                </MenuItem>
              </Menu>
            </Fragment>
          )}
        </PopupState>
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

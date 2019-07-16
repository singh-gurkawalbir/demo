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
import NewFieldDialog from '../NewFieldDialog';
import { adaptorTypeMap } from '../../../utils/resource';

const mapStateToProps = (state, { field }) => {
  const { id, resourceId, resourceType } = field;
  const resource =
    selectors.resourceData(state, resourceType, resourceId) || {};
  const { adaptorType } = resource.merged || {};
  const fieldMeta = selectors.resourceFormField(
    state,
    resourceType,
    resourceId,
    id
  );

  // console.log('adaptorType: ', adaptorType);

  return { adaptorType: adaptorTypeMap[adaptorType], resourceType, fieldMeta };
};

const mapDispatchToProps = (dispatch, { field }) => {
  const { id, resourceId, resourceType } = field;

  return {
    patchFormField: (value, op = 'replace', offset = 0) => {
      // console.log(`patch ${fid} with:`, value);
      dispatch(
        actions.resource.patchFormField(
          resourceType,
          resourceId,
          id,
          value,
          op,
          offset
        )
      );
    },
  };
};

class EditFieldButton extends Component {
  state = {
    showEditor: false,
    insertField: false,
  };
  handleMetaChangeOperation = () =>
    this.setState({ showEditor: false, insertField: false });
  handleEditorChange = newMeta => {
    const { patchFormField, onChange } = this.props;

    patchFormField(newMeta);

    if (typeof onChange === 'function') {
      onChange();
    }

    this.handleMetaChangeOperation();
  };

  handleInsertField = newMeta => {
    const { patchFormField, onChange } = this.props;
    const { insertField } = this.state;
    // get meta from props

    patchFormField(newMeta, 'add', insertField === 'after' ? 1 : 0);

    if (typeof onChange === 'function') {
      onChange();
    }

    this.handleMetaChangeOperation();
  };

  handleDelete = () => {
    const { patchFormField, onChange } = this.props;

    patchFormField(null, 'remove');

    if (typeof onChange === 'function') {
      onChange();
    }

    this.handleMetaChangeOperation();
  };

  handleInsertFieldToggle = (mode = false) => {
    this.setState({ insertField: mode });
  };

  handleEditorToggle = () => {
    const { showEditor } = this.state;

    this.setState({ showEditor: !showEditor });
  };

  render() {
    const { showEditor, insertField } = this.state;
    const {
      className,
      fieldMeta = {},
      adaptorType,
      resourceType,
      formFieldsMeta,
    } = this.props;
    const fieldId = fieldMeta.fieldId || 'new';

    /* eslint-disable react/jsx-handler-names */
    return (
      <Fragment>
        <PopupState variant="popover" popupId="edit-field-menu">
          {popupState => (
            <Fragment>
              <IconButton
                data-testid="edit-meta"
                className={className}
                {...bindTrigger(popupState)}>
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
                <MenuItem
                  onClick={() => {
                    popupState.close();
                    this.handleInsertFieldToggle('before');
                  }}>
                  Insert new field before
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    popupState.close();
                    this.handleInsertFieldToggle('after');
                  }}>
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
        {insertField && (
          <NewFieldDialog
            formFieldsMeta={formFieldsMeta}
            resourceType={resourceType}
            adaptorType={adaptorType}
            title={`Insert this new field ${insertField} ${fieldId}`}
            onClose={() => this.handleInsertFieldToggle()}
            onSubmit={field => this.handleInsertField(field)}
          />
        )}
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

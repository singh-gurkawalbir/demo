import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import JavaScriptEditorDialog from '../../../components/AFE/JavaScriptEditor/Dialog';

const mapStateToProps = (state, { resourceId, resourceType }) => {
  const resourceData = selectors.resourceData(state, resourceType, resourceId);
  const resource = resourceData ? resourceData.merged : undefined;
  const getScriptMeta = hookName => {
    if (!resource || !resource.customForm) return {};

    return resource.customForm[hookName] || {};
  };

  const formMeta =
    resource && resource.customForm ? resource.customForm.form : {};

  return { formMeta, getScriptMeta };
};

const mapDispatchToProps = (dispatch, { resourceId }) => ({
  patchAndCommitScript: (scriptId, code) => {
    const patchSet = [
      {
        op: 'replace',
        path: `/content`,
        value: code,
      },
    ];

    dispatch(actions.resource.patchStaged(scriptId, patchSet));
    dispatch(actions.resource.commitStaged('scripts', scriptId));
  },

  patchHook: (hookName, value) => {
    const patchSet = [
      {
        op: 'replace',
        path: `/customForm/${hookName}`,
        value,
      },
    ];

    dispatch(actions.resource.patchStaged(resourceId, patchSet));
  },
});

class EditFieldButton extends Component {
  state = {
    showEditor: false,
    hookName: null,
  };

  handleEditorChange = (shouldCommit, editor) => {
    const { scriptId, entryFunction, code } = editor;
    const { hookName } = this.state;
    const { patchHook, patchAndCommitScript } = this.props;
    const value = { scriptId, entryFunction };

    // console.log(hookName, value, editor);

    if (shouldCommit) {
      patchAndCommitScript(scriptId, code);
      patchHook(hookName, value);
    }

    this.handleEditorToggle();
  };

  handleEditorToggle = hookName => {
    const { showEditor } = this.state;

    this.setState({ showEditor: !showEditor, hookName });
  };

  render() {
    const { showEditor, hookName } = this.state;
    const { className, getScriptMeta, formMeta } = this.props;
    const { scriptId, entryFunction } = getScriptMeta(hookName);

    return (
      <Fragment>
        <PopupState variant="popover" popupId="edit-hooks-menu">
          {popupState => (
            <Fragment>
              <Button
                size="small"
                color="primary"
                className={className}
                {...bindTrigger(popupState)}>
                Hooks
              </Button>
              <Menu {...bindMenu(popupState)}>
                <MenuItem
                  onClick={() => {
                    popupState.close();
                    this.handleEditorToggle('init');
                  }}>
                  Init
                </MenuItem>
                {/* We do not yet have support for an optionsHandler...
                <MenuItem
                  onClick={() => {
                    popupState.close();
                    this.handleEditorToggle('optionsHandler');
                  }}>
                  Options Handler
                </MenuItem> */}
                <MenuItem
                  onClick={() => {
                    popupState.close();
                    this.handleEditorToggle('submit');
                  }}>
                  PreSubmit
                </MenuItem>
              </Menu>
            </Fragment>
          )}
        </PopupState>

        {showEditor && (
          <JavaScriptEditorDialog
            onClose={this.handleEditorChange}
            scriptId={scriptId}
            entryFunction={entryFunction}
            data={formMeta}
            title={`Editing ${hookName} hook`}
            id={hookName}
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

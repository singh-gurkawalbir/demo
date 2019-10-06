import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import JavaScriptEditorDialog from '../../../components/AFE/JavaScriptEditor/Dialog';
import { SCOPES } from '../../../sagas/resourceForm';

export default function EditFieldButton(props) {
  const { resourceType, resourceId, className } = props;
  const resourceData = useSelector(state =>
    selectors.resourceData(state, resourceType, resourceId)
  );
  const resource = resourceData ? resourceData.merged : undefined;
  const getScriptMeta = hookName => {
    if (!resource || !resource.customForm) return {};

    return resource.customForm[hookName] || {};
  };

  const formMeta =
    resource && resource.customForm ? resource.customForm.form : {};
  const dispatch = useDispatch();
  const patchAndCommitScript = (scriptId, code) => {
    const patchSet = [
      {
        op: 'replace',
        path: `/content`,
        value: code,
      },
    ];

    dispatch(actions.resource.patchStaged(scriptId, patchSet, SCOPES.SCRIPT));
    dispatch(actions.resource.commitStaged('scripts', scriptId, SCOPES.SCRIPT));
  };

  const patchHook = (hookName, value) => {
    const patchSet = [
      {
        op: 'replace',
        path: `/customForm/${hookName}`,
        value,
      },
    ];

    dispatch(actions.resource.patchStaged(resourceId, patchSet, SCOPES.SCRIPT));
  };

  const [showEditor, setShowEditor] = useState(false);
  const [hookName, setHookName] = useState(null);
  const handleEditorToggle = hookName => {
    setHookName(hookName);
    setShowEditor(showEditor => !showEditor);
  };

  const handleEditorChange = (shouldCommit, editor) => {
    const { scriptId, entryFunction, code } = editor;
    const value = { scriptId, entryFunction };

    // console.log(hookName, value, editor);

    if (shouldCommit) {
      patchAndCommitScript(scriptId, code);
      patchHook(hookName, value);
    }

    handleEditorToggle();
  };

  const { scriptId, entryFunction } = getScriptMeta(hookName);
  // TODO: We need to have the Hooks button wrapped with
  // DynaSubmit so that we can collect the form values and set them as the
  // "Data" argument for the submit hook. For now, lets just create some
  // dummy values...
  const formValues = { field1: 'abc', field2: 123, field3: true };
  const data = hookName === 'init' ? formMeta : formValues;

  return (
    <Fragment>
      <PopupState variant="popover" popupId="edit-hooks-menu">
        {popupState => (
          <Fragment>
            <Button
              data-test="hooks"
              size="small"
              color="primary"
              className={className}
              {...bindTrigger(popupState)}>
              Hooks
            </Button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem
                data-test="init"
                onClick={() => {
                  popupState.close();
                  handleEditorToggle('init');
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
                data-test="presubmit"
                onClick={() => {
                  popupState.close();
                  handleEditorToggle('submit');
                }}>
                PreSubmit
              </MenuItem>
            </Menu>
          </Fragment>
        )}
      </PopupState>

      {showEditor && (
        <JavaScriptEditorDialog
          onClose={handleEditorChange}
          scriptId={scriptId}
          entryFunction={entryFunction}
          data={data}
          title={`Editing ${hookName} hook`}
          id={hookName}
        />
      )}
    </Fragment>
  );
}

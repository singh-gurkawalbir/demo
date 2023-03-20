import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import CodeEditor from '../../../../CodeEditor';
import RightDrawer from '../../../../drawer/Right';
import DrawerHeader from '../../../../drawer/Right/DrawerHeader';
import DrawerContent from '../../../../drawer/Right/DrawerContent';
import DrawerFooter from '../../../../drawer/Right/DrawerFooter';
import { isNewId } from '../../../../../utils/resource';
import { FilledButton, TextButton } from '../../../../Buttons';
import SaveAndCloseButtonGroupAuto from '../../../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto';
import useFormOnCancelContext from '../../../../FormOnCancelContext';
import { getFormSaveStatusFromCommStatus } from '../../../../../utils/editor';
import { drawerPaths } from '../../../../../utils/rightDrawer';
import isLoggableAttr from '../../../../../utils/isLoggableAttr';

const useStyles = makeStyles(() => ({
  content: {
    height: '100%',
  },
}));

/**
 * Only Used for editing script content currently
 */
function ExpandModeDrawerContent() {
  const { formKey, fieldId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const fieldState = useSelector(state => selectors.fieldState(state, formKey, fieldId));
  const { value, disabled, resourceId, resourceType, isLoggable } = fieldState || {};
  const [editorContent, setEditorContent] = useState(value);
  const resourceCommStatus = useSelector(state => selectors.commStatusPerPath(state, `/${resourceType}/${resourceId}`, 'put'));
  const isNewResource = isNewId(resourceId);
  const handleClose = () => history.goBack();

  if (!fieldState) {
    handleClose();
  }

  const handleDone = () => {
    dispatch(actions.form.fieldChange(formKey)(fieldId, editorContent));
    handleClose();
  };

  const handleSave = () => {
    const patchSet = [{ op: 'replace', path: `/${fieldId}`, value: editorContent}];

    dispatch(actions.resource.patchAndCommitStaged(resourceType, resourceId, patchSet));
  };

  const {setCancelTriggered} = useFormOnCancelContext(fieldId);

  return (
    <>
      <DrawerHeader title="Edit content" handleClose={isNewResource ? handleClose : setCancelTriggered} />
      <DrawerContent>
        <div className={classes.content} {...isLoggableAttr(isLoggable)} >
          <CodeEditor
            name={fieldId}
            value={editorContent}
            mode="javascript"
            readOnly={disabled}
            onChange={setEditorContent}
        />
        </div>

      </DrawerContent>
      <DrawerFooter>
        {
          isNewResource ? (
            <>
              <FilledButton
                data-test="saveContent"
                disabled={value === editorContent}
                onClick={handleDone}>
                Done
              </FilledButton>
              <TextButton
                data-test="closeContent"
                onClick={handleClose}>
                Cancel
              </TextButton>
            </>
          ) : (
            (
              <SaveAndCloseButtonGroupAuto
                isDirty={value !== editorContent}
                status={getFormSaveStatusFromCommStatus(resourceCommStatus)}
                onSave={handleSave}
                onClose={handleClose}
                shouldHandleCancel
                asyncKey={fieldId}
              />
            )
          )
        }
      </DrawerFooter>
    </>
  );
}

export default function ExpandModeDrawer() {
  return (
    <RightDrawer
      height="tall"
      width="full"
      path={drawerPaths.DYNA_EDITOR_EXPAND}>
      <ExpandModeDrawerContent />
    </RightDrawer>
  );
}

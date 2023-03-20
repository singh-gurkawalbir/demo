
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import useFormInitWithPermissions from '../../../../../../hooks/useFormInitWithPermissions';
import { hashCode } from '../../../../../../utils/string';
import DynaForm from '../../../../../DynaForm';
import DynaSubmit from '../../../../../DynaForm/DynaSubmit';
import { message } from '../../../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  formPreviewContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  testForm: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(1),
  },
  message: {
    padding: theme.spacing(1),
  },
}));

export default function FormPreviewPanel({ editorId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { result, previewStatus, resourceId, resourceType } = useSelector(state => {
    const e = selectors.editor(state, editorId);

    return {
      result: e.result,
      previewStatus: e.previewStatus,
      resourceId: e.resourceId,
      resourceType: e.resourceType,
    };
  }, shallowEqual);
  const [formState, setFormState] = useState({
    showFormValidationsBeforeTouch: false,
  });
  const handleFormPreviewChange = useCallback(values => {
    dispatch(actions.editor.patchFeatures(editorId, {formOutput: values}));
  }, [dispatch, editorId]);
  const showCustomFormValidations = useCallback(() => {
    setFormState({
      showFormValidationsBeforeTouch: true,
    });
  }, []);

  // *** The code below should now be handled by the data-layer. Any time
  // the rule (form metadata) is patched, the data-layer should clear the
  // form output preview.
  // any time the form metadata updates, we need to reset the settings since
  // the form itself could change the shape of the settings.
  // useEffect(() => {
  //   setSettingsPreview();
  // }, [lastChange]);

  const key = hashCode(result);

  useFormInitWithPermissions({
    formKey: editorId,
    fieldMeta: result?.data,
    remount: key,
    resourceId,
    resourceType,
    ...formState,
  });

  if (result?.data && previewStatus !== 'error') {
    return (
      <div className={classes.formPreviewContainer}>
        <DynaForm
          formKey={editorId}
          className={classes.form}
            />
        <div className={classes.testForm}>
          <DynaSubmit
            formKey={editorId}
            onClick={handleFormPreviewChange}
            showCustomFormValidations={showCustomFormValidations}>
            Test form
          </DynaSubmit>
        </div>
      </div>
    );
  }

  return (
    <Typography className={classes.message}>
      {message.FORM_PREVIEW}
    </Typography>

  );
}

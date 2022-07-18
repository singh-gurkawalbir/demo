import React, { useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { selectors } from '../../../reducers';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import SaveAndCloseButtonGroupAuto from '../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto';
import { SUITESCRIPT_MAPPINGS_FORM_KEY } from '../../../constants';
import mappingUtil from '../../../utils/mapping';

export default function ButtonPanel({disabled, onClose}) {
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();

  const mappingsChanged = useSelector(state =>
    selectors.suiteScriptMappingChanged(state)
  );

  const {validationErrMsg, saveStatus} = useSelector(state =>
    selectors.suiteScriptMapping(state), shallowEqual
  );

  const onSave = useCallback(() => {
    dispatch(actions.suiteScript.mapping.save());
  }, [dispatch]);

  const handleButtonClick = () => {
    if (validationErrMsg) {
      enqueueSnackbar({
        message: validationErrMsg,
        variant: 'error',
      });

      return;
    }

    onSave();
  };

  const formStatus = mappingUtil.getFormStatusFromMappingSaveStatus(saveStatus);

  return (
    <SaveAndCloseButtonGroupAuto
      isDirty={mappingsChanged}
      disabled={disabled}
      status={formStatus}
      onSave={handleButtonClick}
      onClose={onClose}
      asyncKey={SUITESCRIPT_MAPPINGS_FORM_KEY}
      shouldHandleCancel
    />
  );
}

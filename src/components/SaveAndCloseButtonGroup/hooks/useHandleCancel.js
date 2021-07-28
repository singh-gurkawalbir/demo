import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import useHandleCancelBasic from './useHandleCancelBasic';

export default function useHandleCancel({formKey, onClose, handleSave}) {
  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));

  const handleCancelClick = useHandleCancelBasic({isDirty, onClose, handleSave});

  return handleCancelClick;
}

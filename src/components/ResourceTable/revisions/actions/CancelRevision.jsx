import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import CancelIcon from '../../../icons/CancelIcon';
import actions from '../../../../actions';

export default {
  key: 'cancelRevision',
  useLabel: () => 'Cancel revision',
  icon: CancelIcon,
  useOnClick: rowData => {
    const dispatch = useDispatch();
    const { _integrationId, _id: revisionId } = rowData;
    const handleClick = useCallback(() => {
      dispatch(actions.integrationLCM.revision.cancel(_integrationId, revisionId));
    }, [dispatch, _integrationId, revisionId]);

    return handleClick;
  },
};

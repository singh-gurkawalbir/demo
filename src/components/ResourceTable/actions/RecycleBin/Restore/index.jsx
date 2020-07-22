import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import { RESOURCE_TYPE_LABEL_TO_SINGULAR } from '../../../../../constants/resource';
import RestoreIcon from '../../../../icons/RestoreIcon';

export default {
  label: 'Restore',
  icon: RestoreIcon,
  component: function Restore({ rowData = {} }) {
    const dispatch = useDispatch();
    const restore = useCallback(() => {
      dispatch(
        actions.recycleBin.restore(
          `${RESOURCE_TYPE_LABEL_TO_SINGULAR[rowData.model]}s`,
          rowData.doc && rowData.doc._id
        )
      );
    }, [dispatch, rowData.doc, rowData.model]);

    useEffect(() => {
      restore();
    }, [restore]);

    return null;
  },
};

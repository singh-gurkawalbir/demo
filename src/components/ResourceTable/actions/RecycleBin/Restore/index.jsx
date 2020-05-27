import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import RestoreIcon from '../../../../icons/RestoreIcon';
import actions from '../../../../../actions';
import { RESOURCE_TYPE_LABEL_TO_SINGULAR } from '../../../../../constants/resource';
import getRoutePath from '../../../../../utils/routePaths';

export default {
  label: 'Restore',
  icon: RestoreIcon,
  component: function Restore({ rowData = {} }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const restore = useCallback(() => {
      dispatch(
        actions.recycleBin.restore(
          `${RESOURCE_TYPE_LABEL_TO_SINGULAR[rowData.model]}s`,
          rowData.doc && rowData.doc._id
        )
      );
      history.push(
        getRoutePath(`/${RESOURCE_TYPE_LABEL_TO_SINGULAR[rowData.model]}s`)
      );
    }, [dispatch, history, rowData.doc, rowData.model]);

    useEffect(() => {
      restore();
    }, [restore]);

    return null;
  },
};

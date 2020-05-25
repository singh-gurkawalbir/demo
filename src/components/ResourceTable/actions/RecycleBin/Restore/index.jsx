import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import RestoreIcon from '../../../../icons/RestoreIcon';
import actions from '../../../../../actions';
import getRoutePath from '../../../../../utils/routePaths';
import { RESOURCE_TYPE_LABEL_TO_SINGULAR } from '../../../../../constants/resource';

export default {
  title: 'Restore',
  icon: RestoreIcon,
  component: function Restore({ resource }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const restore = useCallback(() => {
      dispatch(
        actions.recycleBin.restore(
          `${RESOURCE_TYPE_LABEL_TO_SINGULAR[resource.model]}s`,
          resource.doc && resource.doc._id
        )
      );
      history.push(
        getRoutePath(`/${RESOURCE_TYPE_LABEL_TO_SINGULAR[resource.model]}s`)
      );
    }, [dispatch, history, resource.doc, resource.model]);

    useEffect(() => {
      restore();
    }, [restore]);

    return null;
  },
};

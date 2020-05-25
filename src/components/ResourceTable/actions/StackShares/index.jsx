import { Fragment, useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import StacksIcon from '../../../../components/icons/StacksIcon';
import ShareStackDialog from '../../../../components/ShareStackDialog';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import * as selectors from '../../../../reducers';

const ssharesFilterConfig = { type: 'sshares' };

export default {
  title: 'Stack shares',
  icon: StacksIcon,
  component: function StackShares({ resource }) {
    const [show, setShow] = useState(true);
    const dispatch = useDispatch();
    const resourceList = useSelectorMemo(
      selectors.makeResourceListSelector,
      ssharesFilterConfig
    );
    const stackShareCollection = resourceList.resources;
    const handleStackShareClose = useCallback(() => {
      setShow(false);
    }, []);

    useEffect(() => {
      dispatch(actions.resource.requestCollection('sshares'));
    }, [dispatch]);

    return (
      <Fragment>
        {show && (
          <ShareStackDialog
            stackId={resource._id}
            onClose={handleStackShareClose}
            stackShareCollectionById={
              stackShareCollection &&
              stackShareCollection.filter(
                stack => stack._stackId === resource._id
              )
            }
          />
        )}
      </Fragment>
    );
  },
};

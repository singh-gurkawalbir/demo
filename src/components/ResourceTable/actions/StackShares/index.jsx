import { Fragment, useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/StacksIcon';
import ShareStackDialog from '../../../../components/ShareStackDialog';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import * as selectors from '../../../../reducers';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';

const ssharesFilterConfig = { type: 'sshares' };

export default {
  component: function StackShares({ resource }) {
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const resourceList = useSelectorMemo(
      selectors.makeResourceListSelector,
      ssharesFilterConfig
    );
    const stackShareCollection = resourceList.resources;
    const showStackShare = useCallback(() => {
      setShow(true);
    }, []);
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
        <IconButtonWithTooltip
          tooltipProps={{
            title: 'Stack shares',
          }}
          data-test="showStackShares"
          size="small"
          onClick={showStackShare}>
          <Icon />
        </IconButtonWithTooltip>
      </Fragment>
    );
  },
};

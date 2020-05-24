import { Fragment, useMemo, useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/StacksIcon';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import * as selectors from '../../../../reducers';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';
import ShareStack from '../../../ShareStack';

const ssharesFilterConfig = { type: 'sshares' };

export default {
  key: 'stackShares',
  component: function StackShares({ resource }) {
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const resourceList = useSelectorMemo(
      selectors.makeResourceListSelector,
      ssharesFilterConfig
    );
    const stackShareCollectionById = useMemo(
      () =>
        resourceList.resources &&
        resourceList.resources.filter(stack => stack._stackId === resource._id),
      [resource._id, resourceList.resources]
    );
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
        <ShareStack
          show={show}
          stackId={resource._id}
          title={`Stack sharing: ${resource.name}`}
          onClose={handleStackShareClose}
          stackShareCollectionById={stackShareCollectionById}
        />
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

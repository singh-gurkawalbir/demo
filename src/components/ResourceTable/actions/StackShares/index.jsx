import { IconButton } from '@material-ui/core';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/StacksIcon';
import ShareStackDialog from '../../../../components/ShareStackDialog';
import useResourceList from '../../../../hooks/selectors/useResourceList';

const ssharesFilterConfig = { type: 'sshares' };

export default {
  label: 'Stack Shares',
  component: function StackShares({ resource }) {
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const resourceList = useResourceList(ssharesFilterConfig);
    const stackShareCollection = resourceList.resources;

    useEffect(() => {
      dispatch(actions.resource.requestCollection('sshares'));
    }, [dispatch]);

    return (
      <Fragment>
        {show && (
          <ShareStackDialog
            stackId={resource._id}
            onClose={() => setShow(false)}
            stackShareCollectionById={
              stackShareCollection &&
              stackShareCollection.filter(
                stack => stack._stackId === resource._id
              )
            }
          />
        )}
        <IconButton
          data-test="showStackShares"
          size="small"
          onClick={() => setShow(true)}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};

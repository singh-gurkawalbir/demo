import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../components/icons/HookIcon';
import ShareStackDialog from '../../../../components/ShareStackDialog';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';

export default {
  label: 'Stack Shares',
  component: function StackShares({ resource }) {
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const resourceList = useSelector(state =>
      selectors.resourceList(state, { type: 'sshares' })
    );
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
        <IconButton size="small" onClick={() => setShow(true)}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};

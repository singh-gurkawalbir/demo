import { Fragment } from 'react';
import { IconButton } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import Icon from '../../../../../components/icons/HookIcon';

export default {
  label: 'Reactivate token',
  component: function AccessTokens({ resourceType, resource }) {
    // console.log(`${resourceType} -- ${JSON.stringify(resource)}`);
    const dispatch = useDispatch();

    function handleReactivateClick() {
      const patchSet = [
        {
          op: 'replace',
          path: '/revoked',
          value: false,
        },
      ];

      dispatch(actions.resource.patchStaged(resource._id, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged(resourceType, resource._id, 'value')
      );
    }

    return (
      <Fragment>
        <IconButton size="small" onClick={() => handleReactivateClick()}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};

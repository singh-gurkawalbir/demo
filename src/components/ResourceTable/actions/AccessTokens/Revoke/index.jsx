import { Fragment } from 'react';
import { IconButton } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
// TODO Azhar
import Icon from '../../../../../components/icons/HookIcon';

export default {
  label: 'Revoke token',
  component: function AccessTokens({ resourceType, resource }) {
    const dispatch = useDispatch();

    function handleRevokeClick() {
      const patchSet = [
        {
          op: 'replace',
          path: '/revoked',
          value: true,
        },
      ];

      dispatch(actions.resource.patchStaged(resource._id, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged(resourceType, resource._id, 'value')
      );
    }

    return (
      <Fragment>
        <IconButton
          data-test="revokeAccessToken"
          size="small"
          onClick={() => handleRevokeClick()}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};

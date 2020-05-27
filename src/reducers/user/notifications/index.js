import produce from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';

const defaultState = {
  accounts: [],
  stacks: [],
};
const emptySet = [];

export default (state = defaultState, action) => {
  const { type, resourceType, collection = [] } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.RECEIVED_COLLECTION: {
        if (!['shared/ashares', 'shared/sshares'].includes(resourceType)) {
          break;
        }

        const pendingShares = collection.filter(
          s => s.ownerUser && !s.accepted && !s.rejected && !s.dismissed
        );

        if (resourceType === 'shared/ashares') {
          draft.accounts = pendingShares;
        } else if (resourceType === 'shared/sshares') {
          draft.stacks = pendingShares;
        }

        break;
      }

      default:
        break;
    }
  });
};

export const userNotifications = createSelector(
  state => state && state.accounts,
  state => state && state.stacks,
  (accounts, stacks) => {
    if (!accounts && !stacks) {
      return emptySet;
    }

    const notifications = [];

    accounts &&
      accounts.forEach(a => {
        notifications.push({
          id: a._id,
          type: 'account',
          nameOrCompany: a.ownerUser.name || a.ownerUser.company,
          email: a.ownerUser.email,
          // secondaryMessage: `${a.ownerUser.email} is inviting you to join their account. Please accept or decline this invitation.`,
        });
      });

    stacks &&
      stacks.forEach(s => {
        notifications.push({
          id: s._id,
          type: 'stack',
          nameOrCompany: s.ownerUser.name || s.ownerUser.company,
          email: s.ownerUser.email,
          stackName: s.stack.name || s.stack._id,
          // secondaryMessage: `${s.ownerUser.email} is shared a stack "${s.stack
          //   .name || s.stack._id}" with you. Please accept or decline this.`,
        });
      });

    return notifications;
  }
);

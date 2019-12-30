import actionTypes from '../../../actions/types';

const defaultState = {
  accounts: [],
  stacks: [],
};

export default (state = defaultState, action) => {
  const { type, resourceType } = action;
  const { collection = [] } = action;

  switch (type) {
    case actionTypes.RESOURCE.RECEIVED_COLLECTION: {
      if (!['shared/ashares', 'shared/sshares'].includes(resourceType)) {
        return state;
      }

      const pendingShares = collection.filter(
        s => s.ownerUser && !s.accepted && !s.rejected && !s.dismissed
      );

      if (resourceType === 'shared/ashares') {
        return {
          ...state,
          accounts: pendingShares,
        };
      } else if (resourceType === 'shared/sshares') {
        return { ...state, stacks: pendingShares };
      }

      return state;
    }

    default:
      return state;
  }
};

export function userNotifications(state) {
  const notifications = [];

  if (!state) {
    return notifications;
  }

  state.accounts &&
    state.accounts.forEach(s => {
      notifications.push({
        id: s._id,
        type: 'account',
        primaryMessage: s.ownerUser.name || s.ownerUser.company,
        secondaryMessage: `${s.ownerUser.email} is inviting you to join their account. Please accept or decline this invitation.`,
      });
    });

  state.stacks &&
    state.stacks.forEach(s => {
      notifications.push({
        id: s._id,
        type: 'stack',
        primaryMessage: s.ownerUser.name || s.ownerUser.company,
        secondaryMessage: `${s.ownerUser.email} is shared a stack "${s.stack
          .name || s.stack._id}" with you. Please accept or decline this.`,
      });
    });

  return notifications;
}

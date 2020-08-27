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
        if (!['shared/ashares', 'shared/sshares', 'transfers', 'transfers/invited'].includes(resourceType)) {
          break;
        }
        if (!collection) { break; }
        const pendingShares = collection.filter(
          s => s.ownerUser && !s.accepted && !s.rejected && !s.dismissed
        );

        if (resourceType === 'shared/ashares') {
          draft.accounts = pendingShares;
        } else if (resourceType === 'shared/sshares') {
          draft.stacks = pendingShares;
        } else if (resourceType === 'transfers' || resourceType === 'transfers/invited') {
          draft.transfers = pendingShares;
        }

        break;
      }

      default:
        break;
    }
  });
};

export const selectors = {};

selectors.userNotifications = createSelector(
  state => state && state.accounts,
  state => state && state.stacks,
  state => state && state.transfers,
  (accounts, stacks, transfers) => {
    if (!accounts && !stacks && !transfers) {
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
          message: 'is inviting you to join their account.',
          // secondaryMessage: `${a.ownerUser.email} is inviting you to join their account. Please accept or decline this invitation.`,
        });
      });
    transfers &&
    transfers.forEach(t => {
      const interationsDoc = [];
      let name = '';

      if (t.account) {
        notifications.push({
          id: t._id,
          type: 'transfer',
          nameOrCompany: t.ownerUser.name || t.ownerUser.company,
          email: t.ownerUser.email,
          message: 'has invited you to become the owner of their account.',
          account: true,
        });
      } else {
        if (t.toTransfer && t.toTransfer.integrations) {
          t.toTransfer.integrations.forEach(i => {
            name = ((i._id === 'none') ? 'Standalone Flows' : i.name) || i._id;
            if (i.tag) {
              name += ` (${i.tag})`;
            }
            interationsDoc.push(name);
          });
        }
        notifications.push({
          id: t._id,
          type: 'transfer',
          nameOrCompany: t.ownerUser.name || t.ownerUser.company,
          email: t.ownerUser.email,
          message: `wants to transfer integration(s) ${interationsDoc.join(',')} to you.`,
        });
      }
    });

    stacks &&
      stacks.forEach(s => {
        notifications.push({
          id: s._id,
          type: 'stack',
          nameOrCompany: s.ownerUser.name || s.ownerUser.company,
          email: s.ownerUser.email,
          stackName: s.stack.name || s.stack._id,
          message: `${s.ownerUser.email} has shared the "${s.stack.name || s.stack._id}" stack with you.`,
          // secondaryMessage: `${s.ownerUser.email} is shared a stack "${s.stack
          //   .name || s.stack._id}" with you. Please accept or decline this.`,
        });
      });

    return notifications;
  }
);

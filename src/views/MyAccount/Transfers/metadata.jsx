import moment from 'moment';
import Delete from './Actions/Delete';
import Cancel from './Actions/Cancel';

export default {
  columns: () => {
    const columns = [
      {
        heading: 'From User',
        value: (r, { preferences }) => {
          const response = { ...r };
          let fromUser = '';

          if (response.transferToUser && response.transferToUser._id) {
            response.ownerUser = {
              _id: preferences._id,
              email: preferences.email,
              name: 'Me',
            };
          } else if (response.ownerUser && response.ownerUser._id) {
            response.transferToUser = {
              _id: preferences._id,
              email: preferences.email,
              name: 'Me',
            };
            response.isInvited = true;
          }

          if (response.ownerUser && response.ownerUser.name) {
            fromUser = response.ownerUser.name;
          }

          if (
            response.isInvited &&
            response.ownerUser &&
            response.ownerUser.email
          ) {
            fromUser = response.ownerUser.email;
          }

          return fromUser;
        },
        orderBy: 'name',
      },
      {
        heading: 'To User',
        value: (r, { preferences }) => {
          const response = { ...r };
          let fromUser = '';

          if (response.ownerUser && response.ownerUser._id) {
            response.transferToUser = {
              _id: preferences._id,
              email: preferences.email,
              name: 'Me',
            };
            response.isInvited = true;
          }

          if (response.transferToUser && response.transferToUser.name) {
            fromUser = response.transferToUser.name;
          }

          if (
            !response.isInvited &&
            response.transferToUser &&
            response.transferToUser.email
          ) {
            fromUser = response.transferToUser.email;
          }

          return fromUser;
        },
      },
      {
        heading: 'Integrations',
        value: r => {
          const toReturn = [];

          if (r.toTransfer && r.toTransfer.integrations) {
            r.toTransfer.integrations.forEach(i => {
              let { name } = i;

              if (i._id === 'none') {
                name = 'Standalone Flows';
              }

              name = name || i._id;

              if (i.tag) {
                name += ` (${i.tag})`;
              }

              toReturn.push(name);
            });
          }

          return toReturn.join('\n');
        },
      },
      { heading: 'Status', value: r => r && r.status },
      {
        heading: 'Transfer Date',
        value: (r, { preferences }) => {
          if (r.transferredAt) {
            return moment(r.transferredAt).format(
              `${preferences && preferences.dateFormat} ${preferences &&
                preferences.timeFormat}`
            );
          }

          return '';
        },
      },
    ];

    return columns;
  },
  rowActions: [Cancel, Delete],
};

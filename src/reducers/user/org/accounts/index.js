import moment from 'moment';
import actionTypes from '../../../../actions/types';

export default (state = [], action) => {
  const { type, resourceType } = action;
  let { collection } = action;

  switch (type) {
    case actionTypes.RESOURCE.RECEIVED_COLLECTION: {
      if (['licenses', 'shared/ashares'].includes(resourceType)) {
        if (!collection) {
          collection = [];
        }
      }

      if (resourceType === 'licenses') {
        const ownAccount = {
          _id: 'own',
          accessLevel: 'owner',
          ownerUser: { licenses: [...collection] },
        };
        const sharedAccounts = state.filter(a => a._id !== 'own');

        return [ownAccount, ...sharedAccounts];
      } else if (resourceType === 'shared/ashares') {
        const ownAccounts = state.filter(a => a._id === 'own');

        if (!ownAccounts.length) {
          return [...collection];
        }

        return [...ownAccounts, ...collection];
      }

      return state;
    }

    case actionTypes.LICENSE_TRIAL_ISSUED: {
      const ownAccount = state.find(a => a._id === 'own');

      if (
        !ownAccount ||
        !ownAccount.ownerUser ||
        !ownAccount.ownerUser.licenses
      ) {
        return state;
      }

      const integratorLicense = ownAccount.ownerUser.licenses.find(
        l => l.type === 'integrator'
      );

      if (!integratorLicense) {
        return state;
      }

      const { trialEndDate, tier } = action;
      const updatedLicenses = ownAccount.ownerUser.licenses.map(l => {
        if (l.type === 'integrator') {
          return { ...l, trialEndDate, tier, trialStarted: true };
        }

        return l;
      });

      return state.map(a => {
        if (a._id === 'own') {
          return {
            ...a,
            ownerUser: { ...a.ownerUser, licenses: updatedLicenses },
          };
        }

        return a;
      });
    }

    case actionTypes.LICENSE_UPGRADE_REQUEST_SUBMITTED: {
      const ownAccount = state.find(a => a._id === 'own');

      if (
        !ownAccount ||
        !ownAccount.ownerUser ||
        !ownAccount.ownerUser.licenses
      ) {
        return state;
      }

      const integratorLicense = ownAccount.ownerUser.licenses.find(
        l => l.type === 'integrator'
      );

      if (!integratorLicense) {
        return state;
      }

      const updatedLicenses = ownAccount.ownerUser.licenses.map(l => {
        if (l.type === 'integrator') {
          return { ...l, upgradeRequested: true };
        }

        return l;
      });

      return state.map(a => {
        if (a._id === 'own') {
          return {
            ...a,
            ownerUser: { ...a.ownerUser, licenses: updatedLicenses },
          };
        }

        return a;
      });
    }

    default:
      return state;
  }
};

const remainingDays = date =>
  Math.ceil((moment(date) - moment()) / 1000 / 60 / 60 / 24);

// #region PUBLIC SELECTORS

// #region INTEGRATOR LICENSE
export function integratorLicense(state, accountId) {
  if (!state) {
    return null;
  }

  const account = state.find(a => a._id === accountId);

  if (!account || !account.ownerUser || !account.ownerUser.licenses) {
    return null;
  }

  const ioLicense = account.ownerUser.licenses.find(
    l => l.type === 'integrator'
  );

  if (!ioLicense) {
    return null;
  }

  if (!ioLicense.sandbox) {
    ioLicense.sandbox = ioLicense.numSandboxAddOnFlows > 0;
  }

  if (ioLicense.expires) {
    ioLicense.status =
      moment(ioLicense.expires) > moment() ? 'ACTIVE' : 'EXPIRED';

    if (ioLicense.status === 'ACTIVE') {
      ioLicense.expiresInDays = remainingDays(ioLicense.expires);
    }
  }

  if (
    ioLicense.trialEndDate &&
    (!ioLicense.expires || moment(ioLicense.trialEndDate) > moment())
  ) {
    ioLicense.status =
      moment(ioLicense.trialEndDate) > moment() ? 'IN_TRIAL' : 'TRIAL_EXPIRED';

    if (ioLicense.status === 'IN_TRIAL') {
      ioLicense.expiresInDays = remainingDays(ioLicense.trialEndDate);
    }
  }

  return ioLicense;
}
// #endregion INTEGRATOR LICENSE

export function sharedAccounts(state) {
  if (!state) {
    return [];
  }

  const accepted = state.filter(
    a => a._id !== 'own' && a.accepted && !a.disabled
  );
  const shared = [];

  accepted.forEach(a => {
    if (!a.ownerUser || !a.ownerUser.licenses) return;

    const ioLicense = a.ownerUser.licenses.find(l => l.type === 'integrator');
    const sandbox =
      ioLicense && (ioLicense.sandbox || ioLicense.numSandboxAddOnFlows > 0);

    shared.push({
      id: a._id,
      company: a.ownerUser.company,
      email: a.ownerUser.email,
      sandbox,
    });
  });

  return shared;
}

export function accountSummary(state) {
  const shared = sharedAccounts(state);
  const accounts = [];

  if (!shared || shared.length === 0) {
    const ownLicense = this.integratorLicense(state, 'own');

    if (ownLicense) {
      accounts.push({
        id: 'own',
        environment: 'production',
        label: 'Production',
      });

      if (ownLicense.sandbox) {
        accounts.push({
          id: 'own',
          environment: 'sandbox',
          label: 'Sandbox',
        });
      }
    }

    return accounts;
  }

  shared.forEach(a => {
    if (a.sandbox) {
      accounts.push({
        id: a.id,
        environment: 'production',
        label: `${a.company} - Production`,
        company: a.company,
        canLeave: shared.length > 1,
      });
      accounts.push({
        id: a.id,
        environment: 'sandbox',
        label: `${a.company} - Sandbox`,
        canLeave: false,
      });
    } else {
      accounts.push({
        id: a.id,
        environment: 'production',
        label: a.company,
        company: a.company,
        canLeave: shared.length > 1,
      });
    }
  });

  return accounts;
}

export function notifications(state) {
  const accounts = [];

  if (!state || !state.length) {
    return accounts;
  }

  const pending = state.filter(
    a =>
      a.ownerUser &&
      !a.accepted &&
      !a.dismissed &&
      !a.disabled &&
      a._id !== 'own'
  );

  pending.forEach(a => {
    const { name, email, company } = a.ownerUser;

    accounts.push({
      id: a._id,
      accessLevel: a.accessLevel,
      ownerUser: { name, email, company },
    });
  });

  return accounts;
}

// #endregion

import actionTypes from '../../../../actions/types';

export default (state = [], action) => {
  const { type, resourceType, collection } = action;

  switch (type) {
    case actionTypes.RESOURCE.RECEIVED_COLLECTION: {
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

        if (!ownAccounts) {
          return [...collection];
        }

        return [...ownAccounts, ...collection];
      }

      return state;
    }

    case actionTypes.TRIAL_LICENSE_ISSUED: {
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

// #region PUBLIC SELECTORS

export function sharedAccounts(state) {
  if (!state) {
    return null;
  }

  const accepted = state.filter(
    a => a._id !== 'own' && a.accepted && !a.disabled
  );
  const shared = [];

  accepted.forEach(a => {
    if (!a.ownerUser) return;

    const ioLicenses = a.ownerUser.licenses.find(l => l.type === 'integrator');
    const sandbox = ioLicenses && ioLicenses.sandbox;
    const accessLevel = a.accessLevel || 'monitor';

    shared.push({
      id: a._id,
      company: a.ownerUser.company,
      email: a.ownerUser.email,
      sandbox,
      accessLevel,
    });
  });

  return shared;
}

export function accountSummary(state) {
  const shared = sharedAccounts(state);

  if (!shared || shared.length === 0) {
    return [];
  }

  const accounts = [];

  shared.forEach(a => {
    if (a.sandbox) {
      accounts.push({
        id: a.id,
        environment: 'production',
        label: `${a.company} - Production`,
        accessLevel: a.accessLevel,
      });
      accounts.push({
        id: a.id,
        environment: 'sandbox',
        label: `${a.company} - Sandbox`,
        accessLevel: a.accessLevel,
      });
    } else {
      accounts.push({
        id: a.id,
        environment: 'production',
        label: a.company,
        accessLevel: a.accessLevel,
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
    a => !a.accepted && !a.dismissed && !a.disabled && a._id !== 'own'
  );

  pending.forEach(a => {
    accounts.push({
      id: a._id,
      label: a.ownerUser ? a.ownerUser.company || a.ownerUser.name : a._id,
      accessLevel: a.accessLevel,
    });
  });

  return accounts;
}

// #region INTEGRATOR LICENSE
export function integratorLicense(state, accountId) {
  if (!state) {
    return null;
  }

  const account = state.find(a => a._id === accountId);

  if (!account || !account.ownerUser || !account.ownerUser.licenses) {
    return null;
  }

  const ioLicenses = account.ownerUser.licenses.filter(
    l => l.type === 'integrator'
  );

  if (!ioLicenses.length) {
    return null;
  }

  if (!ioLicenses[0].sandbox) {
    ioLicenses[0].sandbox = ioLicenses[0].numSandboxAddOnFlows > 0;
  }

  return ioLicenses[0];
}
// #endregion INTEGRATOR LICENSE
// #endregion

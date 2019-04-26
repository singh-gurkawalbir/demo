import moment from 'moment';
import actionTypes from '../../../../actions/types';
import {
  ACCOUNT_IDS,
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
} from '../../../../utils/constants';

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
          _id: ACCOUNT_IDS.OWN,
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
          ownerUser: { licenses: [...collection] },
        };
        const sharedAccounts = state.filter(a => a._id !== ACCOUNT_IDS.OWN);

        return [ownAccount, ...sharedAccounts];
      } else if (resourceType === 'shared/ashares') {
        const ownAccounts = state.filter(a => a._id === ACCOUNT_IDS.OWN);

        if (!ownAccounts.length) {
          return [...collection];
        }

        return [...ownAccounts, ...collection];
      }

      return state;
    }

    case actionTypes.LICENSE_TRIAL_ISSUED: {
      const ownAccount = state.find(a => a._id === ACCOUNT_IDS.OWN);

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
        if (a._id === ACCOUNT_IDS.OWN) {
          return {
            ...a,
            ownerUser: { ...a.ownerUser, licenses: updatedLicenses },
          };
        }

        return a;
      });
    }

    case actionTypes.LICENSE_UPGRADE_REQUEST_SUBMITTED: {
      const ownAccount = state.find(a => a._id === ACCOUNT_IDS.OWN);

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
        if (a._id === ACCOUNT_IDS.OWN) {
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

  ioLicense.hasSandbox =
    ioLicense.sandbox || ioLicense.numSandboxAddOnFlows > 0;

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
    a => a._id !== ACCOUNT_IDS.OWN && a.accepted && !a.disabled
  );
  const shared = [];

  accepted.forEach(a => {
    if (!a.ownerUser || !a.ownerUser.licenses) return;

    const ioLicense = a.ownerUser.licenses.find(l => l.type === 'integrator');
    const hasSandbox =
      ioLicense && (ioLicense.sandbox || ioLicense.numSandboxAddOnFlows > 0);

    shared.push({
      id: a._id,
      company: a.ownerUser.company,
      email: a.ownerUser.email,
      hasSandbox,
    });
  });

  return shared;
}

export function accountSummary(state) {
  const shared = sharedAccounts(state);
  const accounts = [];

  if (!shared || shared.length === 0) {
    const ownLicense = this.integratorLicense(state, ACCOUNT_IDS.OWN);

    if (ownLicense) {
      accounts.push({
        id: ACCOUNT_IDS.OWN,
        environment: 'production',
      });

      if (ownLicense.hasSandbox) {
        accounts.push({
          id: ACCOUNT_IDS.OWN,
          environment: 'sandbox',
        });
      }
    }

    return accounts;
  }

  shared.forEach(a => {
    if (a.hasSandbox) {
      accounts.push({
        id: a.id,
        environment: 'production',
        company: a.company,
        canLeave: shared.length > 1,
      });
      accounts.push({
        id: a.id,
        environment: 'sandbox',
        company: a.company,
        canLeave: false,
      });
    } else {
      accounts.push({
        id: a.id,
        environment: 'production',
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
      a._id !== ACCOUNT_IDS.OWN
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

export function accessLevel(state, accountId) {
  if (accountId === ACCOUNT_IDS.OWN) {
    return USER_ACCESS_LEVELS.ACCOUNT_OWNER;
  }

  const account = state.find(a => a._id === accountId);

  if (!account) {
    return undefined;
  }

  return account.accessLevel || USER_ACCESS_LEVELS.TILE;
}

export function permissions(
  state,
  accountId,
  userPermissions = { allowedToPublish: false }
) {
  const allResourceTypes = [
    'accesstokens',
    'agents',
    'audits',
    'connections',
    'connectors',
    'integrations',
    'recyclebin',
    'scripts',
    'stacks',
    'subscriptions',
    'templates',
    'transfers',
    'users',
  ];
  const permissions = {};

  allResourceTypes.forEach(resourceType => {
    permissions[resourceType] = {};
  });
  const userAccessLevel = accessLevel(state, accountId);

  if (!userAccessLevel) {
    return Object.freeze(permissions);
  }

  permissions.accessLevel = userAccessLevel;

  const crudPermissions = ['view', 'create', 'edit', 'delete'];
  const resourcesAvailableForOwnerOnly = [
    'accesstokens',
    'audits',
    'connectors',
    'subscriptions',
    'templates',
    'transfers',
    'users',
  ];

  if (userAccessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER) {
    permissions.subscriptions.view = true;
    permissions.audits.view = true;

    resourcesAvailableForOwnerOnly.forEach(resourceType => {
      if (['audits', 'subscriptions', 'integrations'].includes(resourceType)) {
        return false;
      }

      if (['connectors', 'templates'].includes(resourceType)) {
        if (!userPermissions.allowedToPublish) {
          return false;
        }

        permissions[resourceType].publish = true;
      }

      crudPermissions.forEach(p => {
        permissions[resourceType][p] = true;
      });
    });
  }

  let resourceTypes;

  if (
    [
      USER_ACCESS_LEVELS.ACCOUNT_OWNER,
      USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
    ].includes(userAccessLevel)
  ) {
    resourceTypes = allResourceTypes.filter(
      resourceType =>
        !resourcesAvailableForOwnerOnly.includes(resourceType) &&
        resourceType !== 'integrations'
    );

    resourceTypes.forEach(resourceType => {
      crudPermissions.forEach(p => {
        permissions[resourceType][p] = true;
      });
    });

    permissions.subscriptions.requestUpgrade = true;

    permissions.recyclebin = {
      view: true,
      restore: true,
      download: true,
      purge: true,
    };
  }

  if (
    [
      USER_ACCESS_LEVELS.ACCOUNT_OWNER,
      USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
    ].includes(userAccessLevel)
  ) {
    permissions.integrations.create = true;
    permissions.integrations.install = true;

    permissions.integrations.none = {
      accessLevel: userAccessLevel,
      flows: {
        create: true,
        edit: true,
        delete: true,
        clone: true,
      },
      connections: {
        create: true,
        edit: true,
      },
    };
    permissions.integrations.all = {
      ...permissions.integrations.none,

      edit: true,
      delete: true,
      clone: true,
    };

    permissions.integrations.all.flows = {
      ...permissions.integrations.none.flows,

      attach: true,
      detach: true,
    };

    permissions.integrations.all.connections = {
      ...permissions.integrations.none.connections,

      register: true,
    };
  } else if (userAccessLevel === USER_ACCESS_LEVELS.ACCOUNT_MONITOR) {
    permissions.integrations.none = {
      accessLevel: userAccessLevel,
      flows: {},
      connections: {},
    };
    permissions.integrations.all = { ...permissions.integrations.none };
  } else if (userAccessLevel === USER_ACCESS_LEVELS.TILE) {
    const account = state.find(
      a => a._id === accountId && a.accepted && !a.disabled
    );
    let integration;

    if (
      account &&
      account.integrationAccessLevel &&
      account.integrationAccessLevel.length
    ) {
      account.integrationAccessLevel.forEach(ial => {
        integration = {
          accessLevel: ial.accessLevel,
          flows: {},
          connections: {},
        };

        if (ial.accessLevel === INTEGRATION_ACCESS_LEVELS.MANAGE) {
          integration.flows = {
            ...integration.flows,
            create: true,
            edit: true,
            delete: true,
            clone: true,
          };
          integration.connections = {
            ...integration.connections,

            create: true,
            edit: true,
            register: true,
          };
          integration = {
            ...integration,

            edit: true,
          };
        }

        permissions.integrations[ial._integrationId] = integration;
      });
    }
  }

  return Object.freeze(permissions);
}

// #endregion

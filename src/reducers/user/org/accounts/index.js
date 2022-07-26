import moment from 'moment';
import produce from 'immer';
import { cloneDeep } from 'lodash';
import { createSelector } from 'reselect';
import actionTypes from '../../../../actions/types';
import {
  ACCOUNT_IDS,
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  USAGE_TIER_NAMES,
  USAGE_TIER_HOURS,
} from '../../../../constants';

const emptyList = [];

const hasLicense = draft => {
  const ownAccount = draft.find(a => a._id === ACCOUNT_IDS.OWN);

  if (
    !ownAccount ||
    !ownAccount.ownerUser ||
    !ownAccount.ownerUser.licenses
  ) {
    return false;
  }

  const platformLicense = ownAccount.ownerUser.licenses.find(
    l => (l.type === 'integrator' || l.type === 'endpoint')
  );

  if (!platformLicense) {
    return false;
  }

  return true;
};

export default (state = [], action) => {
  const { type, resourceType } = action;
  let { collection } = action;

  return produce(state, draft => {
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
          const sharedAccounts = draft.filter(a => a._id !== ACCOUNT_IDS.OWN);

          return [ownAccount, ...sharedAccounts];
        }
        if (resourceType === 'shared/ashares') {
          const ownAccounts = draft.filter(a => a._id === ACCOUNT_IDS.OWN);

          if (!ownAccounts.length) {
            return [...collection];
          }

          return [...ownAccounts, ...collection];
        }

        break;
      }

      case actionTypes.LICENSE.TRIAL_ISSUED: {
        if (!hasLicense(draft)) {
          break;
        }

        const { trialEndDate, tier } = action;
        const index = draft.findIndex(a => a._id === ACCOUNT_IDS.OWN);
        const licenseIndex = draft[index].ownerUser.licenses.findIndex(l => l.type === 'integrator' || l.type === 'endpoint');

        draft[index].ownerUser.licenses[licenseIndex].trialEndDate = trialEndDate;
        draft[index].ownerUser.licenses[licenseIndex].tier = tier;
        draft[index].ownerUser.licenses[licenseIndex].trialStarted = true;
        break;
      }

      case actionTypes.LICENSE.UPGRADE_REQUEST_SUBMITTED: {
        if (!hasLicense(draft)) {
          break;
        }

        const index = draft.findIndex(a => a._id === ACCOUNT_IDS.OWN);
        const licenseIndex = draft[index].ownerUser.licenses.findIndex(l => l.type === 'integrator' || l.type === 'endpoint');

        draft[index].ownerUser.licenses[licenseIndex].upgradeRequested = true;

        break;
      }

      default:
    }
  });
};

export const remainingDays = date => Math.ceil((moment(date).milliseconds(0) - moment().milliseconds(0)) / 1000 / 60 / 60 / 24);

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.platformLicense = (state, accountId) => {
  if (!state) {
    return null;
  }

  const account = state.find(a => a._id === accountId);

  if (!account || !account.ownerUser || !account.ownerUser.licenses) {
    return null;
  }

  const ioLicense = cloneDeep(account.ownerUser.licenses.find(
    l => (['integrator', 'endpoint', 'diy'].includes(l.type))
  ));

  if (!ioLicense) {
    return null;
  }
  if (ioLicense.type === 'diy') {
    ioLicense.usageTierName = USAGE_TIER_NAMES[ioLicense.usageTier || 'free'];

    ioLicense.inTrial = false;

    if (ioLicense.tier === 'free') {
      if (ioLicense.trialEndDate) {
        ioLicense.inTrial = moment(ioLicense.trialEndDate) - moment() >= 0;
      }
    }

    ioLicense.hasSubscription = false;

    if (['none', 'free'].indexOf(ioLicense.tier) === -1) {
      ioLicense.hasSubscription = true;
    } else if (ioLicense.tier === 'free' && !ioLicense.inTrial) {
      if (
        ioLicense.numAddOnFlows > 0 ||
      ioLicense.sandbox ||
      ioLicense.numSandboxAddOnFlows > 0
      ) {
        ioLicense.hasSubscription = true;
      }
    }

    ioLicense.isFreemium =
  ioLicense.tier === 'free' &&
    !ioLicense.hasSubscription &&
    !ioLicense.inTrial;
    ioLicense.expirationDate = ioLicense.expires;

    if (ioLicense.inTrial) {
      ioLicense.expirationDate = ioLicense.trialEndDate;
    } else if (ioLicense.isFreemium) {
      ioLicense.expirationDate = '';
    }

    if (ioLicense.expirationDate) {
      ioLicense.expirationDate = moment(ioLicense.expirationDate).format(
        'MMM Do, YYYY'
      );
    }

    if (!ioLicense.currentUsage) {
      ioLicense.currentUsage = {};
    }

    ioLicense.usageTierHours = USAGE_TIER_HOURS[ioLicense.usageTier || 'free'];

    if (!ioLicense.currentUsage.milliseconds) {
      ioLicense.currentUsage.milliseconds = 0;
    }

    ioLicense.currentUsage.usagePercent = Math.round(
      (ioLicense.currentUsage.milliseconds /
      (ioLicense.usageTierHours * 60 * 60 * 1000)) *
      100
    );
    ioLicense.currentUsage.usedHours = Math.round(
      ioLicense.currentUsage.milliseconds / 1000 / 60 / 60
    );
  } else {
    ioLicense.hasSSO = ioLicense.tier === 'free' ? true : !!ioLicense.sso;
    ioLicense.hasSandbox =
    ioLicense.sandbox || ioLicense.numSandboxAddOnFlows > 0;

    ioLicense.hasConnectorSandbox =
    account.ownerUser.licenses.filter(l => l.type === 'connector' && l.sandbox)
      .length > 0;

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
    if (ioLicense.type === 'endpoint') {
      ioLicense.totalNumberofProductionEndpoints = ioLicense?.endpoint?.production?.numEndpoints + ioLicense?.endpoint?.production?.numAddOnEndpoints;
      ioLicense.totalNumberofProductionFlows = ioLicense?.endpoint?.production?.numFlows + ioLicense?.endpoint?.production?.numAddOnFlows;
      ioLicense.totalNumberofProductionTradingPartners = ioLicense?.endpoint?.production?.numTradingPartners + ioLicense?.endpoint?.production?.numAddOnTradingPartners;
      ioLicense.totalNumberofProductionAgents = ioLicense?.endpoint?.production?.numAgents + ioLicense?.endpoint?.production?.numAddOnAgents;

      ioLicense.totalNumberofSandboxEndpoints = ioLicense?.endpoint?.sandbox?.numEndpoints + ioLicense?.endpoint?.sandbox?.numAddOnEndpoints;
      ioLicense.totalNumberofSandboxFlows = ioLicense?.endpoint?.sandbox?.numFlows + ioLicense?.endpoint?.sandbox?.numAddOnFlows;
      ioLicense.totalNumberofSandboxTradingPartners = ioLicense?.endpoint?.sandbox?.numTradingPartners + ioLicense?.endpoint?.sandbox?.numAddOnTradingPartners;
      ioLicense.totalNumberofSandboxAgents = ioLicense?.endpoint?.sandbox?.numAgents + ioLicense?.endpoint?.sandbox?.numAddOnAgents;
      ioLicense.hasSandbox = ioLicense.sandbox || ioLicense.totalNumberofSandboxFlows > 0;

      ioLicense.totalNumberofEndpoints = ioLicense.totalNumberofProductionEndpoints + ioLicense.totalNumberofSandboxEndpoints;
      ioLicense.totalNumberofFlows = ioLicense.totalNumberofProductionFlows + ioLicense.totalNumberofSandboxFlows;
      ioLicense.totalNumberofTradingPartners = ioLicense.totalNumberofProductionTradingPartners + ioLicense.totalNumberofSandboxTradingPartners;
      ioLicense.totalNumberofAgents = ioLicense.totalNumberofProductionAgents + ioLicense.totalNumberofSandboxAgents;
    }
  }

  return ioLicense;
};
// #endregion INTEGRATOR LICENSE

selectors.licenses = (state, accountId = ACCOUNT_IDS.OWN) => {
  if (!state) {
    return emptyList;
  }

  const licenses = emptyList;
  const account = state.find(acc => acc._id === accountId);

  return account ? account.ownerUser.licenses : licenses;
};

selectors.sharedAccounts = createSelector(
  state => state,
  state => {
    if (!state) {
      return emptyList;
    }

    const accepted = state.filter(
      a => a._id !== ACCOUNT_IDS.OWN && a.accepted && !a.disabled
    );
    const shared = [];

    accepted.forEach(a => {
      if (!a.ownerUser || !a.ownerUser.licenses) return;

      const ioLicense = a.ownerUser.licenses.find(l => (l.type === 'integrator' || l.type === 'endpoint'));

      shared.push({
        id: a._id,
        company: a.ownerUser.company,
        email: a.ownerUser.email,
        hasSandbox:
          ioLicense &&
          (ioLicense.sandbox || ioLicense.numSandboxAddOnFlows > 0),
        hasSSO: ioLicense?.sso,
        hasConnectorSandbox:
          a.ownerUser.licenses.filter(l => l.type === 'connector' && l.sandbox)
            .length > 0,
      });
    });

    return shared;
  }
);
// TODO: Santosh platformLicense selector implementation should be lazily created
// can remove this selector after implementation
selectors.ownLicense = createSelector(
  state => state,
  state => selectors.platformLicense(state, ACCOUNT_IDS.OWN)
);

selectors.accountSummary = createSelector(
  selectors.sharedAccounts,
  selectors.ownLicense,
  (shared, ownLicense) => {
    const accounts = [];

    if (!shared || shared.length === 0) {
      if (ownLicense) {
        accounts.push({
          id: ACCOUNT_IDS.OWN,
          hasSandbox: !!ownLicense.hasSandbox,
          hasConnectorSandbox: !!ownLicense.hasConnectorSandbox,
          hasSSO: !!ownLicense.hasSSO,
        });
      }

      return accounts;
    }

    shared.forEach(a => {
      accounts.push({
        id: a.id,
        company: a.company,
        canLeave: shared.length > 1,
        hasSandbox: !!a.hasSandbox,
        hasSSO: !!a.hasSSO,
        hasConnectorSandbox: !!a.hasConnectorSandbox,
      });
    });

    return accounts;
  }
);

selectors.notifications = createSelector(
  state => state,
  state => {
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
);

selectors.accessLevel = (state, accountId) => {
  if (!state) {
    return undefined;
  }

  if (accountId === ACCOUNT_IDS.OWN) {
    return USER_ACCESS_LEVELS.ACCOUNT_OWNER;
  }

  const account = state.find(a => a._id === accountId);

  if (!account) {
    return undefined;
  }

  if (
    account.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_MONITOR &&
    account.integrationAccessLevel &&
    account.integrationAccessLevel.length > 0
  ) {
    return USER_ACCESS_LEVELS.TILE;
  }

  return account.accessLevel || USER_ACCESS_LEVELS.TILE;
};

selectors.owner = (state, accountId) => {
  if (!state) {
    return undefined;
  }

  const account = state.find(a => a._id === accountId);

  if (!account) {
    return undefined;
  }

  return account.ownerUser;
};

selectors.permissions = (
  state,
  accountId,
  userPermissions = { allowedToPublish: false }
) => {
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
    'exports',
    'imports',
    'apis',
    'eventreports',
  ];
  const permissions = {};

  allResourceTypes.forEach(resourceType => {
    permissions[resourceType] = {};
  });
  const userAccessLevel = selectors.accessLevel(state, accountId);

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

  if ([USER_ACCESS_LEVELS.ACCOUNT_OWNER, USER_ACCESS_LEVELS.ACCOUNT_ADMIN].includes(userAccessLevel)) {
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
      USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
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
      USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
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
    permissions.integrations.connectors = {
      accessLevel: userAccessLevel,
      flows: {
        edit: true,
      },
      connections: {
        edit: true,
        create: true,
      },
      edit: true,
      delete: true,
    };
  } else if (userAccessLevel === USER_ACCESS_LEVELS.ACCOUNT_MONITOR) {
    permissions.integrations.none = {
      accessLevel: userAccessLevel,
      flows: {},
      connections: {},
    };
    permissions.integrations.all = { ...permissions.integrations.none };
    permissions.integrations.connectors = {
      ...permissions.integrations.none,
    };
  } else if (userAccessLevel === USER_ACCESS_LEVELS.TILE) {
    const account = state.find(a => a._id === accountId);
    let integration;

    if (account && account.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_MONITOR) {
      permissions.integrations.none = {
        accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
        flows: {},
        connections: {},
      };
      permissions.integrations.all = { ...permissions.integrations.none };
      permissions.integrations.connectors = {
        ...permissions.integrations.none,
      };
    }

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
};

selectors.isAccountSSORequired = (state, accountId) => {
  const account = state?.find(a => a._id === accountId);

  return !!account?.accountSSORequired;
};
// #endregion

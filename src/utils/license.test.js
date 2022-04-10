/* global describe, test, expect */
import moment from 'moment';
import { selectors } from '../reducers';
import { ACCOUNT_IDS, USER_ACCESS_LEVELS } from './constants';

const { upgradeStatus, upgradeButtonText, expiresInfo, platformLicenseActionDetails } = require('./license');

const getRandomDatesOfToday = (n = 5) => {
  const dates = [];
  const now = +moment().add(1, 'minute').format('x');
  const endOfToday = +moment().endOf('day').format('x');

  for (let i = 0; i < n; i += 1) {
    dates.push(moment(Math.floor(Math.random() * (endOfToday - now)) + now).toISOString());
  }

  return dates;
};

const getRandomDatesOfTomorrow = (n = 5) => {
  const dates = [];
  const startofTomorrow = +moment().add(1, 'days').format('x');
  const endOfTomorrow = moment().add(1, 'days').endOf('day').format('x');

  for (let i = 0; i < n; i += 1) {
    dates.push(moment(Math.floor(Math.random() * (endOfTomorrow - startofTomorrow)) + startofTomorrow).toISOString());
  }

  return dates;
};

describe('license util function test', () => {
  describe('upgradeStatus function test', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(upgradeStatus()).toEqual('');
      expect(upgradeStatus([])).toEqual('');
      expect(upgradeStatus([], [])).toEqual('');
      expect(upgradeStatus(123, [])).toEqual('');
      expect(upgradeStatus(null, {})).toEqual('');
      expect(upgradeStatus(null, [])).toEqual('');
      expect(upgradeStatus({}, {})).toEqual('');
      expect(upgradeStatus(new Date(), new Date())).toEqual('');
    });

    test('should return always return empty string for custom fba licensed integration', () => {
      expect(upgradeStatus({}, { settings: {connectorEdition: 'Custom FBA'}})).toEqual('');
      expect(upgradeStatus({
        opts: {
          connectorEdition: 'starter',
        },
      }, {
        _connectorId: 'dummy',
        name: 'Zendesk - NetSuite Connector',
        settings: {
          connectorEdition: 'Custom FBA',
        },
      }
      )).toEqual('');
    });

    test('should return correct upgrade status for upgradable licenses', () => {
      expect(upgradeStatus({
        opts: {connectorEdition: 'standard'},
      }, {
        _connectorId: 'dummy',
        name: 'Zendesk - NetSuite Connector',
        settings: {
          connectorEdition: 'starter',
        },
      })).toEqual('upgrade');
    });

    test('should return correct upgrade status for license and highest edition are same', () => {
      expect(upgradeStatus({
        opts: {connectorEdition: 'standard'},
      }, {
        _connectorId: 'dummy',
        name: 'Zendesk - NetSuite Connector',
        settings: {
          connectorEdition: 'standard',
        },
      })).toEqual('');
    });

    test('should return correct upgrade status for license and installed edition are same and highest edition is available', () => {
      expect(upgradeStatus({
        opts: {connectorEdition: 'starter'},
      }, {
        _connectorId: 'dummy',
        name: 'Zendesk - NetSuite Connector',
        settings: {
          connectorEdition: 'starter',
        },
      })).toEqual('requestUpgrade');
    });

    test('should return correct upgrade status for license and installed edition and highest edition are same', () => {
      expect(upgradeStatus({
        opts: {connectorEdition: 'standard'},
      }, {
        _connectorId: 'dummy',
        name: 'Zendesk - NetSuite Connector',
        settings: {
          connectorEdition: 'standard',
        },
      })).toEqual('');
    });
  });
  describe('upgradeButtonText function test', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(upgradeButtonText()).toEqual('');
      expect(upgradeButtonText([])).toEqual('');
      expect(upgradeButtonText([], [])).toEqual('');
      expect(upgradeButtonText(123, [])).toEqual('');
      expect(upgradeButtonText(null, {})).toEqual('');
      expect(upgradeButtonText(null, [])).toEqual('');
      expect(upgradeButtonText({}, {})).toEqual('');
      expect(upgradeButtonText(new Date(), new Date())).toEqual('');
      expect(upgradeButtonText(undefined, null, null)).toEqual('');
      expect(upgradeButtonText([], null, 123)).toEqual('Upgrade requested');
      expect(upgradeButtonText([], [], [])).toEqual('Upgrade requested');
      expect(upgradeButtonText(123, [], {})).toEqual('Upgrade requested');
      expect(upgradeButtonText(null, {}, null)).toEqual('');
      expect(upgradeButtonText(null, [], 'string')).toEqual('Upgrade requested');
      expect(upgradeButtonText({}, {}, null)).toEqual('');
      expect(upgradeButtonText(new Date(), new Date(), new Date())).toEqual('Upgrade requested');
    });

    test('should return always return empty string for custom fba licensed integration', () => {
      expect(upgradeButtonText({}, { settings: {connectorEdition: 'Custom FBA'}})).toEqual('');
      expect(upgradeButtonText({
        opts: {
          connectorEdition: 'starter',
        },
      }, {
        _connectorId: 'dummy',
        name: 'Zendesk - NetSuite Connector',
        settings: {
          connectorEdition: 'Custom FBA',
        },
      }
      )).toEqual('');
    });

    test('should return correct upgrade status for upgradable licenses', () => {
      expect(upgradeButtonText({
        opts: {connectorEdition: 'standard'},
      }, {
        _connectorId: 'dummy',
        name: 'Zendesk - NetSuite Connector',
        settings: {
          connectorEdition: 'starter',
        },
      })).toEqual('Upgrade');
    });

    test('should return correct upgrade status for license and highest edition are same', () => {
      expect(upgradeButtonText({
        opts: {connectorEdition: 'standard'},
      }, {
        _connectorId: 'dummy',
        name: 'Zendesk - NetSuite Connector',
        settings: {
          connectorEdition: 'standard',
        },
      })).toEqual('');
    });

    test('should return correct upgrade status for license and installed edition are same and highest edition is available', () => {
      expect(upgradeButtonText({
        opts: {connectorEdition: 'starter'},
      }, {
        _connectorId: 'dummy',
        name: 'Zendesk - NetSuite Connector',
        settings: {
          connectorEdition: 'starter',
        },
      })).toEqual('Request upgrade');
    });

    test('should return correct upgrade status for license and installed edition and highest edition are same', () => {
      expect(upgradeButtonText({
        opts: {connectorEdition: 'standard'},
      }, {
        _connectorId: 'dummy',
        name: 'Zendesk - NetSuite Connector',
        settings: {
          connectorEdition: 'standard',
        },
      })).toEqual('');
    });
  });

  describe('expiresInfo function test', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(expiresInfo()).toEqual('');
      expect(expiresInfo([])).toEqual('');
      expect(expiresInfo('string')).toEqual('');
      expect(expiresInfo(123)).toEqual('');
      expect(expiresInfo(null)).toEqual('');
      expect(expiresInfo({})).toEqual('');
      expect(expiresInfo(new Date())).toEqual('');
    });

    test('should return empty string when license doesnt have expires', () => {
      expect(expiresInfo({expires: undefined})).toEqual('');
      expect(expiresInfo({dummy: 'data'})).toEqual('');
    });

    test('should return correct expires info for past dates', () => {
      const dates = [
        {
          test: moment(new Date()).subtract(20, 'minutes').toISOString(),
          result: `Expired on ${moment(new Date()).subtract(20, 'minutes').format('MMM Do, YYYY')}`,
        },
        {
          test: moment(new Date()).subtract(20, 'days').toISOString(),
          result: `Expired on ${moment(new Date()).subtract(20, 'days').format('MMM Do, YYYY')}`,
        },
        {
          test: moment(new Date()).subtract(2, 'hours').toISOString(),
          result: `Expired on ${moment(new Date()).subtract(2, 'hours').format('MMM Do, YYYY')}`,
        },
        {
          test: moment(new Date()).subtract(2, 'months').toISOString(),
          result: `Expired on ${moment(new Date()).subtract(2, 'months').format('MMM Do, YYYY')}`,
        },
      ];

      dates.forEach(data => {
        expect(expiresInfo({expires: data.test})).toEqual(data.result);
      });
    });

    test('should return correct expires info for future dates', () => {
      const dates = [
        {
          test: moment(new Date()).add(20, 'days').toISOString(),
          result: `Expires on ${moment(new Date()).add(20, 'days').format('MMM Do, YYYY')} (20 Days)`,
        },
        {
          test: moment(new Date()).add(29, 'days').toISOString(),
          result: `Expires on ${moment(new Date()).add(29, 'days').format('MMM Do, YYYY')} (29 Days)`,
        },
        {
          test: moment(new Date()).add(10, 'days').toISOString(),
          result: `Expires on ${moment(new Date()).add(10, 'days').format('MMM Do, YYYY')} (10 Days)`,
        },
        {
          test: moment(new Date()).add(2, 'years').toISOString(),
          result: `Expires on ${moment(new Date()).add(2, 'years').format('MMM Do, YYYY')}`,
        },
        {
          test: moment(new Date()).add(2, 'months').toISOString(),
          result: `Expires on ${moment(new Date()).add(2, 'months').format('MMM Do, YYYY')}`,
        },
      ];

      dates.forEach(data => {
        expect(expiresInfo({expires: data.test})).toEqual(data.result);
      });
    });

    test('should return correct expires info for less than 24 hours', () => {
      const dates = getRandomDatesOfToday(10);

      dates.forEach(date => {
        expect(expiresInfo({expires: date})).toEqual(`Expires on ${moment().format('MMM Do, YYYY')} (Today)`);
      });
    });

    test('should return correct expires info for tomorrow', () => {
      const dates = getRandomDatesOfTomorrow(10);

      dates.forEach(date => {
        expect(expiresInfo({expires: date})).toEqual(`Expires on ${moment().add(1, 'days').format('MMM Do, YYYY')} (Tomorrow)`);
      });
    });
  });
});

describe('platformLicenseActionDetails function test', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(platformLicenseActionDetails(undefined)).toEqual({});
  });
  test('should return correct number of trial days left for trial license', () => {
    const state =
      {
        user: {
          profile: {},
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
          org: {
            accounts: [
              {
                _id: ACCOUNT_IDS.OWN,
                accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
                ownerUser: {
                  licenses: [{
                    _id: 'license1',
                    type: 'integrator',
                    tier: 'free',
                    trialEndDate: moment()
                      .add(10, 'days')
                      .toISOString(),
                  }],
                },
              },
            ],
            users: [],
          },
        },
      };
    const expected = {
      action: 'upgrade',
      expiresSoon: false,
      label: 'Request upgrade now -',
      daysLeft: '10 days left',
    };
    const license = selectors.platformLicense(state);

    expect(platformLicenseActionDetails(license)).toEqual(expected);
  });
  test('should return upgrade now for trial license expired account', () => {
    const state =
      {
        user: {
          profile: {},
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
          org: {
            accounts: [
              {
                _id: ACCOUNT_IDS.OWN,
                accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
                ownerUser: {
                  licenses: [{
                    _id: 'license1',
                    type: 'integrator',
                    tier: 'free',
                    trialEndDate: moment()
                      .subtract(2, 'days')
                      .toISOString(),
                  },
                  ],
                },
              },
            ],
            users: [],
          },
        },
      };
    const expected = {
      action: 'upgrade',
      label: 'Request Upgrade now',
    };
    const license = selectors.platformLicense(state);

    expect(platformLicenseActionDetails(license)).toEqual(expected);
  });
  test('should return empty for valid license account', () => {
    const state =
      {
        user: {
          profile: {},
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
          org: {
            accounts: [
              {
                _id: ACCOUNT_IDS.OWN,
                accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
                ownerUser: {
                  licenses: [{
                    _id: 'license1',
                    type: 'integrator',
                    tier: 'standard',
                    expires: moment()
                      .add(60, 'days')
                      .toISOString(),
                  },
                  ],
                },
              },
            ],
            users: [],
          },
        },
      };
    const license = selectors.platformLicense(state);

    expect(platformLicenseActionDetails(license)).toEqual({});
  });
  test('should return action expired for license expired account', () => {
    const state =
      {
        user: {
          profile: {},
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
          org: {
            accounts: [
              {
                _id: ACCOUNT_IDS.OWN,
                accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
                ownerUser: {
                  licenses: [
                    {
                      _id: 'license1',
                      type: 'integrator',
                      tier: 'standard',
                      expires: moment()
                        .subtract(1, 'days')
                        .toISOString(),
                    },
                  ],
                },
              },
            ],
            users: [],
          },
        },
      };
    const expected = {
      action: 'expired',
    };
    const license = selectors.platformLicense(state);

    expect(platformLicenseActionDetails(license)).toEqual(expected);
  });
  test('should return empty for invalid license or no license account', () => {
    const state =
      {
        user: {
          profile: {},
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
          org: {
            accounts: [
              {
                _id: ACCOUNT_IDS.OWN,
                accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
                ownerUser: {
                  licenses: [
                  ],
                },
              },
            ],
            users: [],
          },
        },
      };
    const license = selectors.platformLicense(state);

    expect(platformLicenseActionDetails(license)).toEqual({});
  });
  test('should return action resume for resumable license account', () => {
    const state =
      {
        user: {
          profile: {},
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
          org: {
            accounts: [
              {
                _id: ACCOUNT_IDS.OWN,
                accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
                ownerUser: {
                  licenses: [
                    {
                      _id: 'license1',
                      type: 'integrator',
                      tier: 'free',
                      expires: moment()
                        .add(5, 'days')
                        .toISOString(),
                      resumable: true,
                    },
                  ],
                },
              },
            ],
            users: [],
          },
        },
      };
    const expected = {
      action: 'resume',
    };
    const license = selectors.platformLicense(state);

    expect(platformLicenseActionDetails(license)).toEqual(expected);
  });
  test('should return action startTrial for integrator type with no expiry', () => {
    const state =
      {
        user: {
          profile: {},
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
          org: {
            accounts: [
              {
                _id: ACCOUNT_IDS.OWN,
                accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
                ownerUser: {
                  licenses: [
                    {
                      _id: 'license1',
                      type: 'integrator',
                      tier: 'free',
                    },
                  ],
                },
              },
            ],
            users: [],
          },
        },
      };
    const expected = {
      action: 'startTrial',
      label: 'Get unlimited flows',
    };
    const license = selectors.platformLicense(state);

    expect(platformLicenseActionDetails(license)).toEqual(expected);
  });
});

/* global describe, test, expect */
import actions from '../../actions';
import { ACCOUNT_IDS } from '../../utils/constants';
import reducer, { selectors, DEFAULT_EDITOR_THEME } from '.';

describe('user selectors', () => {
  describe('accountOwner', () => {
    test('should return correct account owner info for an org owner', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
        },
        'some action'
      );

      expect(selectors.accountOwner(state)).toEqual({
        email: 'something@test.com',
        name: 'First Last',
      });
    });
    test('should return correct account owner info for an org user', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                _id: 'ashare1',
                ownerUser: {
                  email: 'owner@test.com',
                  name: 'owner 1',
                },
              },
              {
                _id: 'ashare2',
                ownerUser: {
                  email: 'owner2@test.com',
                  name: 'owner 2',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.accountOwner(state)).toEqual({
        email: 'owner@test.com',
        name: 'owner 1',
      });
    });
  });
  describe('userTimezone', () => {
    test('should return correct user time zone for an org owner', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', timezone: 'Asia/Calcutta' },
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
        },
        'some action'
      );

      expect(selectors.userTimezone(state)).toEqual('Asia/Calcutta');
    });
    test('should return correct user time zone info for an org user', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', timezone: 'Asia/Calcutta' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                _id: 'ashare1',
                ownerUser: {
                  email: 'owner@test.com',
                  name: 'owner 1',
                  timezone: 'America/LosAngeles',
                },
              },
              {
                _id: 'ashare2',
                ownerUser: {
                  email: 'owner2@test.com',
                  name: 'owner 2',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.userTimezone(state)).toEqual('Asia/Calcutta');
    });

    test('should return owner user time zone info for an org user when user doesnt have timezone set', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                _id: 'ashare1',
                ownerUser: {
                  email: 'owner@test.com',
                  name: 'owner 1',
                  timezone: 'America/LosAngeles',
                },
              },
              {
                _id: 'ashare2',
                ownerUser: {
                  email: 'owner2@test.com',
                  name: 'owner 2',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.userTimezone(state)).toEqual('America/LosAngeles');
    });
  });
  describe('accountSummary', () => {
    test('should return [] if state is undefined', () => {
      const state = reducer(undefined, 'some action');

      expect(selectors.accountSummary(state)).toEqual([]);
    });
    describe('should return correct account summary for owner', () => {
      test('should return correct summary when the license has sandbox subscription', () => {
        const state = reducer(
          {
            preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
            org: {
              accounts: [
                {
                  _id: ACCOUNT_IDS.OWN,
                  ownerUser: {
                    licenses: [
                      { _id: 'license1', type: 'integrator', sandbox: true },
                    ],
                  },
                },
              ],
            },
          },
          'some action'
        );

        expect(selectors.accountSummary(state)).toEqual([
          {
            id: ACCOUNT_IDS.OWN,
            hasSandbox: true,
            selected: true,
            hasConnectorSandbox: false,
          },
        ]);
      });
      test('should return correct summary when the license has sandbox subscription and environment is sandbox', () => {
        const state = reducer(
          {
            preferences: {
              defaultAShareId: ACCOUNT_IDS.OWN,
              environment: 'sandbox',
            },
            org: {
              accounts: [
                {
                  _id: ACCOUNT_IDS.OWN,
                  ownerUser: {
                    licenses: [
                      { _id: 'license1', type: 'integrator', sandbox: true },
                    ],
                  },
                },
              ],
            },
          },
          'some action'
        );

        expect(selectors.accountSummary(state)).toEqual([
          {
            id: ACCOUNT_IDS.OWN,
            hasSandbox: true,
            selected: true,
            hasConnectorSandbox: false,
          },
        ]);
      });
      test('should return correct summary when the license has no sandbox subscription', () => {
        const state = reducer(
          {
            preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
            org: {
              accounts: [
                {
                  _id: ACCOUNT_IDS.OWN,
                  ownerUser: {
                    licenses: [{ _id: 'license1', type: 'integrator' }],
                  },
                },
              ],
            },
          },
          'some action'
        );

        expect(selectors.accountSummary(state)).toEqual([
          {
            id: ACCOUNT_IDS.OWN,
            hasSandbox: false,
            selected: true,
            hasConnectorSandbox: false,
          },
        ]);
      });
    });
    describe('should return correct account summary for org user', () => {
      test('should return correct summary when no environment set', () => {
        const state = reducer(
          {
            preferences: { defaultAShareId: 'ashare1' },
            org: {
              accounts: [
                {
                  _id: 'ashare1',
                  accepted: true,
                  ownerUser: {
                    company: 'Company One',
                    licenses: [
                      { _id: 'license1', type: 'integrator', sandbox: true },
                    ],
                  },
                },
                {
                  _id: 'ashare2',
                  accepted: true,
                  ownerUser: {
                    name: 'Owner Two',
                    licenses: [{ _id: 'license1', type: 'integrator' }],
                  },
                },
              ],
            },
          },
          'some action'
        );

        expect(selectors.accountSummary(state)).toEqual([
          {
            id: 'ashare1',
            hasSandbox: true,
            company: 'Company One',
            canLeave: true,
            selected: true,
            hasConnectorSandbox: false,
          },
          {
            id: 'ashare2',
            hasSandbox: false,
            canLeave: true,
            hasConnectorSandbox: false,
          },
        ]);
      });
      test('should return correct summary when environment is sandbox', () => {
        const state = reducer(
          {
            preferences: { defaultAShareId: 'ashare2', environment: 'sandbox' },
            org: {
              accounts: [
                {
                  _id: 'ashare1',
                  accepted: true,
                  ownerUser: {
                    company: 'Company One',
                    licenses: [
                      { _id: 'license1', type: 'integrator', sandbox: true },
                    ],
                  },
                },
                {
                  _id: 'ashare2',
                  accepted: true,
                  ownerUser: {
                    name: 'Owner Two',
                    licenses: [{ _id: 'license1', type: 'integrator' }],
                  },
                },
              ],
            },
          },
          'some action'
        );

        expect(selectors.accountSummary(state)).toEqual([
          {
            id: 'ashare1',
            hasSandbox: true,
            company: 'Company One',
            canLeave: true,
            hasConnectorSandbox: false,
          },
          {
            id: 'ashare2',
            hasSandbox: false,
            selected: true,
            canLeave: true,
            hasConnectorSandbox: false,
          },
        ]);
      });
    });
  });

  describe('user theme selectors', () => {
    test('should return default theme if no profile exists', () => {
      expect(selectors.appTheme(undefined)).toEqual(selectors.DEFAULT_THEME);
    });

    test('should return correct theme when set.', () => {
      const theme = 'my theme';
      const state = reducer(
        undefined,
        actions.user.preferences.update({ themeName: theme })
      );

      expect(selectors.appTheme(state)).toEqual(theme);
    });
  });

  describe('editor theme selector', () => {
    test('should return default editor theme if no state exists', () => {
      expect(selectors.editorTheme(undefined)).toEqual(DEFAULT_EDITOR_THEME);
    });

    test('should return default editor theme when user theme set to unknown type.', () => {
      const themeName = 'unknown';
      const state = reducer(
        undefined,
        actions.user.preferences.update({ themeName })
      );

      expect(selectors.editorTheme(state)).toEqual(DEFAULT_EDITOR_THEME);
    });

    test('should return correct editor theme when user theme set.', () => {
      const themeName = 'dark';
      const state = reducer(
        undefined,
        actions.user.preferences.update({ themeName })
      );

      expect(selectors.editorTheme(state)).not.toEqual(DEFAULT_EDITOR_THEME);
    });
  });
  describe('User preferences selector', () => {
    test('should return empty object if no state exists', () => {
      expect(selectors.userPreferences(undefined)).toEqual({});
    });
    test('should return correct user preferences for an org user', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                _id: 'ashare1',
                ownerUser: {
                  email: 'owner@test.com',
                  name: 'owner 1',
                },
              },
              {
                _id: 'ashare2',
                ownerUser: {
                  email: 'owner2@test.com',
                  name: 'owner 2',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.userPreferences(state)).toEqual({
        defaultAShareId: 'ashare1',
      });
    });
    test('should return correct user preferences info for an org owner', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
        },
        'some action'
      );

      expect(selectors.userPreferences(state)).toEqual({
        defaultAShareId: ACCOUNT_IDS.OWN,
      });
    });
  });
  describe('Owner user selector', () => {
    test('should return undefined if no state exists', () => {
      expect(selectors.ownerUser(undefined)).toEqual(undefined);
    });
    test('should return correct owner user for an org user', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                _id: 'ashare1',
                ownerUser: {
                  _id: 'owner1',
                  email: 'owner@test.com',
                  name: 'owner 1',
                },
              },
              {
                _id: 'ashare2',
                ownerUser: {
                  _id: 'owner2',
                  email: 'owner2@test.com',
                  name: 'owner 2',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.ownerUser(state)).toEqual({
        _id: 'owner1',
        email: 'owner@test.com',
        name: 'owner 1',
      });
    });
    test('should return correct owner user id info for an org owner', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', _id: 'owner' },
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
        },
        'some action'
      );

      expect(selectors.ownerUser(state)).toEqual({ email: 'something@test.com', name: 'First Last', _id: 'owner' });
    });
    test('should return correct owner user id info for an org owner when there are no preferences', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', _id: 'owner' },
        },
        'some action'
      );

      expect(selectors.ownerUser(state)).toEqual({ email: 'something@test.com', name: 'First Last', _id: 'owner' });
    });
  });

  describe('Owner user id selector', () => {
    test('should return undefined if no state exists', () => {
      expect(selectors.ownerUserId(undefined)).toEqual(undefined);
    });
    test('should return correct owner user id for an org user', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                _id: 'ashare1',
                ownerUser: {
                  _id: 'owner1',
                  email: 'owner@test.com',
                  name: 'owner 1',
                },
              },
              {
                _id: 'ashare2',
                ownerUser: {
                  _id: 'owner2',
                  email: 'owner2@test.com',
                  name: 'owner 2',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.ownerUserId(state)).toEqual('owner1');
    });
    test('should return correct owner user id info for an org owner', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', _id: 'owner' },
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
        },
        'some action'
      );

      expect(selectors.ownerUserId(state)).toEqual('owner');
    });
    test('should return correct owner user id info for an org owner when there are no preferences', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', _id: 'owner' },
        },
        'some action'
      );

      expect(selectors.ownerUserId(state)).toEqual('owner');
    });
  });
  describe('isOwnerUserInErrMgtTwoDotZero selector', () => {
    test('should return false if no state exists', () => {
      expect(selectors.isOwnerUserInErrMgtTwoDotZero(undefined)).toEqual(false);
    });
    test('should return correct owner user error management 2.0 flag for an org user', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                _id: 'ashare1',
                ownerUser: {
                  _id: 'owner1',
                  useErrMgtTwoDotZero: true,
                  email: 'owner@test.com',
                  name: 'owner 1',
                },
              },
              {
                _id: 'ashare2',
                ownerUser: {
                  _id: 'owner2',
                  useErrMgtTwoDotZero: false,
                  email: 'owner2@test.com',
                  name: 'owner 2',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.isOwnerUserInErrMgtTwoDotZero(state)).toEqual(true);
    });
    test('should return correct owner user error management 2.0 flag info for an org owner', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', _id: 'owner', useErrMgtTwoDotZero: true },
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
        },
        'some action'
      );

      expect(selectors.isOwnerUserInErrMgtTwoDotZero(state)).toEqual(true);
    });
    test('should return correct owner user error management 2.0 flag info for an org owner when there are no preferences', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', _id: 'owner', useErrMgtTwoDotZero: true },
        },
        'some action'
      );

      expect(selectors.isOwnerUserInErrMgtTwoDotZero(state)).toEqual(true);
    });
    test('should return correct owner user error management 2.0 flag for an org user', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                _id: 'ashare1',
                ownerUser: {
                  _id: 'owner1',
                  email: 'owner@test.com',
                  name: 'owner 1',
                },
              },
              {
                _id: 'ashare2',
                ownerUser: {
                  _id: 'owner2',
                  email: 'owner2@test.com',
                  name: 'owner 2',
                  useErrMgtTwoDotZero: true,
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.isOwnerUserInErrMgtTwoDotZero(state)).toEqual(false);
    });
    test('should return correct owner user error management 2.0 flag info for an org owner', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', _id: 'owner' },
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
        },
        'some action'
      );

      expect(selectors.isOwnerUserInErrMgtTwoDotZero(state)).toEqual(false);
    });
    test('should return correct owner user error management 2.0 flag info for an org owner when there are no preferences', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', _id: 'owner' },
        },
        'some action'
      );

      expect(selectors.isOwnerUserInErrMgtTwoDotZero(state)).toEqual(false);
    });
  });
  describe('drawerOpened selector', () => {
    test('should return false if no state exists', () => {
      expect(selectors.drawerOpened(undefined)).toEqual(false);
    });

    test('should return correct drawer opened flag for an org owner', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', _id: 'owner' },
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN, drawerOpened: true },
        },
        'some action'
      );

      expect(selectors.drawerOpened(state)).toEqual(true);
    });
    test('should return false for specific org owner account', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', _id: 'owner' },
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
        },
        'some action'
      );

      expect(selectors.drawerOpened(state)).toEqual(false);
    });
  });
  describe('expandSelected selector', () => {
    test('should return undefined if no state exists', () => {
      expect(selectors.expandSelected(undefined)).toEqual(undefined);
    });
    test('should return correct expand selected label for an org owner', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', _id: 'owner' },
          preferences: { expand: 'expand', defaultAShareId: ACCOUNT_IDS.OWN, drawerOpened: true },
        },
        'some action'
      );

      expect(selectors.expandSelected(state)).toEqual('expand');
    });
    test('should return undefined for specific org owner account', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', _id: 'owner' },
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
        },
        'some action'
      );

      expect(selectors.expandSelected(state)).toEqual(undefined);
    });
  });
  describe('userAccessLevel selector', () => {
    test('should return false if no state exists', () => {
      expect(selectors.userAccessLevel(undefined)).toEqual(undefined);
    });
    test('should return "tile" for an org user', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                _id: 'ashare1',
                ownerUser: {
                  email: 'owner@test.com',
                  name: 'owner 1',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.userAccessLevel(state)).toEqual('tile');
    });
    test('should return "monitor" for an org user', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                accessLevel: 'monitor',
                _id: 'ashare1',
                ownerUser: {
                  email: 'owner@test.com',
                  name: 'owner 1',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.userAccessLevel(state)).toEqual('monitor');
    });
    test('should return "manage" for an org user', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                accessLevel: 'manage',
                _id: 'ashare1',
                ownerUser: {
                  email: 'owner@test.com',
                  name: 'owner 1',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.userAccessLevel(state)).toEqual('manage');
    });

    test('should return "tile" for an org user if it has integration access level', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                accessLevel: 'monitor',
                integrationAccessLevel: [{ _integrationId: '123', accessLevel: 'manage' }, { _integrationId: '456', accessLevel: 'monitor' }],
                _id: 'ashare1',
                ownerUser: {
                  email: 'owner@test.com',
                  name: 'owner 1',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.userAccessLevel(state)).toEqual('tile');
    });
    test('should return correct user access level info info for an org owner', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
        },
        'some action'
      );

      expect(selectors.userAccessLevel(state)).toEqual('owner');
    });
  });

  describe('canUserPublish selector', () => {
    test('should return false if no state exists', () => {
      expect(selectors.canUserPublish(undefined)).toEqual(false);
    });

    test('should return false for an account owner user if user cant publish', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
          org: {
            accounts: [
              {
                _id: ACCOUNT_IDS.OWN,
                accessLevel: 'owner',
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.canUserPublish(state)).toEqual(false);
    });

    test('should return true for an account owner user if user can publish', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', allowedToPublish: true },
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
          org: {
            accounts: [
              {
                _id: ACCOUNT_IDS.OWN,
                accessLevel: 'owner',
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.canUserPublish(state)).toEqual(true);
    });

    test('should return false for an org monitor user', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                _id: 'ashare1',
                accessLevel: 'monitor',
                ownerUser: {
                  email: 'owner@test.com',
                  name: 'owner 1',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.canUserPublish(state)).toEqual(false);
    });

    test('should return false for an org monitor user even owner can publish', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                _id: 'ashare1',
                accessLevel: 'monitor',
                ownerUser: {
                  allowedToPublish: true,
                  email: 'owner@test.com',
                  name: 'owner 1',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.canUserPublish(state)).toEqual(false);
    });
    test('should return false for manage level user', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                accessLevel: 'manage',
                _id: 'ashare1',
                ownerUser: {
                  allowedToPublish: false,
                  email: 'owner@test.com',
                  name: 'owner 1',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.canUserPublish(state)).toEqual(false);
    });
    test('should return false for manage level user even when account owner can publish', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                accessLevel: 'manage',
                _id: 'ashare1',
                ownerUser: {
                  allowedToPublish: true,
                  email: 'owner@test.com',
                  name: 'owner 1',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.canUserPublish(state)).toEqual(false);
    });
    test('should return false for an admin user when account owner doesnt have permission to publish', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                accessLevel: 'administrator',
                _id: 'ashare1',
                ownerUser: {
                  email: 'owner@test.com',
                  allowedToPublish: false,
                  name: 'owner 1',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.canUserPublish(state)).toEqual(false);
    });

    test('should return false for an admin user when account owner doesnt have permission to publish and user can publish', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', allowedToPublish: true },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                accessLevel: 'administrator',
                _id: 'ashare1',
                ownerUser: {
                  email: 'owner@test.com',
                  allowedToPublish: false,
                  name: 'owner 1',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.canUserPublish(state)).toEqual(false);
    });

    test('should return true for an admin user when account owner have permission to publish', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last', allowedToPublish: false },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                accessLevel: 'administrator',
                _id: 'ashare1',
                ownerUser: {
                  email: 'owner@test.com',
                  allowedToPublish: true,
                  name: 'owner 1',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.canUserPublish(state)).toEqual(true);
    });
  });

  describe('userPermissions selector', () => {
    const defaultObject = {
      accesstokens: {},
      audits: {},
      connectors: {},
      subscriptions: {},
      templates: {},
      transfers: {},
      users: {},
      agents: {},
      apis: {},
      connections: {},
      exports: {},
      imports: {},
      integrations: {},
      recyclebin: {},
      eventreports: {},
      scripts: {},
      stacks: {} };

    test('should return default object if no state exists', () => {
      expect(selectors.userPermissions(undefined)).toEqual(defaultObject);
    });
  });
  describe('licenses selector', () => {
    test('should return empty array if no state exists', () => {
      expect(selectors.licenses(undefined)).toEqual([]);
    });
  });
});

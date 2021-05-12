/* global describe, expect, test */
import { selectors } from '.';
import { USER_ACCESS_LEVELS, ACCOUNT_IDS } from '../utils/constants';

const sampleOIDCClient = {
  _id: '6097fdaf86c0c5190bb3bab3',
  type: 'oidc',
  orgId: 'celigo1235',
  oidc: {
    issuerURL: 'https://celigo547.okta.com',
    clientId: 'sampleClientId',
    clientSecret: '******',
  },
};
const sampleDisabledOIDCClient = {
  _id: '6097fdaf86c0c5190bb3bab3',
  type: 'oidc',
  orgId: 'celigo1235',
  disabled: true,
  oidc: {
    issuerURL: 'https://celigo547.okta.com',
    clientId: 'sampleClientId',
    clientSecret: '******',
  },
};

describe('selectors.oidcSSOClient test cases', () => {
  test('should return undefined if there are no sso clients or no client with type oidc', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [],
        },
      },
    };

    expect(selectors.oidcSSOClient()).toBe(undefined);
    expect(selectors.oidcSSOClient(sampleState)).toBe(undefined);
  });
  test('should return client with type oidc from the list of sso clients', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [sampleOIDCClient],
        },
      },
    };

    expect(selectors.oidcSSOClient(sampleState)).toBe(sampleOIDCClient);
  });
});
describe('selectors.isSSOEnabled test cases', () => {
  test('should return false if the user has no oidc sso client', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [],
        },
      },
    };

    expect(selectors.isSSOEnabled(sampleState)).toBeFalsy();
  });
  test('should return false if the oidc sso client has disabled true', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [sampleDisabledOIDCClient],
        },
      },
    };

    expect(selectors.isSSOEnabled(sampleState)).toBeFalsy();
  });

  test('should return true if the oidc sso client does not have disabled true ', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [sampleOIDCClient],
        },
      },
    };

    expect(selectors.isSSOEnabled(sampleState)).toBeTruthy();
  });
});
describe('selectors.userLinkedSSOClientId test cases', () => {
  test('should return id from oidc sso client if the user is an owner', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [sampleOIDCClient],
        },
      },
      user: {
        preferences: {
          defaultAShareId: ACCOUNT_IDS.OWN,
        },
        org: {
          accounts: [
            {
              _id: ACCOUNT_IDS.OWN,
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
            },
          ],
          users: [],
        },
      },
    };

    expect(selectors.userLinkedSSOClientId(sampleState, true)).toBe(sampleOIDCClient._id);
  });
  test('should return undefined if there is no oidc sso client if the user is an owner', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [],
        },
      },
      user: {
        preferences: {
          defaultAShareId: ACCOUNT_IDS.OWN,
        },
        org: {
          accounts: [
            {
              _id: ACCOUNT_IDS.OWN,
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
            },
          ],
          users: [],
        },
      },
    };

    expect(selectors.userLinkedSSOClientId(sampleState)).toBeUndefined();
  });
  test('should return _clientId under authTypeSSO doc from profile if the user is an account user', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [],
        },
      },
      user: {
        profile: {
          authTypeSSO: {
            _ssoClientId: 'clientId123',
          },
        },
        preferences: {
          defaultAShareId: 'ashareId123',
        },
        org: {
          accounts: [
            {
              _id: 'ashareId123',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
            },
          ],
          users: [],
        },
      },
    };

    expect(selectors.userLinkedSSOClientId(sampleState)).toBe(sampleState.user.profile.authTypeSSO._ssoClientId);
  });
  test('should return undefined if the account user has not linked to any sso client i.e., profile does not have authTypeSSO doc', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [],
        },
      },
      user: {
        profile: {
          authTypeSSO: null,
        },
        preferences: {
          defaultAShareId: 'ashareId123',
        },
        org: {
          accounts: [
            {
              _id: 'ashareId123',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
            },
          ],
          users: [],
        },
      },
    };

    expect(selectors.userLinkedSSOClientId(sampleState)).toBe(undefined);
  });
});
describe('selectors.isUserAllowedOnlySSOSignIn test cases', () => {
  test('should return false if the user is an owner', () => {
    const sampleState = {
      user: {
        preferences: {
          defaultAShareId: ACCOUNT_IDS.OWN,
        },
        org: {
          accounts: [
            {
              _id: ACCOUNT_IDS.OWN,
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
            },
          ],
          users: [],
        },
      },
    };

    expect(selectors.isUserAllowedOnlySSOSignIn(sampleState)).toBeFalsy();
  });
  test('should return false if the account user has no sso client Id linked to his profile', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [],
        },
      },
      user: {
        profile: {
          authTypeSSO: null,
        },
        preferences: {
          defaultAShareId: 'ashareId123',
        },
        org: {
          accounts: [
            {
              _id: 'ashareId123',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
            },
          ],
          users: [],
        },
      },
    };

    expect(selectors.isUserAllowedOnlySSOSignIn(sampleState)).toBeFalsy();
  });
  test('should return false if the account user has linked to a sso client but accountSSORequired is false for his ashare', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [],
        },
      },
      user: {
        profile: {
          authTypeSSO: {
            _ssoClientId: 'client123',
          },
        },
        preferences: {
          defaultAShareId: 'ashareId123',
        },
        org: {
          accounts: [
            {
              _id: 'ashareId123',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
              accountSSORequired: false,
              ownerUser: {
                _id: 'ownerId',
                _ssoClientId: 'client123',
              },
            },
          ],
          users: [],
        },
      },
    };

    expect(selectors.isUserAllowedOnlySSOSignIn(sampleState)).toBeFalsy();
  });
  test('should return true if the account user has linked to a sso client and accountSSORequired is true for his ashare', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [],
        },
      },
      user: {
        profile: {
          authTypeSSO: {
            _ssoClientId: 'clientId123',
          },
        },
        preferences: {
          defaultAShareId: 'ashareId123',
        },
        org: {
          accounts: [
            {
              _id: 'ashareId123',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
              accountSSORequired: true,
              ownerUser: {
                _id: 'ownerId',
                _ssoClientId: 'clientId123',
              },
            },
          ],
          users: [],
        },
      },
    };

    expect(selectors.isUserAllowedOnlySSOSignIn(sampleState)).toBeTruthy();
  });
});
describe('selectors.isUserAllowedOptionalSSOSignIn test cases', () => {
  test('should return false for the owner if the sso client is not enabled for his account', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [sampleDisabledOIDCClient],
        },
      },
      user: {
        preferences: {
          defaultAShareId: ACCOUNT_IDS.OWN,
        },
        org: {
          accounts: [
            {
              _id: ACCOUNT_IDS.OWN,
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
            },
          ],
          users: [],
        },
      },
    };

    expect(selectors.isUserAllowedOptionalSSOSignIn(sampleState)).toBeFalsy();
  });
  test('should return true for the owner if the sso client is enabled for his account', () => {
    const sampleStateWithDisabledClient = {
      data: {
        resources: {
          ssoclients: [sampleDisabledOIDCClient],
        },
      },
      user: {
        preferences: {
          defaultAShareId: ACCOUNT_IDS.OWN,
        },
        org: {
          accounts: [
            {
              _id: ACCOUNT_IDS.OWN,
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
            },
          ],
          users: [],
        },
      },
    };
    const sampleStateWithoutSSOClient = {
      data: {
        resources: {
          ssoclients: [],
        },
      },
      user: {
        preferences: {
          defaultAShareId: ACCOUNT_IDS.OWN,
        },
        org: {
          accounts: [
            {
              _id: ACCOUNT_IDS.OWN,
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
            },
          ],
          users: [],
        },
      },
    };

    expect(selectors.isUserAllowedOptionalSSOSignIn(sampleStateWithDisabledClient)).toBeFalsy();
    expect(selectors.isUserAllowedOptionalSSOSignIn(sampleStateWithoutSSOClient)).toBeFalsy();
  });
  test('should return false if the account user has no sso client Id linked to his profile', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [],
        },
      },
      user: {
        profile: {
          authTypeSSO: null,
        },
        preferences: {
          defaultAShareId: 'ashareId123',
        },
        org: {
          accounts: [
            {
              _id: 'ashareId123',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
            },
          ],
          users: [],
        },
      },
    };

    expect(selectors.isUserAllowedOptionalSSOSignIn(sampleState)).toBeFalsy();
  });
  test('should return false if the linked sso client id does not match with any owner\'s sso client id', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [],
        },
      },
      user: {
        profile: {
          authTypeSSO: {
            _ssoClientId: 'clientId123',
          },
        },
        preferences: {
          defaultAShareId: 'ashareId123',
        },
        org: {
          accounts: [
            {
              _id: 'ashareId123',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
              accountSSORequired: true,
              ownerUser: {
                _id: 'ownerId',
                _ssoClientId: 'clientId12344',
              },
            },
            {
              _id: 'ashareId456',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
              accountSSORequired: false,
              ownerUser: {
                _id: 'ownerId',
                _ssoClientId: 'clientId14567',
              },
            },
          ],
          users: [],
        },
      },
    };

    expect(selectors.isUserAllowedOptionalSSOSignIn(sampleState)).toBeFalsy();
  });
  test('should return false if the linked sso client id matches with the owner\'s sso client id but accountSSORequired is true', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [],
        },
      },
      user: {
        profile: {
          authTypeSSO: {
            _ssoClientId: 'clientId123',
          },
        },
        preferences: {
          defaultAShareId: 'ashareId123',
        },
        org: {
          accounts: [
            {
              _id: 'ashareId123',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
              accountSSORequired: true,
              ownerUser: {
                _id: 'ownerId',
                _ssoClientId: 'clientId123',
              },
            },
          ],
          users: [],
        },
      },
    };

    expect(selectors.isUserAllowedOptionalSSOSignIn(sampleState)).toBeFalsy();
  });
  test('should return true if the linked sso client id matches with the owner\'s sso client id and accountSSORequired is false', () => {
    const sampleState = {
      data: {
        resources: {
          ssoclients: [],
        },
      },
      user: {
        profile: {
          authTypeSSO: {
            _ssoClientId: 'clientId123',
          },
        },
        preferences: {
          defaultAShareId: 'ashareId123',
        },
        org: {
          accounts: [
            {
              _id: 'ashareId123',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
              accountSSORequired: false,
              ownerUser: {
                _id: 'ownerId',
                _ssoClientId: 'clientId123',
              },
            },
          ],
          users: [],
        },
      },
    };

    expect(selectors.isUserAllowedOptionalSSOSignIn(sampleState)).toBeTruthy();
  });
});

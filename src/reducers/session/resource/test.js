
import reducer, { selectors } from '.';
import actions from '../../../actions';
import { LICENSE_REACTIVATED_MESSAGE, LICENSE_UPGRADE_REQUEST_SUBMITTED_MESSAGE, REQUEST_UPGRADE_SUCCESS_MESSAGE} from '../../../constants';
import { message } from '../../../utils/messageStore';

describe('session.resource reducers', () => {
  test('reducer should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { 'new-1234': 'ab123' };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toEqual(oldState);
  });

  describe('RESOURCE.CREATED action', () => {
    test('should store the created resource ID mapped to tempId', () => {
      const tempId = 'new-123';
      const dbId = 'abc123';
      const state = reducer(undefined, actions.resource.created(dbId, tempId));

      expect(state[tempId]).toEqual(dbId);
    });
  });
  describe('RESOURCE.REFERENCES_RECEIVED action', () => {
    test('should store the references in the state', () => {
      const testReferences = {
        imports: [{ id: 'id1', name: 'imp1' }, { id: 'id2', name: 'imp2' }],
        exports: [{ id: 'id1', name: 'exp1' }, { id: 'id2', name: 'exp2' }],
      };
      const state = reducer(
        undefined,
        actions.resource.receivedReferences(testReferences)
      );

      expect(state.references).toEqual(testReferences);
    });
  });
  describe('RESOURCE.REFERENCES_CLEAR action', () => {
    test('should delete the references from the state', () => {
      const testReferences = {
        imports: [{ id: 'id1', name: 'imp1' }, { id: 'id2', name: 'imp2' }],
        exports: [{ id: 'id1', name: 'exp1' }, { id: 'id2', name: 'exp2' }],
      };
      const state = reducer(
        undefined,
        actions.resource.receivedReferences(testReferences)
      );
      const newState = reducer(state, actions.resource.clearReferences());

      expect(newState).toEqual({});
    });
    test('should not delete new id from other parts of the store', () => {
      const testReferences = {
        imports: [{ id: 'id1', name: 'imp1' }, { id: 'id2', name: 'imp2' }],
        exports: [{ id: 'id1', name: 'exp1' }, { id: 'id2', name: 'exp2' }],
      };
      const tempId = 'new123';
      const dbId = 'abc123';
      let state = reducer(
        undefined,
        actions.resource.receivedReferences(testReferences)
      );

      state = reducer(state, actions.resource.created(dbId, tempId));

      expect(state.new123).toEqual(dbId);

      state = reducer(state, actions.resource.clearReferences());
      expect(state.new123).toEqual(dbId);
    });
  });
  describe('LICENSE.TRIAL_ISSUED action', () => {
    test('should store the license trial issued message', () => {
      const state = reducer(
        undefined,
        actions.license.trialLicenseIssued()
      );
      const expected = {};

      expect(state).toEqual(expected);
    });
  });
  describe('LICENSE.UPGRADE_REQUEST_SUBMITTED action', () => {
    test('should store the license upgrade request submitted message', () => {
      const state = reducer(
        undefined,
        actions.license.licenseUpgradeRequestSubmitted()
      );
      const expected = {platformLicenseActionMessage: LICENSE_UPGRADE_REQUEST_SUBMITTED_MESSAGE};

      expect(state).toEqual(expected);
    });
    test('should store the license upgrade request submitted message for twoDotZero resource', () => {
      const isTwoDotZero = true;
      const state = reducer(
        undefined,
        actions.license.licenseUpgradeRequestSubmitted(undefined, undefined, isTwoDotZero)
      );
      const expected = {platformLicenseActionMessage: REQUEST_UPGRADE_SUCCESS_MESSAGE};

      expect(state).toEqual(expected);
    });
    test('should store the license upgrade request submitted message for feature SSO and dataRetention', () => {
      const feature = 'SSO';
      const state = reducer(
        undefined,
        actions.license.licenseUpgradeRequestSubmitted(undefined, feature)
      );
      const expected = { platformLicenseActionMessage: message.SUBSCRIPTION.FEATURE_LICENSE_UPGRADE_REQUEST_SUBMITTED_MESSAGE };

      expect(state).toEqual(expected);
    });
  });
  describe('actionTypes.LICENSE.REACTIVATED action', () => {
    test('should store the license reactivated message', () => {
      const state = reducer(
        undefined,
        actions.license.licenseReactivated()
      );
      const expected = {platformLicenseActionMessage: LICENSE_REACTIVATED_MESSAGE};

      expect(state).toEqual(expected);
    });
  });
  describe('LICENSE.NUM_ENABLED_FLOWS_RECEIVED action', () => {
    test('should store the number of enabled flows info', () => {
      const response = {numEnabledPaidFlows: 2, numEnabledSandboxFlows: 2, numEnabledFreeFlows: 1 };
      const state = reducer(
        undefined,
        actions.license.receivedNumEnabledFlows(response)
      );

      expect(state.numEnabledFlows).toEqual(response);
    });
  });
  describe('LICENSE.ENTITLEMENT_USAGE_RECEIVED action', () => {
    test('should store the license entitlement usage info', () => {
      const response = {production: {agentUsage: {numActive: 2}, flowUsage: {numEnabled: 2}, endpointUsage: {numConsumed: 11}, tradingPartnerUsage: {numConsumed: 4} }, sandbox: {agentUsage: {numActive: 2}, flowUsage: {numEnabled: 2}, endpointUsage: {numConsumed: 11}, tradingPartnerUsage: {numConsumed: 4} }};

      const state = reducer(
        undefined,
        actions.license.receivedLicenseEntitlementUsage(response)
      );

      expect(state.licenseEntitlementUsage).toEqual(response);
    });
  });
  describe('LICENSE.ERROR_MESSAGE_RECEIVED action', () => {
    test('should store the license error messages info', () => {
      const code = 'test_code';
      const message = 'test message';

      const state = reducer(
        undefined,
        actions.license.receivedLicenseErrorMessage(code, message),
      );

      expect(state).toEqual({code, message});
    });
  });
  describe('LICENSE.CLEAR_ERROR_MESSAGE action', () => {
    test('should clear the license error messages info', () => {
      const code = 'test_code';
      const message = 'test message';

      const state = reducer(
        undefined,
        actions.license.clearErrorMessage(),
      );

      expect(state).not.toEqual({code, message});
    });
  });
  describe('RESOURCE.UPDATE_CHILD_INTEGRATION action', () => {
    test('should store the parent child integration map info', () => {
      const parentId = 'parentId';
      const childId = 'childId';
      const expected = {parentChildMap: {[parentId]: childId }};

      const state = reducer(
        undefined,
        actions.resource.updateChildIntegration(parentId, childId)
      );

      expect(state).toEqual(expected);
    });
  });
  describe('RESOURCE.CLEAR_CHILD_INTEGRATION action', () => {
    test('should be able to clear parent child integration map if any', () => {
      const parentId = 'parentId';
      const childId = 'childId';

      const prevState = reducer(
        undefined,
        actions.resource.updateChildIntegration(parentId, childId)
      );
      const state = reducer(
        prevState,
        actions.resource.clearChildIntegration()
      );

      expect(state).toEqual({});
    });
    test('should be able to handle if parent id is invalid or null', () => {
      const parentId = null;
      const childId = 'childId';

      const prevState = reducer(
        undefined,
        actions.resource.updateChildIntegration(parentId, childId)
      );
      const state = reducer(
        prevState,
        actions.resource.clearChildIntegration()
      );

      expect(state).toEqual({});
    });
  });

  describe('session.resource selectors', () => {
    describe('createdResourceId', () => {
      test('should return undefined when no match found.', () => {
        expect(selectors.createdResourceId(undefined, 'tempId')).toBeUndefined(
        );
        expect(selectors.createdResourceId({}, 'tempId')).toBeUndefined();
        expect(selectors.createdResourceId({tempId: '123'}, null)).toBeUndefined();
      });

      test('should return correct newly created ID when match against tempId found.', () => {
        const tempId = 'new-123';
        const dbId = 'abc123';
        const state = reducer(
          undefined,
          actions.resource.created(dbId, tempId)
        );

        expect(selectors.createdResourceId(state, tempId)).toEqual(dbId);
      });
    });
    describe('resourceReferences', () => {
      test('should return empty object when state is undefined', () => {
        expect(selectors.resourceReferences(undefined)).toBeNull();
      });
      test('should return references for valid state', () => {
        const testReferences = {
          imports: [{ id: 'id1', name: 'imp1' }, { id: 'id2', name: 'imp2' }],
          exports: [{ id: 'id1', name: 'exp1' }, { id: 'id2', name: 'exp2' }],
        };
        const state = reducer(
          undefined,
          actions.resource.receivedReferences(testReferences)
        );
        const { references } = state;
        const referencesArray = [];

        Object.keys(references).forEach(type =>
          references[type].forEach(refObj => {
            referencesArray.push({
              resourceType: type,
              id: refObj.id,
              name: refObj.name,
            });
          })
        );

        expect(selectors.resourceReferences(state)).toEqual(referencesArray);
      });
    });
  });
  describe('platformLicenseActionMessage', () => {
    test('should return undefined when no match found.', () => {
      expect(selectors.platformLicenseActionMessage(undefined)).toBeUndefined(
      );
      expect(selectors.platformLicenseActionMessage({})).toBeUndefined();
    });
    test('should return correct license upgrade action message', () => {
      const state = reducer(
        undefined,
        actions.license.licenseUpgradeRequestSubmitted()
      );
      const expected = {platformLicenseActionMessage: LICENSE_UPGRADE_REQUEST_SUBMITTED_MESSAGE};

      expect(selectors.platformLicenseActionMessage(state)).toEqual(expected.platformLicenseActionMessage);
    });
  });
  describe('ssoLicenseUpgradeRequested', () => {
    test('should return undefined when no match found.', () => {
      expect(selectors.ssoLicenseUpgradeRequested(undefined)).toBeUndefined(
      );
      expect(selectors.ssoLicenseUpgradeRequested({})).toBeUndefined();
    });
    test('should return true when sso license is upgrade requested', () => {
      const state = reducer(
        undefined,
        actions.license.ssoLicenseUpgradeRequested()
      );
      const expected = {ssoLicenseUpgradeRequested: true};

      expect(selectors.ssoLicenseUpgradeRequested(state)).toEqual(expected.ssoLicenseUpgradeRequested);
    });
  });
  describe('getChildIntegrationId', () => {
    test('should return undefined when no match found.', () => {
      expect(selectors.getChildIntegrationId(undefined)).toBeUndefined(
      );
      expect(selectors.getChildIntegrationId({})).toBeUndefined();
    });

    test('should return correct child integration id', () => {
      const parentId = 'parentId';
      const childId = 'childId';

      const state = reducer(
        undefined,
        actions.resource.updateChildIntegration(parentId, childId)
      );

      expect(selectors.getChildIntegrationId(state, parentId)).toEqual(childId);
    });
    test('should return undefined if no parent child integration map exists for corresponding parent id', () => {
      const parentId = 'parentId';
      const childId = 'childId';

      const state = reducer(
        undefined,
        actions.resource.updateChildIntegration(parentId, childId)
      );

      expect(selectors.getChildIntegrationId(state, 'dummy')).toBeUndefined();
    });
  });
  describe('getNumEnabledFlows', () => {
    test('should return defaultObject when no match found.', () => {
      const defaultObject = { numEnabledPaidFlows: 0, numEnabledSandboxFlows: 0 };

      expect(selectors.getNumEnabledFlows(undefined)).toEqual(
        defaultObject
      );
      expect(selectors.getNumEnabledFlows({})).toEqual(defaultObject);
    });

    test('should return correct number of enabled flows', () => {
      const response = {numEnabledPaidFlows: 2, numEnabledSandboxFlows: 2, numEnabledFreeFlows: 1 };
      const state = reducer(
        undefined,
        actions.license.receivedNumEnabledFlows(response)
      );
      const expected = {
        numEnabledPaidFlows: 2,
        numEnabledSandboxFlows: 2,
        numEnabledFreeFlows: 1,
      };

      expect(selectors.getNumEnabledFlows(state)).toEqual(expected);
    });
  });
  describe('getLicenseEntitlementUsage', () => {
    test('should return null when no match found.', () => {
      expect(selectors.getLicenseEntitlementUsage(undefined)).toBeNull(
      );
      expect(selectors.getLicenseEntitlementUsage({})).toBeNull();
    });

    test('should return correct license entitlement usage info', () => {
      const response = {production: {agentUsage: {numActive: 2}, flowUsage: {numEnabled: 2}, endpointUsage: {numConsumed: 11}, tradingPartnerUsage: {numConsumed: 4} }, sandbox: {agentUsage: {numActive: 2}, flowUsage: {numEnabled: 2}, endpointUsage: {numConsumed: 11}, tradingPartnerUsage: {numConsumed: 4} }};

      const state = reducer(
        undefined,
        actions.license.receivedLicenseEntitlementUsage(response)
      );

      expect(selectors.getLicenseEntitlementUsage(state)).toEqual(response);
    });
  });
  describe('licenseErrorCode', () => {
    test('should return null when no match found.', () => {
      expect(selectors.licenseErrorCode(undefined)).toBeUndefined();
      expect(selectors.licenseErrorCode({})).toBeUndefined();
    });
    test('should return licenseErrorCode', () => {
      expect(selectors.licenseErrorCode({code: 'test_code'})).toBe('test_code');
    });
  });
  describe('licenseErrorMessage', () => {
    test('should return null when no match found.', () => {
      expect(selectors.licenseErrorMessage(undefined)).toBeUndefined();
      expect(selectors.licenseErrorMessage({})).toBeUndefined();
    });
    test('should return licenseErrorMessage', () => {
      expect(selectors.licenseErrorMessage({message: 'test_message'})).toBe('test_message');
    });
  });
});

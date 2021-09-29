/* global describe, test, expect */
import moment from 'moment';
import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('marketplace reducers', () => {
  describe('connectors received action', () => {
    const testConnectors = [{ _id: '123' }, { _id: '456' }];
    const updatedTestConnectors = [{ _id: '789' }, { _id: '432' }];

    test('should store connectors succesfully on state', () => {
      const state = reducer(
        undefined,
        actions.marketplace.receivedConnectors({ connectors: testConnectors })
      );

      expect(state.connectors).toEqual(testConnectors);
    });
    test('should replace existing connectors on state', () => {
      const state = reducer(
        undefined,
        actions.marketplace.receivedConnectors({ connectors: testConnectors })
      );

      expect(state.connectors).toEqual(testConnectors);
      const newState = reducer(
        state,
        actions.marketplace.receivedConnectors({
          connectors: updatedTestConnectors,
        })
      );

      expect(newState.connectors).toEqual(updatedTestConnectors);
    });
  });
  describe('templates received action', () => {
    const testTemplates = [{ _id: '123' }, { _id: '456' }];
    const updatedTestTemplates = [{ _id: '789' }, { _id: '432' }];

    test('should store templates succesfully on state', () => {
      const state = reducer(
        undefined,
        actions.marketplace.receivedTemplates({ templates: testTemplates })
      );

      expect(state.templates).toEqual(testTemplates);
    });
    test('should replace existing templates on state', () => {
      const state = reducer(
        undefined,
        actions.marketplace.receivedTemplates({ templates: testTemplates })
      );

      expect(state.templates).toEqual(testTemplates);
      const newState = reducer(
        state,
        actions.marketplace.receivedTemplates({
          templates: updatedTestTemplates,
        })
      );

      expect(newState.templates).toEqual(updatedTestTemplates);
    });
  });
});

describe('marketplace selectors', () => {
  describe('connectors', () => {
    const testConnectors = [
      { _id: '123', applications: ['some application'] },
      { _id: '456', applications: ['some application'] },
      { _id: '567', applications: ['some application'] },
      { _id: '789', applications: ['some application'], framework: 'twoDotZero' },
      { _id: 'abc', applications: ['some application'], framework: 'twoDotZero' },
    ];
    const licenses = [
      {
        expires: moment()
          .subtract(1, 'days')
          .toISOString(),
        type: 'connector',
        _connectorId: '456',
      },
      {
        expires: moment()
          .add(1, 'days')
          .toISOString(),
        type: 'connector',
        _connectorId: '123',
      },
      {
        trialEndDate: moment()
          .subtract(1, 'days')
          .toISOString(),
        type: 'connector',
        _connectorId: '567',
      },
      {
        trialEndDate: moment()
          .subtract(2, 'days')
          .toISOString(),
        type: 'integrationApp',
        _connectorId: '789',
      },
      {
        trialEndDate: moment()
          .subtract(2, 'days')
          .toISOString(),
        type: 'integrationApp',
        _connectorId: 'abc',
        _integrationId: '123',
      },
      {
        trialEndDate: moment()
          .subtract(2, 'days')
          .toISOString(),
        expires: moment()
          .subtract(2, 'days')
          .toISOString(),
        type: 'integrationApp',
        _connectorId: 'abc',
        _integrationId: '765',
      },
    ];

    test('should return empty array on empty/undefined state', () => {
      expect(selectors.connectors(undefined)).toEqual([]);
      expect(selectors.connectors({})).toEqual([]);
    });
    test('should return connectors on valid state', () => {
      const state = reducer(
        undefined,
        actions.marketplace.receivedConnectors({ connectors: testConnectors })
      );

      expect(
        selectors.connectors(state, 'some application', false, licenses)
      ).toEqual([
        { _id: '123', applications: ['some application'], canInstall: true, usedTrialLicenseExists: false, canRequestDemo: false, canStartTrial: false },
        { _id: '456', applications: ['some application'], canInstall: false, usedTrialLicenseExists: false, canRequestDemo: true, canStartTrial: false },
        { _id: '567', applications: ['some application'], canInstall: false, usedTrialLicenseExists: true, canRequestDemo: true, canStartTrial: false },
        { _id: '789', applications: ['some application'], framework: 'twoDotZero', canInstall: false, usedTrialLicenseExists: true, canRequestDemo: true, canStartTrial: false},
        { _id: 'abc', applications: ['some application'], framework: 'twoDotZero', canInstall: false, usedTrialLicenseExists: true, canRequestDemo: true, canStartTrial: false },
      ]);
    });
  });
  describe('marketplaceTemplatesByApp', () => {
    const testTemplates = [
      { _id: '123' },
      { _id: '456', applications: ['some application'] },
      { _id: '1', applications: ['constantcontactv2'] },
      { _id: '2', applications: ['constantcontactv3'] },
      { _id: '3', applications: ['constantcontact'] },
    ];

    test('should return empty array on empty/undefined state', () => {
      expect(selectors.marketplaceTemplatesByApp(undefined)).toEqual([]);
      expect(selectors.marketplaceTemplatesByApp({})).toEqual([]);
    });
    const state = reducer(
      undefined,
      actions.marketplace.receivedTemplates({ templates: testTemplates })
    );

    test('should return templates on valid state', () => {
      expect(selectors.marketplaceTemplatesByApp(state, 'some application')).toEqual([
        state.templates[1],
      ]);
    });
    test('should return constant contact v2 and v3 templates if application is constantcontact', () => {
      expect(selectors.marketplaceTemplatesByApp(state, 'constantcontact')).toEqual([
        { _id: '1', applications: ['constantcontactv2'] },
        { _id: '2', applications: ['constantcontactv3'] },
        { _id: '3', applications: ['constantcontact'] },
      ]);
    });
  });
  describe('marketplaceTemplateById', () => {
    const testTemplates = [
      { _id: '123' },
      { _id: '456', applications: ['some application'] },
    ];

    test('should return undefined on empty/undefined state', () => {
      expect(selectors.marketplaceTemplateById(undefined)).toEqual(undefined);
      expect(selectors.marketplaceTemplateById({})).toEqual(undefined);
    });
    test('should return template on valid state', () => {
      const state = reducer(
        undefined,
        actions.marketplace.receivedTemplates({ templates: testTemplates })
      );

      expect(selectors.marketplaceTemplateById(state, '456')).toEqual(
        state.templates[1]
      );
    });
  });
  describe('integrationAppList', () => {
    const connectors = [
      { _id: '123', applications: ['some application'] },
      { _id: '456', applications: ['some application'] },
    ];

    test('should return empty array on empty/undefined state', () => {
      expect(selectors.integrationAppList(undefined)).toEqual([]);
      expect(selectors.integrationAppList({})).toEqual([]);
    });
    test('should return connectors on valid state', () => {
      const state = reducer(
        undefined,
        actions.marketplace.receivedConnectors({ connectors })
      );

      expect(
        selectors.integrationAppList(state)
      ).toEqual(connectors);
    });
  });
});

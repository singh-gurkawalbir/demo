/* global describe, test, expect */
import reducer, * as selectors from './';
import { ACCOUNT_IDS } from '../../utils/constants';

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
          },
          {
            id: 'ashare2',
            hasSandbox: false,
            canLeave: true,
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
          },
          {
            id: 'ashare2',
            hasSandbox: false,
            selected: true,
            canLeave: true,
          },
        ]);
      });
    });
  });
});

/* global describe, expect, test */
import { selectors } from '.';

describe('Notifications region selector testcases', () => {
  describe('selectors.mkSubscribedNotifications test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkSubscribedNotifications();

      expect(selector()).toEqual([]);
    });
  });

  describe('selectors.mkDiyFlows test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkDiyFlows();

      expect(selector()).toEqual([]);
    });
  });

  describe('selectors.mkDiyConnections test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkDiyConnections();

      expect(selector(undefined, {})).toEqual([]);
    });
  });

  describe('selectors.integrationNotificationResources test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationNotificationResources()).toEqual({
        connectionValues: [],
        connections: [],
        flowValues: [],
        flows: [],
      });
    });
  });

  describe('selectors.isFlowSubscribedForNotification test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isFlowSubscribedForNotification(undefined, {})).toEqual(false);
    });
  });
});


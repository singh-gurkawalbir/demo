/* global describe, test */

import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as selectors from '../../reducers';
import { touchFlow } from '.';

describe('resourceForm saga', () => {
  describe('touchFlow saga', () => {
    test('should return empty array if no flow', () => {
      const exp = { _id: 2, name: 'exp', lastModified: new Date().toISOString() };
      return expectSaga(touchFlow, 1, 'exports', 2)
        .provide([
          [select(selectors.resource, 'flows', 1), undefined],
          [select(selectors.resource, 'exports', 2), exp],
        ])
        .returns([])
        .run();
    });
    test('should return empty array if no changed resource', () => {
      const flow = { _id: 1, name: 'flow', lastModified: new Date().toISOString() };
      expectSaga(touchFlow, 1, 'exports', 2)
        .provide([
          [select(selectors.resource, 'flows', 1), flow],
          [select(selectors.resource, 'exports', 2), undefined],
        ])
        .returns([])
        .run();
    });
    test('should return empty array if flow has no lastModified', () => {
      const d2 = new Date().toISOString();
      const flow = { _id: 1, name: 'flow' };
      const exp = { _id: 2, name: 'exp', lastModified: d2 };
      return expectSaga(touchFlow, 1, 'exports', 2)
        .provide([
          [select(selectors.resource, 'flows', 1), flow],
          [select(selectors.resource, 'exports', 2), exp],
        ])
        .returns([])
        .run();
    });
    test('should return empty array if change resource has no lastModified', () => {
      const d1 = new Date().toISOString();
      const flow = { _id: 1, name: 'flow', lastModified: d1 };
      const exp = { _id: 2, name: 'exp' };
      return expectSaga(touchFlow, 1, 'exports', 2)
        .provide([
          [select(selectors.resource, 'flows', 1), flow],
          [select(selectors.resource, 'exports', 2), exp],
        ])
        .returns([])
        .run();
    });
    test('should not patch flow lastModified if flow has later lastModified', () => {
      const t = new Date().getTime();
      const d1 = new Date(t).toISOString();
      const d2 = new Date(t + 1).toISOString();
      const flow = { _id: 1, name: 'flow', lastModified: d2 };
      const exp = { _id: 2, name: 'exp', lastModified: d1 };
      return expectSaga(touchFlow, 1, 'exports', 2)
        .provide([
          [select(selectors.resource, 'flows', 1), flow],
          [select(selectors.resource, 'exports', 2), exp],
        ])
        .returns([])
        .run();
    });
    test('should patch flow lastModified', () => {
      const t = new Date().getTime();
      const d1 = new Date(t).toISOString();
      const d2 = new Date(t + 1).toISOString();
      const flow = { _id: 1, name: 'flow', lastModified: d1 };
      const exp = { _id: 2, name: 'exp', lastModified: d2 };
      return expectSaga(touchFlow, 1, 'exports', 2)
        .provide([
          [select(selectors.resource, 'flows', 1), flow],
          [select(selectors.resource, 'exports', 2), exp],
        ])
        .returns([{
          op: 'replace',
          path: '/lastModified',
          value: d2,
        }])
        .run();
    });
    test('should not hack empty pageProcessor responseMapping if no change in lastModified', () => {
      const t = new Date().getTime();
      const d1 = new Date(t).toISOString();
      const d2 = new Date(t).toISOString();
      const flow = {
        _id: 1,
        name: 'flow',
        lastModified: d1,
        pageProcessors: [{
          type: 'import',
          _importId: 11,
        }, {
          type: 'export',
          _exportId: 12,
          responseMapping: {},
        }, {
          type: 'import',
          responseMapping: {
            somethingElse: {},
            fields: [],
            lists: [],
          }
        }, {
          type: 'import',
          responseMapping: {
            nothing: null,
            fields: [{}],
            lists: [],
          }
        }, {
          type: 'import',
          responseMapping: {
            nothing: null,
            fields: [],
            lists: [],
          }
        }],
      };
      const exp = { _id: 2, name: 'exp', lastModified: d2 };
      return expectSaga(touchFlow, 1, 'exports', 2)
        .provide([
          [select(selectors.resource, 'flows', 1), flow],
          [select(selectors.resource, 'exports', 2), exp],
        ])
        .returns([])
        .run();
    });
    test('should hack empty pageProcessor empty responseMapping', () => {
      const t = new Date().getTime();
      const d1 = new Date(t).toISOString();
      const d2 = new Date(t + 1).toISOString();
      const flow = {
        _id: 1,
        name: 'flow',
        lastModified: d1,
        pageProcessors: [{
          type: 'import',
          _importId: 11,
        }, {
          type: 'export',
          _exportId: 12,
          responseMapping: {},
        }, {
          type: 'import',
          responseMapping: {
            somethingElse: {},
            fields: [],
            lists: [],
          }
        }, {
          type: 'import',
          responseMapping: {
            nothing: null,
            fields: [{}],
            lists: [],
          }
        }, {
          type: 'import',
          responseMapping: {
            nothing: null,
            fields: [],
            lists: [],
          }
        }],
      };
      const exp = { _id: 2, name: 'exp', lastModified: d2 };
      return expectSaga(touchFlow, 1, 'exports', 2)
        .provide([
          [select(selectors.resource, 'flows', 1), flow],
          [select(selectors.resource, 'exports', 2), exp],
        ])
        .returns([{
          op: 'replace',
          path: '/lastModified',
          value: d2,
        }, {
          op: 'remove',
          path: '/pageProcessors/1/responseMapping',
        }, {
          op: 'remove',
          path: '/pageProcessors/4/responseMapping',
        }])
        .run();
    });
  });
});

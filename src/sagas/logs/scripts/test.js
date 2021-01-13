/* global describe, test */
import { expectSaga } from 'redux-saga-test-plan';
import { call, select } from 'redux-saga/effects';
// import { addMinutes } from 'date-fns';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { requestReferences } from '../../resources';
import {
  // fetchScriptLogs,
  getScriptDependencies,
  // requestScriptLogs,
  // loadMoreLogs,
} from '.';
// import { apiCallWithRetry } from '../..';

describe('getScriptDependencies saga', () => {
  test('should dispatch setDependency action after fetching depedency', () => {
    // const flowId = 'f1';
    const scriptId = 's1';

    return expectSaga(getScriptDependencies, { scriptId })
      .provide([
        [call(requestReferences, {
          resourceType: 'scripts',
          id: scriptId,
        }), {
          exports: [
            {id: 'e1', name: 'ne1'},
            {id: 'e2', name: 'ne2'},
          ],
          imports: [
            {id: 'i1', name: 'ni1'},
            {id: 'i2', name: 'ni2'},
          ],
          flows: [
            {id: 'f1', name: 'nf1'},
            {id: 'f2', name: 'nf2'},
          ],
        }],
      ]).put(actions.logs.scripts.setDependency({
        scriptId,
        flowId: '',
        resourceReferences: [
          {id: 'e1', name: 'ne1', type: 'export'},
          {id: 'e2', name: 'ne2', type: 'export'},
          {id: 'i1', name: 'ni1', type: 'import'},
          {id: 'i2', name: 'ni2', type: 'import'},
          {id: 'f1', name: 'nf1', type: 'flow'},
          {id: 'f2', name: 'nf2', type: 'flow'},
        ],
      }))
      .run();
  });

  test('should dispatch setDependency action after fetching depedency for particular flowId', () => {
    const flowId = 'f1';
    const scriptId = 's1';

    return expectSaga(getScriptDependencies, { flowId, scriptId })
      .provide([
        [call(requestReferences, {
          resourceType: 'scripts',
          id: scriptId,
        }), {
          exports: [
            {id: 'e1', name: 'ne1'},
            {id: 'e2', name: 'ne2'},
          ],
          imports: [
            {id: 'i1', name: 'ni1'},
            {id: 'i2', name: 'ni2'},
          ],
          flows: [
            {id: 'f1', name: 'nf1'},
            {id: 'f2', name: 'nf2'},
          ],
        }],
        [call(requestReferences, {
          resourceType: 'scripts',
          id: scriptId,
        }), {
          exports: [
            {id: 'e1', name: 'ne1'},
            {id: 'e2', name: 'ne2'},
            {id: 'e3', name: 'ne3'},
          ],
          imports: [
            {id: 'i1', name: 'ni1'},
            {id: 'i2', name: 'ni2'},
          ],
          flows: [
            {id: 'f1', name: 'nf1'},
            {id: 'f2', name: 'nf2'},
          ],
        }],
        [select(selectors.resource, 'flows', flowId),
          {
            pageGenerators: [
              {_exportId: 'e1', type: 'export'},
            ],
            pageProcessors: [
              {_exportId: 'e2', type: 'export'},
              {_importId: 'i2', type: 'import'},

            ],
          },
        ],
      ]).put(actions.logs.scripts.setDependency({
        scriptId,
        flowId,
        resourceReferences: [
          {id: 'e1', name: 'ne1', type: 'export'},
          {id: 'e2', name: 'ne2', type: 'export'},
          {id: 'i2', name: 'ni2', type: 'import'},
        ],
      }))
      .run();
  });
});

describe('fetchScriptLogs saga', () => {
  // test('should not dispatch receivedLogs action while patching filter[logLevel]', () => {
  //   const flowId = 'f1';
  //   const scriptId = 's1';

  //   return expectSaga(fetchScriptLogs, { flowId, scriptId, field: 'logLevel' })
  //     .not.put(actions.logs.scripts.setDependency({
  //       scriptId,
  //       flowId,
  //     }))
  //     .run();
  // });

  // test('should dispatch receivedLogs action while fetching script logs', () => {
  //   const flowId = 'f1';
  //   const scriptId = 's1';

  //   const nextPageURL = '/api/abcd/xyz';

  //   expectSaga(fetchScriptLogs, { flowId, scriptId, loadMore: true })
  //     .provide([
  //       [select(selectors.scriptLog, {
  //         scriptId, flowId,
  //       }), {
  //         nextPageURL,
  //       }],
  //       [
  //         call(apiCallWithRetry, {
  //           path: nextPageURL.replace('/api', ''),
  //           opts: {method: 'GET'},
  //         }), {
  //           logs: [{message: 'abc', time: expect.anything()}],
  //           nextPageURL: '/api/abcd/uvw',
  //         },
  //       ],
  //     ])
  //     .put(actions.logs.scripts.receivedLogs({
  //       scriptId,
  //       flowId,
  //       logs: [{message: 'abc'}],
  //       nextPageURL: '/api/abcd/uvw',
  //     }))
  //     .run();
  //   const startDate = new Date();
  //   const endDate = addMinutes(startDate, -15);

  //   return expectSaga(fetchScriptLogs, { flowId, scriptId, loadMore: true })
  //     .provide([
  //       [select(selectors.scriptLog, {
  //         scriptId, flowId,
  //       }), {
  //         functionType: 'preMap',
  //         dateRange: {
  //           startDate,
  //           endDate,
  //         },
  //         selectedResources: [
  //           {type: 'flows', id: 'f1'},
  //           {type: 'exports', id: 'e1'},
  //           {type: 'exports', id: 'e2'},
  //           {type: 'imports', id: 'i1'},
  //         ],
  //       }],
  //       [
  //         call(apiCallWithRetry, {
  //           path: `/scripts/s1/logs?time_gt=${startDate.getTime()}&time_lte=${endDate.getTime()}&_flowId=f1&_flowId=f1&_resourceId=e1&_resourceId=e2&_resourceId=i1&functionType=preMap`,
  //           opts: {method: 'GET'},
  //         }), {
  //           logs: [{message: 'abc'}],
  //           nextPageURL: '/api/abcd/uvw',
  //         },
  //       ],
  //     ])
  //     .put(actions.logs.scripts.receivedLogs({
  //       scriptId,
  //       flowId,
  //       logs: [{message: 'abc'}],
  //       nextPageURL: '/api/abcd/uvw',
  //     }))
  //     .run();
  // });

  //   test('should dispatch requestFailed action when fetch script log failed', () => {
  //     const flowId = 'f1';
  //     const scriptId = 's1';

  //     const nextPageURL = '/api/abcd/xyz';

  //     expectSaga(fetchScriptLogs, { flowId, scriptId, loadMore: true })
  //       .provide([
  //         [select(selectors.scriptLog, {
  //           scriptId, flowId,
  //         }), {
  //           nextPageURL,
  //         }],
  //       ])
  //       .put(actions.logs.scripts.requestFailed({
  //         scriptId,
  //         flowId,
  //       }))
  //       .run();
  //   });
  // });

  // TODO
  // describe('requestScriptLogs saga', () => {
  //   test('should call dependent sagas correctly on requestScriptLogs', () => {
  //     const flowId = 'f1';
  //     const scriptId = 's1';

  //     return expectSaga(requestScriptLogs, { flowId, scriptId, loadMore: true })
  //       .call(getScriptDependencies, {scriptId, flowId})
  //       .call(fetchScriptLogs, {scriptId, flowId})
  //       .run();
  //   });
  // });

  // describe('loadMoreLogs saga', () => {
  //   test('should call fetchScriptLogs with loadMore = true', () => {
  //     const flowId = 'f1';
  //     const scriptId = 's1';

//     return expectSaga(loadMoreLogs, { flowId, scriptId, loadMore: true })
//       .call(fetchScriptLogs, {scriptId, flowId, loadMore: true})
//       .run();
//   });
});

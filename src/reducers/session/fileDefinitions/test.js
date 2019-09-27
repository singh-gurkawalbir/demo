/* global describe, test, expect */

import reducer from './';
import actions from '../../../actions';

describe('File Definitions', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toMatchObject({
      preBuiltFileDefinitions: {},
      userDefinedFileDefinitions: {},
    });
  });
  test('should update status as requested on request action', () => {
    const state = reducer(
      undefined,
      actions.fileDefinitions.preBuilt.request()
    );

    expect(state).toMatchObject({
      preBuiltFileDefinitions: { status: 'requested' },
      userDefinedFileDefinitions: {},
    });
  });
  test('should update data as empty when received nothing on received action', () => {
    const state = reducer(
      undefined,
      actions.fileDefinitions.preBuilt.received()
    );

    expect(state).toMatchObject({
      preBuiltFileDefinitions: { status: 'received', data: {} },
      userDefinedFileDefinitions: {},
    });
  });
  test('should update data on received action', () => {
    const sampleFileDefinitions = {
      definitions: [
        {
          _id: 'amazonedi850',
          name: 'Amazon VC 850',
          vendor: 'Amazon Vendor Central',
          format: 'delimited',
        },
        {
          _id: 'macysedi850outbound',
          name: "Macy's 850 Outbound",
          vendor: "Macy's",
          format: 'delimited/edifact',
        },
        {
          _id: 'thehomedepotedi997',
          name: 'The Home Depot 997',
          vendor: 'The Home Depot',
          format: 'delimited/x12',
        },
        {
          _id: 'macysedi850inbound',
          name: "Macy's 850 Inbound",
          vendor: "Macy's",
          format: 'fixed',
        },
      ],
    };
    const state = reducer(
      undefined,
      actions.fileDefinitions.preBuilt.received(sampleFileDefinitions)
    );

    expect(state).toMatchObject({
      preBuiltFileDefinitions: {
        status: 'received',
        data: {
          edi: [
            {
              format: 'delimited',
              label: 'Amazon VC 850',
              value: 'amazonedi850',
              vendor: 'Amazon Vendor Central',
            },
            {
              format: 'delimited/x12',
              label: 'The Home Depot 997',
              value: 'thehomedepotedi997',
              vendor: 'The Home Depot',
            },
          ],
          ediFact: [
            {
              format: 'delimited/edifact',
              label: "Macy's 850 Outbound",
              value: 'macysedi850outbound',
              vendor: "Macy's",
            },
          ],
          fixed: [
            {
              format: 'fixed',
              label: "Macy's 850 Inbound",
              value: 'macysedi850inbound',
              vendor: "Macy's",
            },
          ],
        },
      },
      userDefinedFileDefinitions: {},
    });
  });
  test('should update template with the received definition on received action', () => {
    const sampleFileDefinitions = {
      definitions: [
        {
          _id: 'amazonedi850',
          name: 'Amazon VC 850',
          vendor: 'Amazon Vendor Central',
          format: 'delimited',
        },
      ],
    };
    const fileDefinitionsReceivedState = reducer(
      undefined,
      actions.fileDefinitions.preBuilt.received(sampleFileDefinitions)
    );
    const state = reducer(
      fileDefinitionsReceivedState,
      actions.fileDefinitions.definition.preBuilt.received(
        { generate: {}, parse: {} },
        'edi',
        'amazonedi850'
      )
    );

    expect(state).toMatchObject({
      preBuiltFileDefinitions: {
        data: {
          edi: [
            {
              format: 'delimited',
              label: 'Amazon VC 850',
              value: 'amazonedi850',
              vendor: 'Amazon Vendor Central',
              template: { generate: {}, parse: {} },
            },
          ],
        },
        status: 'received',
      },
      userDefinedFileDefinitions: {},
    });
  });
  test('should update status as error on receivedError action', () => {
    const requestedState = reducer(
      undefined,
      reducer(undefined, actions.fileDefinitions.preBuilt.request())
    );
    const state = reducer(
      requestedState,
      actions.fileDefinitions.preBuilt.receivedError('Error Occured')
    );

    expect(state).toMatchObject({
      preBuiltFileDefinitions: {
        status: 'error',
        errorMessage: 'Error Occured',
      },
      userDefinedFileDefinitions: {},
    });
  });
});


import React from 'react';
import { cloneDeep } from 'lodash';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HttpMappingAssistant from './HttpMappingAssistant_afe';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore, mockPostRequestOnce } from '../../../test/test-utils';

async function initHttpMappingAssistant({props = {} } = {}) {
  const initialStore = cloneDeep(reduxStore);

  initialStore.getState().session.editors = {
    httpPreview: {
      data: {
        data: '',
        rule: 'rule',
      },
      autoEvaluate: false,
      result: '',
    },
  };
  initialStore.getState().session.mapping = {
    mapping: {
      importId: props.importId,
      preview: {
        data: {
          data: [
            {
              name: 'name',
            },
          ],
          rule: 'whatRule',
        },
      },
    },
  };
  initialStore.getState().data.resources = {
    imports: [{
      _id: props.importId,
      _connectionId: 'connection_id_1',
      _integrationId: '_integration_id',
      //   adaptorType,
      mappings: {
        fields: [{
          generate: 'generate_1',
        }, {
          generate: 'generate_2',
          lookupName: 'lookup_name',
        }],
        lists: [{
          generate: 'item',
          fields: [],
        }],
      },
      salesforce: {
        sObjectType: 'sObjectType',
      },
      http: {
        requestMediaType: 'xml',
        body: ['GET'],
      },
    }],
    connections: [{
      _id: 'connection_id_1',
      http: {

      },
    }],
  };
  const ui = (
    <MemoryRouter>
      <HttpMappingAssistant {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('HttpMappingAssistant_afe component test cases', () => {
  runServer();

  test('HttpMappingAssistant_afe component for HTTP import', async () => {
    mockPostRequestOnce('/api/processors/handleBar/getContext', {});
    await initHttpMappingAssistant({
      props: {
        importId: 'import_id',
      },
    });
    expect(screen.queryByText(/Preview/i)).toBeInTheDocument();
  });
});

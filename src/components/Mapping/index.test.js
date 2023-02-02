import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TableBodyContent from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mockGetRequestOnce, mutateStore } from '../../test/test-utils';
import customCloneDeep from '../../utils/customCloneDeep';

async function initTableBodyContent({ props = {}, mappingStatus = 'requested', editorType = '', mappingPreviewType = '', adaptorType = 'NetSuiteImport' } = {}) {
  const initialStore = customCloneDeep(reduxStore);

  mutateStore(initialStore, draft => {
    draft.session.mapping = {
      mapping: {
        status: mappingStatus,
        mappings: [],
        subRecordMappingId: props.subRecordMappingId,
      },
    };
    draft.data.resources = {
      imports: [{
        _id: props.importId,
        _connectionId: 'connection_id_1',
        adaptorType,
        mappings: {
          fields: [],
          lists: [{
            generate: 'item',
            fields: [{
              generate: 'celigo_inventorydetail',
              subRecordMapping: {
                recordType: 'inventorydetail',
                jsonPath: 'mediaitem',
              },
            }],
          }],
        },
        http: {
          requestMediaType: 'xml',
        },
      }],
    };
    draft.session.editors = {
      [`mappings-${props.importId}`]: {
        editorType,
        mappingPreviewType,
      },
    };
  });
  const ui = (
    <MemoryRouter>
      <TableBodyContent {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  Redirect: jest.fn(({ to }) => `Redirected to ${to}`),
}));

describe('tableBodyContent component Test cases', () => {
  runServer();
  test('should pass the initial render with default values', async () => {
    mockGetRequestOnce('/api/processors', {
      handlebars: {},
    });
    await initTableBodyContent();

    expect(screen.queryByText('Redirected to //editor/mappings-undefined')).toBeInTheDocument();
  });

  test('should pass the initial render with mappingStatus received', async () => {
    mockGetRequestOnce('/api/processors', {
      handlebars: {},
    });
    const { utils } = await initTableBodyContent({
      mappingStatus: 'received',
      mappingPreviewType: 'http',
      adaptorType: 'HTTPImport',
      props: {
        subRecordMappingId: 'item[*].celigo_inventorydetail',
        importId: 'import_id_1',
      },
    });

    expect(screen.queryByText('Redirected to //editor/mappings-undefined')).not.toBeInTheDocument();
    expect(utils.container).not.toBeEmptyDOMElement();
  });
});

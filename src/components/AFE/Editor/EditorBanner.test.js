import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import EditorBanner from './EditorBanner';

async function initEditorBanner(props = {editorId: 'mappings'}) {
  const initialStore = reduxStore;

  const mustateState = draft => {
    draft.data = {
      resources: {
        imports: [{
          _id: 'imp-123',
          adaptorType: 'HTTPImport',
          mappings: [{extract: 'abc', generate: 'def', dataType: 'string'}],
          mapping: {fields: [{extract: 'abc', generate: 'def', dataType: 'string'}], lists: []},
        }],
      },
    };
    draft.session =
    {
      mapping: {
        mapping: {
          importId: 'imp-123',
          version: 1,
        },
      },
      editors: {
        mappings: {
          resourceId: 'imp-123',
          resourceType: 'imports',
          editorType: 'mappings',
        },
      },
    };
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<EditorBanner {...props} />, { initialStore });
}
describe('editorBanner tests', () => {
  test('should able to test EditorBanner in mappings editor panel', async () => {
    await initEditorBanner();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Your 1.0 mappings are for reference only and will be ignored. Delete all 2.0 mappings to use 1.0 mappings instead.')).toBeInTheDocument();
  });
  test('should able to test EditorBanner without Data', async () => {
    await initEditorBanner({editorId: 'httpRelativeURI'});
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});


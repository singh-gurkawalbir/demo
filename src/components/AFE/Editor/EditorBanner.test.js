/* global describe, test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';
import EditorBanner from './EditorBanner';

async function initEditorBanner(props = {editorId: 'mappings'}) {
  const initialStore = reduxStore;

  initialStore.getState().data = {
    resources: {
      imports: [{
        _id: 'imp-123',
        adaptorType: 'HTTPImport',
        mappings: [{extract: 'abc', generate: 'def', dataType: 'string'}],
        mapping: {fields: [{extract: 'abc', generate: 'def', dataType: 'string'}], lists: []},
      }],
    },
  };
  initialStore.getState().session =
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

  return renderWithProviders(<EditorBanner {...props} />, { initialStore });
}
describe('EditorBanner tests', () => {
  test('Should able to test EditorBanner in mappings editor panel', async () => {
    await initEditorBanner();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Your 1.0 mappings are for reference only and will be ignored. Delete all 2.0 mappings to use 1.0 mappings instead.')).toBeInTheDocument();
  });
  test('Should able to test EditorBanner without Data', async () => {
    await initEditorBanner({editorId: 'httpRelativeURI'});
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});


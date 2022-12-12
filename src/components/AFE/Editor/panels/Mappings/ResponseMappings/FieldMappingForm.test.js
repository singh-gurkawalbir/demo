/* global describe, test, expect */
import React from 'react';
import {screen} from '@testing-library/react';
import {renderWithProviders, reduxStore} from '../../../../../../test/test-utils';
import FieldMappingForm from './FieldMappingForm';

const initialStore = reduxStore;

initialStore.getState().session.responseMapping = { mapping: {
  mappings: [
    {
      extract: 'id',
      generate: 'responseID',
      key: '54eajgANHf',
    },
  ],
  flowId: '62f0bdfaf8b63672312bbe36',
  resourceId: '62e6897976ce554057c0f28f',
  resourceType: 'imports',
  status: 'received',
  mappingsCopy: [
    {
      extract: 'i',
      generate: 'responseID',
      key: '54eajgANHf',
    },
  ],
}};
describe('FieldMappingForm for responemapping test cases', () => {
  test('should show the form for response mapping', () => {
    renderWithProviders(
      <FieldMappingForm flowId="62f0bdfaf8b63672312bbe36" resourceId="62e6897976ce554057c0f28f" />, {initialStore});
    const textboxes = screen.getAllByRole('textbox');
    const textContent = textboxes.map(each => each.textContent);

    expect(textContent).toEqual(['id', 'responseID', '', '']);
  });
});

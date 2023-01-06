
import React from 'react';
import metadata from './salesforceLookupFilter';
import RefreshSearchFilters from '../Editor/actions/RefreshSearchFilters';

describe('salesforceLookupFilter metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toBe('salesforceLookupFilter');
    expect(label).toBe('Define lookup criteria');
    expect(fieldId).toBeUndefined();
    expect(description).toBeUndefined();
    expect(panels[0].title({editorId: 'editorId'})).toEqual(<RefreshSearchFilters editorId="editorId" />);
  });
});


import React from 'react';
import metadata from './netsuiteLookupFilter';
import RefreshSearchFilters from '../Editor/actions/RefreshSearchFilters';

describe('netsuiteLookupFilter metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toBe('netsuiteLookupFilter');
    expect(label).toBe('Define lookup criteria');
    expect(fieldId).toBeUndefined();
    expect(description).toBeUndefined();
    expect(panels[0].title({editorId: 'editorId'})).toEqual(<RefreshSearchFilters editorId="editorId" />);
  });
});

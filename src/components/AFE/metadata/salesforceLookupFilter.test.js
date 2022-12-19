/* global describe, test, expect */
import React from 'react';
import metadata from './salesforceLookupFilter';
import RefreshSearchFilters from '../Editor/actions/RefreshSearchFilters';

describe('salesforceLookupFilter metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toEqual('salesforceLookupFilter');
    expect(label).toEqual('Define lookup criteria');
    expect(fieldId).toEqual(undefined);
    expect(description).toEqual(undefined);
    expect(panels[0].title({editorId: 'editorId'})).toEqual(<RefreshSearchFilters editorId="editorId" />);
  });
});

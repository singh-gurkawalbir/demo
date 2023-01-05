
import React from 'react';
import metadata from './salesforceQualificationCriteria';
import RefreshSearchFilters from '../Editor/actions/RefreshSearchFilters';

describe('salesforceQualificationCriteria metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toBe('salesforceQualificationCriteria');
    expect(label).toBe('Field specific qualification criteria');
    expect(fieldId).toBeUndefined();
    expect(description).toBeUndefined();
    expect(panels[0].title({editorId: 'editorId'})).toEqual(<RefreshSearchFilters editorId="editorId" />);
  });
});

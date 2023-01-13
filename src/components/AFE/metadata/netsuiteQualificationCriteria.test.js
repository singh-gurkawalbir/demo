
import React from 'react';
import metadata from './netsuiteQualificationCriteria';
import RefreshSearchFilters from '../Editor/actions/RefreshSearchFilters';

describe('netsuiteQualificationCriteria metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toBe('netsuiteQualificationCriteria');
    expect(label).toBe('Field specific qualification criteria');
    expect(fieldId).toBeUndefined();
    expect(description).toBeUndefined();
    expect(panels[0].title({editorId: 'editorId'})).toEqual(<RefreshSearchFilters editorId="editorId" />);
  });
});

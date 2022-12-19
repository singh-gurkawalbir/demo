/* global describe, test, expect */
import React from 'react';
import metadata from './salesforceQualificationCriteria';
import RefreshSearchFilters from '../Editor/actions/RefreshSearchFilters';

describe('salesforceQualificationCriteria metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toEqual('salesforceQualificationCriteria');
    expect(label).toEqual('Field specific qualification criteria');
    expect(fieldId).toEqual(undefined);
    expect(description).toEqual(undefined);
    expect(panels[0].title({editorId: 'editorId'})).toEqual(<RefreshSearchFilters editorId="editorId" />);
  });
});

/* global describe, test, beforeEach, expect */
import { screen } from '@testing-library/react';
import React from 'react';
import ResourceName from '.';
import { getCreatedStore } from '../../../../store';
import { renderWithProviders } from '../../../../test/test-utils';

let initialStore;

function initResourceName(resourceId, resourceType, exportData) {
  initialStore.getState().data.resources.exports = [
    exportData,
  ];
  const ui = (
    <ResourceName resourceId={resourceId} resourceType={resourceType} />
  );

  return renderWithProviders(ui, {initialStore});
}
describe('Testsuite for Resource Name', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  test('should test the resource name', () => {
    initResourceName('12345', 'exports', {
      _id: '12345',
      name: 'Test Export',
    });
    expect(screen.getByText(/test export/i)).toBeInTheDocument();
  });
  test('should test the resource id', () => {
    initResourceName('12345', 'exports', {
      _id: '12345',
    });
    expect(screen.getByText(/12345/i)).toBeInTheDocument();
  });
  test('should test the empty dom when there is no resource id', () => {
    const { utils } = initResourceName('', 'exports');

    expect(utils.container).toBeEmptyDOMElement();
  });
});

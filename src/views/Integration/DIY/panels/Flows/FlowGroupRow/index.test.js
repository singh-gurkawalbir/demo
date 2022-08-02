/* global describe, test, expect, */
import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter} from 'react-router-dom';
import {renderWithProviders} from '../../../../../../test/test-utils';
import FlowGroupRow from '.';

describe('FlowGroupRow UI tests', () => {
  test('should render empty DOM when sectionId is not present in the url', () => {
    const props = {rowData: {}, flows: []};
    const {utils} = renderWithProviders(<MemoryRouter><FlowGroupRow {...props} /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should render empty DOM when sectionId is unassigned and "hasUnassignedSection" is false', () => {
    const props = {rowData: {sectionId: 'unassigned'}, flows: [], hasUnassignedSection: false};
    const {utils} = renderWithProviders(<MemoryRouter><FlowGroupRow {...props} /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should not display the SortableHandle component by default', () => {
    const props = {rowData: {sectionId: 'unassigned'}, flows: []};

    renderWithProviders(<MemoryRouter><FlowGroupRow {...props} /></MemoryRouter>);
    expect(screen.queryByText('SortableHandle')).toBeNull();
  });
});

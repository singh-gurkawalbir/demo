/* global describe, test, expect */
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ActionsRibbon from '.';
import { getCreatedStore } from '../../../../store';
import { renderWithProviders } from '../../../../test/test-utils';

const initialStore = getCreatedStore();

function initActionsRibbon(props = {}) {
  initialStore.getState().session.editors = {filecsv: {
    fieldId: 'file.csv',
    formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
    resourceId: '5b3c75dd5d3c125c88b5dd20',
    resourceType: 'imports',
    editorType: 'handlebars',
    hidePreview: true,
  },
  };

  return renderWithProviders(<MemoryRouter><ActionsRibbon {...props} /></MemoryRouter>, {initialStore});
}

describe('ActionsRibbon UI tests', () => {
  test('should pass the initial render with no editor data', () => {
    renderWithProviders(<ActionsRibbon editorId="file.csv" />);
    expect(screen.getByText('Auto preview')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  test('should render the action group with components when editor data is present', () => {
    initActionsRibbon({editorId: 'filecsv'});
    const handlebarsGuideComponent = document.querySelector('[title="Handlebars guide"]');

    expect(handlebarsGuideComponent).toBeInTheDocument();

    const toggleButton = document.querySelector('[id="toggle-layout"]');

    expect(toggleButton).toBeInTheDocument();

    screen.debug();
  });
  test('should not render the preview button group when hidePreview is true in editorData', () => {
    initActionsRibbon({editorId: 'filecsv'});
    expect(screen.queryByText('Auto preview')).toBeNull();
    expect(screen.queryByText('Preview')).toBeNull();
  });
});

/* global */
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import { HTTP_STAGES } from '../../../utils/exportPanel';
import PreviewBodyTabs from './PreviewBodyTabs';

describe('Testsuite for PreviewBodyTabs', () => {
  test('should return empty dom if state is absent', () => {
    renderWithProviders(<PreviewBodyTabs
      resourceSampleData={{}}
      handlePanelViewChange={jest.fn()}
      showDefaultPreviewBody
      availablePreviewStages={[]}
        />);

    expect(document.querySelector('.MuiBox-root').firstChild).not.toBeInTheDocument();
  });
  test('should render correct tabs when preview data status is received', () => {
    renderWithProviders(<PreviewBodyTabs
      resourceSampleData={{ status: 'received' }}
      handlePanelViewChange={jest.fn()}
      resourceType="imports"
      showDefaultPreviewBody
      availablePreviewStages={[{ value: 'preview', default: true, label: 'someLabel' }]}
        />);
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Headers')).toBeInTheDocument();
    expect(screen.getByText('someLabel')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });
  test('should render correct tabs when preview data status is error', () => {
    renderWithProviders(<PreviewBodyTabs
      resourceSampleData={{ status: 'error' }}
      resourceType="imports"
      availablePreviewStages={[{ value: 'preview', default: false, label: 'someLabel' }]}
        />);
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Headers')).toBeInTheDocument();
    expect(screen.getByText('someLabel')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });
  test('should render correct tabs with response data', () => {
    renderWithProviders(<PreviewBodyTabs
      resourceSampleData={{ status: 'received' }}
      resourceType="imports"
      previewStageDataList={{ preview: { data: [{ id: 123, name: 'test' }] } }}
      availablePreviewStages={[{ value: 'preview', default: false }]}
        />);
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Headers')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });
  test('should render correct tabs with HTTP stages', () => {
    renderWithProviders(<PreviewBodyTabs
      resourceSampleData={{ status: 'error' }}
      resourceType="exports"
      previewStageDataList={{ preview: { data: [{ someField: 'somdedate' }] } }}
      availablePreviewStages={HTTP_STAGES}
        />);
    const pressed = screen.getByRole('button', { pressed: true });

    expect(pressed).toHaveTextContent('HTTP response');
  });
});


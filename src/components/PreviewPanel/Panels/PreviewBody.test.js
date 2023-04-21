import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import { HTTP_STAGES } from '../../../utils/exportPanel';
import PreviewBody from './PreviewBody';

describe('testsuite for PreviewBody', () => {
  test('should test the Preview Body with no data', () => {
    const {utils} = renderWithProviders(<PreviewBody
      resourceSampleData={{}}
      handlePanelViewChange={jest.fn()}
      showDefaultPreviewBody
      availablePreviewStages={[]}
        />);

    expect(utils.container).toHaveTextContent('');
  });
  test('should test the Preview Body with data and with the status requested', () => {
    renderWithProviders(<PreviewBody
      resourceSampleData={{ status: 'requested' }}
      handlePanelViewChange={jest.fn()}
      resourceType="imports"
      availablePreviewStages={[{ value: 'preview', default: false }]}
        />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should test the Preview Body with data and with the status received', () => {
    renderWithProviders(<PreviewBody
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
  test('should test the Preview Body with data and with the status error', () => {
    renderWithProviders(<PreviewBody
      resourceSampleData={{ status: 'error' }}
      resourceType="imports"
      availablePreviewStages={[{ value: 'preview', default: false, label: 'someLabel' }]}
        />);
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Headers')).toBeInTheDocument();
    expect(screen.getByText('someLabel')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });
  test('should test the Preview Body with response data', () => {
    renderWithProviders(<PreviewBody
      resourceSampleData={{ status: 'received' }}
      resourceType="imports"
      previewStageDataList={{ preview: { data: [{ id: 123, name: 'test' }] } }}
      availablePreviewStages={[{ value: 'preview', default: false }]}
        />);
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Headers')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });
  test('should test the Preview Body with error data and with HTTP stages', () => {
    renderWithProviders(<PreviewBody
      resourceSampleData={{ status: 'error' }}
      resourceType="exports"
      previewStageDataList={{ preview: { data: [{ someField: 'somdedate' }] } }}
      availablePreviewStages={HTTP_STAGES}
        />);
    const pressed = screen.getByRole('button', { pressed: true });

    expect(pressed).toHaveTextContent('HTTP response');
  });
});


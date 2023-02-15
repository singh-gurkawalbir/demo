import React from 'react';
import DownloadFileWithURL from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore } from '../../test/test-utils';

async function initDownloadFileWithURL({
  downloadUrl = '',
  children = '',
  defaultAShareId = 'own',
} = {}) {
  const initialStore = reduxStore;

  initialStore.getState().user.preferences = {
    defaultAShareId,
  };
  const ui = (
    <DownloadFileWithURL downloadUrl={downloadUrl}>
      {children}
    </DownloadFileWithURL>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('DownloadFileWithURL component test cases', () => {
  runServer();
  test('should pass the intial render', () => {
    initDownloadFileWithURL();
    const downloadLink = document.querySelector(
      'a[data-testid="downloadLink"]'
    );

    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute('href', '');
  });

  test('should pass the intial render by sending a valid link', () => {
    initDownloadFileWithURL({
      downloadUrl: '/download/link',
      children: 'Download button',
    });
    const downloadLink = document.querySelector(
      'a[data-testid="downloadLink"]'
    );

    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute('href', '/download/link');
  });

  test('should pass the intial render by sending a valid link with user account', () => {
    initDownloadFileWithURL({
      downloadUrl: '/download/link',
      children: 'Download button',
      defaultAShareId: '123456',
    });
    const downloadLink = document.querySelector(
      'a[data-testid="downloadLink"]'
    );

    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute('href', '/download/link&integrator-ashareid=123456');
  });
});

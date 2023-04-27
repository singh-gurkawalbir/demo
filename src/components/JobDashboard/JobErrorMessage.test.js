
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import JobErrorMessage from './JobErrorMessage';
import { renderWithProviders } from '../../test/test-utils';

const mockExternalURL = jest.fn().mockReturnValue('test');

const mockedOpen = jest.fn().mockReturnValueOnce('testingggg');
const originalWindow = { ...window };
const windowSpy = jest.spyOn(window, 'open');

jest.mock('../../utils/window', () => ({
  __esModule: true,
  ...jest.requireActual('../../utils/window'),
  default: () => mockExternalURL,
}));
describe('testsuite for Job Error Message', () => {
  beforeEach(() => {
    windowSpy.mockImplementation(() => ({
      ...originalWindow, // In case you need other window properties to be in place
      open: mockedOpen,
    }));
  });
  afterEach(() => {
    windowSpy.mockRestore();
  });
  test('should be able to click on export record link', async () => {
    renderWithProviders(
      <JobErrorMessage
        message="test message"
        exportDataURI="https://exportURI"
        importDataURI="importURI"
      />
    );
    expect(screen.getByText(/test message/i)).toBeInTheDocument();
    const exportButton = screen.getByRole('button', {
      name: /view export record/i,
    });

    expect(exportButton).toBeInTheDocument();
    await userEvent.click(exportButton);
    expect(document.querySelector('div > div:nth-child(2) > button > span > span').className).toEqual(expect.stringContaining('MuiTouchRipple-'));
    expect(screen.getByText(/Import Id: importURI/i)).toBeInTheDocument();
  });
  test('should be able to click on import record link', async () => {
    renderWithProviders(
      <JobErrorMessage
        message="test message"
        exportDataURI="exportURI"
        importDataURI="http://importURI"
        />
    );
    expect(screen.getByText(/test message/i)).toBeInTheDocument();
    expect(screen.getByText(/Export Id: exportURI/i)).toBeInTheDocument();
    const importButton = screen.getByRole('button', {
      name: /view import record/i,
    });

    expect(importButton).toBeInTheDocument();
    await userEvent.click(importButton);
    expect(document.querySelector('div > div:nth-child(2) > button > span > span').className).toEqual(expect.stringContaining('MuiTouchRipple-'));
  });
});

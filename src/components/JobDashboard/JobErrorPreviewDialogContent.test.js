
import { screen } from '@testing-library/react';
import React from 'react';
import JobErrorPreviewDialogContent from './JobErrorPreviewDialogContent';
import { renderWithProviders } from '../../test/test-utils';

describe('testsuite for Job Error Preview Dialog Content', () => {
  test('should render the resolved, retries, remains, invalids, total and adds Job Error Preview Dialog Content when the preview data is of type string', () => {
    renderWithProviders(
      <JobErrorPreviewDialogContent
        previewData={{
          resolves: 'test resolves',
          retries: 'test retries',
          remains: 'test remains',
          invalids: 'test invalids',
          total: 'test total',
          adds: 'test adds',
        }} />
    );
    expect(screen.getByText(/test resolves/i)).toBeInTheDocument();
    expect(screen.getByText(/errors will be marked as resolved, and your error count will be decremented accordingly./i)).toBeInTheDocument();
    expect(screen.getByText(/test retries/i)).toBeInTheDocument();
    expect(screen.getByText(/errors will be retried again. Success and error counts will be updated based on the results of those retries./i)).toBeInTheDocument();
    expect(screen.getByText(/test remains/i)).toBeInTheDocument();
    expect(screen.getByText(
      /errors will remain in the error file, and no stats will be changed for these errors\./i
    )).toBeInTheDocument();
    expect(screen.getByText(/test invalids/i)).toBeInTheDocument();
    expect(screen.getByText(
      /errors have been removed from the error file, and will also be marked as resolved\./i
    )).toBeInTheDocument();
    expect(screen.getByText(/test total/i)).toBeInTheDocument();
    expect(screen.getByText(/errors are present in total\./i)).toBeInTheDocument();
    expect(screen.getByText(/test adds/i)).toBeInTheDocument();
    expect(screen.getByText(/errors have been added to error file\./i)).toBeInTheDocument();
    expect(screen.getByText(
      /please note that we highly recommend you keep a copy of all error files downloaded\. whenever a new error file is uploaded, the job stats and error data will be regenerated based on the new file\./i
    )).toBeInTheDocument();
  });
  test('should render the resolved, retries, remains, invalids, total and adds Job Error Preview Dialog Content when the preview data is of type number', () => {
    renderWithProviders(
      <JobErrorPreviewDialogContent
        previewData={{
          resolves: 1,
          retries: 2,
          remains: 3,
          invalids: 4,
          total: 5,
          adds: 6,
        }} />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/errors will be marked as resolved, and your error count will be decremented accordingly./i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/errors will be retried again. Success and error counts will be updated based on the results of those retries./i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(
      /errors will remain in the error file, and no stats will be changed for these errors\./i
    )).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText(
      /errors have been removed from the error file, and will also be marked as resolved\./i
    )).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText(/errors are present in total\./i)).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText(/errors have been added to error file\./i)).toBeInTheDocument();
    expect(screen.getByText(
      /please note that we highly recommend you keep a copy of all error files downloaded\. whenever a new error file is uploaded, the job stats and error data will be regenerated based on the new file\./i
    )).toBeInTheDocument();
  });
  test('should render the resolved, retries, remains, invalids, total and adds Job Error Preview Dialog Content when the preview data is undefined', () => {
    renderWithProviders(
      <JobErrorPreviewDialogContent
        previewData={{
        }} />
    );
    expect(screen.getByText(/errors will be marked as resolved, and your error count will be decremented accordingly./i)).toBeInTheDocument();
    expect(screen.getByText(/errors will be retried again. Success and error counts will be updated based on the results of those retries./i)).toBeInTheDocument();
    expect(screen.getByText(
      /errors will remain in the error file, and no stats will be changed for these errors\./i
    )).toBeInTheDocument();
    expect(screen.getByText(
      /errors have been removed from the error file, and will also be marked as resolved\./i
    )).toBeInTheDocument();
    expect(screen.getByText(/errors are present in total\./i)).toBeInTheDocument();
    expect(screen.getByText(/errors have been added to error file\./i)).toBeInTheDocument();
    expect(screen.getByText(
      /please note that we highly recommend you keep a copy of all error files downloaded\. whenever a new error file is uploaded, the job stats and error data will be regenerated based on the new file\./i
    )).toBeInTheDocument();
  });
});

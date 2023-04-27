
import React from 'react';
import { screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../../test/test-utils';
import FieldHelp from './index';
import { getCreatedStore } from '../../../store';

const initialStore = getCreatedStore();

function initFieldHelp(props = {}) {
  return renderWithProviders(<FieldHelp {...props} />, {initialStore});
}

describe('FieldHelp UI tests', () => {
  test('should pass the initial render', async () => {
    const props = {
      id: 'name',
      label: 'Name',
      helpKey: 'script.name',
      resourceContext: {
        resourceId: '6141dc92474f1660f700dd62',
        resourceType: 'scripts',
      },
      noApi: false,
    };

    initFieldHelp(props);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Please name your script record so that you can easily reference it from other parts of the application.')).toBeInTheDocument();
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    const thumbsup = document.querySelector('[data-test="yesContentHelpful"]');
    const thumbsdown = document.querySelector('[data-test="noContentHelpful"]');

    expect(thumbsup).toBeInTheDocument();
    expect(thumbsdown).toBeInTheDocument();
  });
});


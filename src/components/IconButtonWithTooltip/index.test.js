
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import IconButtonWithTooltip from '.';
import HelpContent from '../HelpContent';

jest.mock('../HelpContent', () => ({
  __esModule: true,
  ...jest.requireActual('../HelpContent'),
  default: () =>
    (
      <>
        <div>
          Help
        </div>
      </>
    )
  ,
}));
describe('iconButtonWithTooltip UI tests', () => {
  test('should render the button', () => {
    const props = { tooltipProps: {title: 'title'} };

    renderWithProviders(<IconButtonWithTooltip {...props} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  test('should render the component on clicking the button', async () => {
    const props = {children: <HelpContent />, tooltipProps: {title: 'title'} };

    renderWithProviders(<IconButtonWithTooltip {...props} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Help')).toBeInTheDocument();
  });
  test('should display any string passed as children on clicking the button', async () => {
    const props = {children: 'Hello there', tooltipProps: {title: 'title'}};

    renderWithProviders(<IconButtonWithTooltip {...props} />);

    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Hello there/i)).toBeInTheDocument();
  });
});

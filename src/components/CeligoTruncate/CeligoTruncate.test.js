
import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import CeligoTruncate from '.';

jest.mock('@mui/material', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material'),
  Tooltip: props => (
    <>
      <div>
        ToolTipCalled
      </div>
      <div>
        {props.children}
      </div>
    </>
  ),
}));
describe('Celigo truncate test', () => {
  test('should test when truncate happens', async () => {
    render(
      <CeligoTruncate
        isLoggable lines={1} placement="left" ellipsis="..."
        className="some-name" enterDelay={0}>
        hover<br />
        hover2
      </CeligoTruncate>);
    await waitFor(() => expect(screen.queryByText('ToolTipCalled')).toBeInTheDocument());
    const tooltipcalled = screen.getByText('ToolTipCalled');

    expect(tooltipcalled).toBeInTheDocument();
  });
  test('should test when truncate does not happens', async () => {
    render(
      <CeligoTruncate
        isLoggable lines={3} placement="left" ellipsis="..."
        className="some-name" enterDelay={0} lineHeight={100}>
        hover<br />
        hover2
      </CeligoTruncate>);
    const tooltipcalled = screen.queryByText('ToolTipCalled');

    expect(tooltipcalled).not.toBeInTheDocument();
  });
});

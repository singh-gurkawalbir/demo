/* global describe, test, expect ,jest */
import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import CeligoTruncate from '.';

jest.mock('react-truncate', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        className="some-name"
        width="0">
        <span />
        <span>
          hover
          <br />
        </span>
      </span>
    );
  },
}));
jest.mock('@material-ui/core', () => ({
  __esModule: true,
  ...jest.requireActual('@material-ui/core'),
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
  test('when truncate happens', async () => {
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
    const hover = screen.getByText('hover');

    expect(hover).toBeInTheDocument();
  });
  test('when truncate doesn happens', async () => {
    render(
      <CeligoTruncate
        isLoggable lines={3} placement="left" ellipsis="..."
        className="some-name" enterDelay={0}>
        hover<br />
        hover2
      </CeligoTruncate>);

    const tooltipcalled = screen.queryByText('ToolTipCalled');

    expect(tooltipcalled).not.toBeInTheDocument();
    const hover = screen.getByText('hover');

    expect(hover).toBeInTheDocument();
  });
});

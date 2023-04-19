
import React, { useState } from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {renderWithProviders} from '../../test/test-utils';
import HelpContent from '.';
import ArrowPopper from '../ArrowPopper';
import actions from '../../actions';

describe('helpContent UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('should display the contents of the HelpContent arrowPopper', async () => {
    const TestComponent = props => {
      const [anchorEl, setAnchorEl] = useState(null);
      const popperRef = React.useRef(null);

      return (
        <>
          <ClickAwayListener onClickAway={() => { setAnchorEl(null); }}>
            <button type="button" onClick={event => { setAnchorEl(event.currentTarget); }}>click</button>
          </ClickAwayListener>
          <ArrowPopper
            placement="right"
            id="helpBubble"
            open={!!anchorEl}
            disablePortal
            popperRef={popperRef}
            anchorEl={anchorEl}
          >
            <HelpContent {...props} />
          </ArrowPopper>
        </>

      );
    };

    renderWithProviders(
      <TestComponent
        title="Sample title"
        caption="Sample caption"
      >
        This is the sample text
      </TestComponent>
    );
    const clickButton = screen.getByRole('button', { name: 'click'});

    await userEvent.click(clickButton);
    expect(screen.getByText('This is the sample text')).toBeInTheDocument();
    expect(screen.getByText('Sample title')).toBeInTheDocument();
    expect(screen.getByText(/Was this helpful/i)).toBeInTheDocument();
    const thumbsup = document.querySelector('[data-test="yesContentHelpful"]');
    const thumbsdown = document.querySelector('[data-test="noContentHelpful"]');

    expect(thumbsup).toBeInTheDocument();
    expect(thumbsdown).toBeInTheDocument();

    const closeButton = document.querySelector('[data-test="close"]');

    await userEvent.click(closeButton);
    expect(screen.queryByText('This is the sample text')).not.toBeInTheDocument();
  });
  test('should run the respective dipatch function when "yes" is clicked', async () => {
    const props = { children: 'This is the sample text', title: 'Sample title', caption: 'Sample caption' };

    renderWithProviders(<HelpContent {...props} />);
    const thumbsup = document.querySelector('[data-test="yesContentHelpful"]');

    await userEvent.click(thumbsup);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.app.postFeedback(undefined, undefined, true));
  });
  test('should display the user entry field when clicked "No"', async () => {
    const props = { children: 'This is the sample text', title: 'Sample title', caption: 'Sample caption' };

    renderWithProviders(<HelpContent {...props} />);
    const thumbsdown = document.querySelector('[data-test="noContentHelpful"]');

    await userEvent.click(thumbsdown);
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('How can we make this information more helpful?')).toBeInTheDocument();
  });
  test('should make a dispatch call with the user input when clicked on "submit"', async () => {
    const props = { children: 'This is the sample text', title: 'Sample title', caption: 'Sample caption' };

    renderWithProviders(<HelpContent {...props} />);
    const thumbsdown = document.querySelector('[data-test="noContentHelpful"]');

    expect(thumbsdown).toBeInTheDocument();
    await userEvent.click(thumbsdown);
    const input = screen.getByPlaceholderText('How can we make this information more helpful?');

    await userEvent.type(input, 'sample userInput');
    await userEvent.click(screen.getByText(/Submit/i));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.app.postFeedback(undefined, undefined, false, 'sample userInput'));
  });
  test('should render the help content with blank heading and content when props are not passed', () => {
    renderWithProviders(<HelpContent />);
    expect(screen.getByText(/Was this helpful/i)).toBeInTheDocument();
    const thumbsup = document.querySelector('[data-test="yesContentHelpful"]');
    const thumbsdown = document.querySelector('[data-test="noContentHelpful"]');

    expect(thumbsup).toBeInTheDocument();
    expect(thumbsdown).toBeInTheDocument();
  });

  test('should display the contents of the HelpContent when supportFeedback is false and onClose', async () => {
    const onClose = jest.fn();

    renderWithProviders(
      <HelpContent
        title="Sample title"
        supportFeedback={false}
        onClose={onClose}
      >
        This is the sample text
      </HelpContent>
    );
    expect(screen.getByText('This is the sample text')).toBeInTheDocument();
    expect(screen.getByText('Sample title')).toBeInTheDocument();
    expect(screen.queryByText(/Was this helpful/i)).not.toBeInTheDocument();
    const thumbsup = document.querySelector('[data-test="yesContentHelpful"]');
    const thumbsdown = document.querySelector('[data-test="noContentHelpful"]');

    expect(thumbsup).not.toBeInTheDocument();
    expect(thumbsdown).not.toBeInTheDocument();
    const closeButton = document.querySelector('[data-test="close"]');

    await userEvent.click(closeButton);
    expect(onClose).toBeCalled();
  });
});

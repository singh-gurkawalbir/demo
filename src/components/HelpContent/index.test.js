
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import {renderWithProviders} from '../../test/test-utils';
import HelpContent from '.';
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
  test('should display the contents of the HelpContent arrowPopper', () => {
    const props = { children: 'This is the sample text', title: 'Sample title', caption: 'Sample caption' };

    renderWithProviders(<HelpContent {...props} />);
    expect(screen.getByText('This is the sample text')).toBeInTheDocument();
    expect(screen.getByText('Sample title')).toBeInTheDocument();
    expect(screen.getByText(/Was this helpful/i)).toBeInTheDocument();
    const thumbsup = document.querySelector('[data-test="yesContentHelpful"]');
    const thumbsdown = document.querySelector('[data-test="noContentHelpful"]');

    expect(thumbsup).toBeInTheDocument();
    expect(thumbsdown).toBeInTheDocument();
  });
  test('should run the respective dipatch function when "yes" is clicked', () => {
    const props = { children: 'This is the sample text', title: 'Sample title', caption: 'Sample caption' };

    renderWithProviders(<HelpContent {...props} />);
    const thumbsup = document.querySelector('[data-test="yesContentHelpful"]');

    userEvent.click(thumbsup);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.app.postFeedback(undefined, undefined, true));
  });
  test('should display the user entry field when clicked "No"', () => {
    const props = { children: 'This is the sample text', title: 'Sample title', caption: 'Sample caption' };

    renderWithProviders(<HelpContent {...props} />);
    const thumbsdown = document.querySelector('[data-test="noContentHelpful"]');

    userEvent.click(thumbsdown);
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('How can we make this information more helpful?')).toBeInTheDocument();
  });
  test('should make a dispatch call with the user input when clicked on "submit"', () => {
    const props = { children: 'This is the sample text', title: 'Sample title', caption: 'Sample caption' };

    renderWithProviders(<HelpContent {...props} />);
    const thumbsdown = document.querySelector('[data-test="noContentHelpful"]');

    expect(thumbsdown).toBeInTheDocument();
    userEvent.click(thumbsdown);
    const input = screen.getByPlaceholderText('How can we make this information more helpful?');

    userEvent.type(input, 'sample userInput');
    userEvent.click(screen.getByText(/Submit/i));
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
});

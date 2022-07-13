/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import {renderWithProviders} from '../../test/test-utils';
import HelpContent from '.';
import actions from '../../actions';

describe('HelpContent UI tests', () => {
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
    screen.debug();
    expect(screen.getByText('This is the sample text')).toBeInTheDocument();
    expect(screen.getByText('Sample title')).toBeInTheDocument();
    expect(screen.getByText('Sample caption')).toBeInTheDocument();
    expect(screen.getByText(/Was this helpful/i)).toBeInTheDocument();
    expect(screen.getByText(/Yes/)).toBeInTheDocument();
    expect(screen.getByText(/No/i)).toBeInTheDocument();
  });
  test('should run the respective dipatch function when "yes" is clicked', () => {
    const props = { children: 'This is the sample text', title: 'Sample title', caption: 'Sample caption' };

    renderWithProviders(<HelpContent {...props} />);
    userEvent.click((screen.getByText(/Yes/)));
    expect(mockDispatchFn).toBeCalledWith(actions.app.postFeedback(undefined, undefined, true));
  });
  test('should display the user entry field when clicked "No"', () => {
    const props = { children: 'This is the sample text', title: 'Sample title', caption: 'Sample caption' };

    renderWithProviders(<HelpContent {...props} />);
    userEvent.click((screen.getByText(/No/)));
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Please let us know how we can improve the text area.')).toBeInTheDocument();
  });
  test('should make a dispatch call with the user input when clicked on "submit"', () => {
    const props = { children: 'This is the sample text', title: 'Sample title', caption: 'Sample caption' };

    renderWithProviders(<HelpContent {...props} />);
    userEvent.click((screen.getByText(/No/)));
    const input = screen.getByPlaceholderText('Please let us know how we can improve the text area.');

    userEvent.type(input, 'sample userInput');
    userEvent.click(screen.getByText(/Submit/i));
    expect(mockDispatchFn).toBeCalledWith(actions.app.postFeedback(undefined, undefined, false, 'sample userInput'));
  });
  test('should render the help content with blank heading and content when props are not passed', () => {
    renderWithProviders(<HelpContent />);
    expect(screen.getByText(/Was this helpful/i)).toBeInTheDocument();
    expect(screen.getByText(/Yes/)).toBeInTheDocument();
    expect(screen.getByText(/No/i)).toBeInTheDocument();
  });
});

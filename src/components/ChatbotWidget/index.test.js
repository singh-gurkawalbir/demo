/* global describe, test, expect, jest, beforeEach */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatbotWidget from '.';
import { renderWithProviders} from '../../test/test-utils';

const mockFn = jest.fn();

describe('ChatbotWidget component Test cases', () => {
  beforeEach(() => {
    renderWithProviders(<ChatbotWidget />);
    window.zE = mockFn;
  });
  test('should have the chatbot button displayed', () => {
    expect(document.querySelector('svg')).toHaveAttribute('data-test', 'open-zd-chatbot');
  });
  test('should have the zendesk script injected and should have the default launcher hidden', () => {
    const script = document.querySelector('#ze-snippet');

    expect(script).toBeInTheDocument();

    script.onload();
    expect(mockFn).toHaveBeenCalledWith('webWidget', 'hide');
  });
  test('should call the handler on clicking the button', () => {
    userEvent.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalledWith('webWidget', 'show');
  });
});

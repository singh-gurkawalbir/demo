
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import InfoIconButton from '.';

describe('infoIconButton UI tests', () => {
  test('should render the infoIcon Button', () => {
    const props = {info: 'sample info icon content'};

    renderWithProviders(<InfoIconButton {...props} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  test('should display the ArrowPopper on clicking the infoIconButton', async () => {
    const props = {info: 'sample info icon content'};

    renderWithProviders(<InfoIconButton {...props} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/sample info icon content/i)).toBeInTheDocument();
  });
  test('should render empty DOM when no info is passed', () => {
    const {utils} = renderWithProviders(<InfoIconButton />);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should close the arrowpopper when clicked outside the arrowpopper', async () => {
    const props = {info: 'sample info icon content'};

    renderWithProviders(<div>exterior<InfoIconButton {...props} /></div>);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/sample info icon content/i)).toBeInTheDocument();
    await userEvent.click(screen.getByText('exterior'));
    waitFor(() => expect(screen.queryByText(/sample info icon content/i)).toBeNull());
  });
  test('should close the arrowpopper on clicking the close button', async () => {
    const props = {info: 'sample info icon content'};
    const onClick = jest.fn();

    renderWithProviders(<div onClick={onClick}>exterior<InfoIconButton {...props} /></div>);
    await userEvent.click(screen.getByRole('button'));

    const infoText = await waitFor(() => screen.getByText(/sample info icon content/i));

    // should not close the popper on clicking inside the popper
    expect(infoText).toBeInTheDocument();
    await userEvent.click(infoText);
    expect(infoText).toBeInTheDocument();
    expect(onClick).not.toBeCalled();

    // should close the popper on clicking the close button
    const closeButton = document.querySelector('[data-test="close"]');

    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(onClick).not.toBeCalled();
    expect(screen.queryByText(/sample info icon content/i)).toBeNull();
  });
});

/* global describe, test, expect */
import React from 'react';
import { render, screen } from '@testing-library/react';
import IsLoggableContextProvider, {withIsLoggable, useIsLoggable} from '.';

function Child() {
  return <div>{useIsLoggable()}</div>;
}

function ChildComponent({isLoggable}) {
  if (isLoggable) { return <div>true is sent</div>; }

  return <div>false is sent</div>;
}
function ComponentToBeRendered({isLoggable}) {
  const props = { isLoggable};

  return withIsLoggable(ChildComponent)(props);
}

describe('IsLoggableContextProvider UI tests', () => {
  test('should test the Isloggable context', () => {
    render(<IsLoggableContextProvider isLoggable="sometext"><Child /></IsLoggableContextProvider>);
    expect(screen.getByText('sometext')).toBeInTheDocument();
  });

  test('should use withIsLoggable to send true as value', () => {
    render(<ComponentToBeRendered isLoggable />);
    expect(screen.getByText('true is sent')).toBeInTheDocument();
  });

  test('should use withIsLoggable to send false as value', () => {
    render(<ComponentToBeRendered isLoggable={false} />);
    expect(screen.getByText('false is sent')).toBeInTheDocument();
  });
});

/* global describe, test, expect, jest */
import React, { useRef } from 'react';
import {screen} from '@testing-library/react';
import useAutoScrollErrors from './useAutoScrollErrors';
import { renderWithProviders, reduxStore} from '../../test/test-utils';

describe('useAutoScrollErrors UI test cases', () => {
  const initialStore = reduxStore;

  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  const DummyComponent = ({formKey}) => {
    const formRef = useRef();

    useAutoScrollErrors({formKey, formRef});

    return <div ref={formRef}><div id="b"> Form </div></div>;
  };

  initialStore.getState().session.form = {
    _formKey: {
      fields: {
        a: {
          id: 'a',
          name: 'a',
        },
        b: {
          id: 'b',
          name: 'b',
          visible: true,
          isValid: false,
        },
      },
      fieldMeta: {
        layout: {
          type: 'collapse',
          containers: [
            {
              collapsed: true,
              fields: ['a', 'b'],
            },
          ],
        },
      },
      isValid: false,
      validationOnSaveIdentifier: true,
    },
    _key: {
      isValid: false,
    },
  };

  test('Should validate with valid formKey', async () => {
    await renderWithProviders(<DummyComponent formKey="_formKey" />, {initialStore});
    expect(screen.getByText('Form')).toBeInTheDocument();
  });
  test('Should validate without validationOnSave', async () => {
    await renderWithProviders(<DummyComponent formKey="_key" />, {initialStore});
    expect(screen.getByText('Form')).toBeInTheDocument();
  });
  test('Should validate with invalid formKey', async () => {
    await renderWithProviders(<DummyComponent />, {initialStore});
  });
});

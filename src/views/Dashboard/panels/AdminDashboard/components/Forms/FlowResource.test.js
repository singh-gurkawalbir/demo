/* eslint-disable jest/expect-expect */
import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import FlowResource from './FlowResource';
import { renderWithProviders, mutateStore } from '../../../../../../test/test-utils';
import { runServer } from '../../../../../../test/api/server';
import { getCreatedStore } from '../../../../../../store';

let initialStore = getCreatedStore();

function initFlowResource(props) {
  const mustateState = draft => {
    draft.session.editors = {FlowType: {
      value: {Filter: 'enabled'},
    },
    };
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<FlowResource {...props} />, {initialStore});
}

describe('FlowResource Component', () => {
  runServer();

  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
  });

  test('should render FlowResource component with Enable value', async () => {
    initFlowResource({func: jest.fn()});
    expect(screen.getByText('Enable')).toBeInTheDocument();
  });
});

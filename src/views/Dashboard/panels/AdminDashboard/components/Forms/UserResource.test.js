/* eslint-disable jest/expect-expect */
import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import UserResource from './UserResource';
import { renderWithProviders, mutateStore } from '../../../../../../test/test-utils';
import { runServer } from '../../../../../../test/api/server';
import { getCreatedStore } from '../../../../../../store';

let initialStore = getCreatedStore();

function initUserResource(props) {
  const mustateState = draft => {
    draft.session.editors = {UserType: {
      value: {Filter: 'accepted'},
    },
    };
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<UserResource {...props} />, {initialStore});
}

describe('UserResource Component', () => {
  runServer();

  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
  });

  test('should render UserResource component with Accept value', async () => {
    initUserResource({func: jest.fn()});
    expect(screen.getByText('Accept')).toBeInTheDocument();
  });
});

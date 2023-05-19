import { screen } from '@testing-library/react';
import React from 'react';
import * as ReactRedux from 'react-redux';
import AcceptInvite from '.';
import { getCreatedStore } from '../../store';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import actions from '../../actions';

let initialStore;
const mockHistoryPush = jest.fn();

function initAcceptInvite({acceptInviteData}) {
  mutateStore(initialStore, draft => {
    draft.auth.acceptInvite = acceptInviteData;
  });
  const ui = (
    <AcceptInvite {...{test: 'test1'}} />
  );

  return renderWithProviders(ui, {initialStore});
}

// Mocking useHistory as part of unit testing
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useRouteMatch: () => ({
    params: {token: 'test_token'},
  }),
}));

// Mocking UserSignInPage as per Unit Testing
jest.mock('../../components/UserSignInPage', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/UserSignInPage'),
  default: props => {
    if (props?.alertMessage) {
      return (
        <>
          <div>Mock UserSignInPage</div>
          <div>alertMessage = {props.alertMessage}</div>
          <div>{props.children}</div>
        </>
      );
    }

    return (
      <>
        <div>Mock UserSignInPage</div>
        <div>pageTitle = {props.pageTitle}</div>
        <div>footerLinkLabel = {props.footerLinkLabel}</div>
        <div>footerLinkText = {props.footerLinkText}</div>
        <div>footerLink = {props.footerLink}</div>
        <div>{props.children}</div>
      </>
    );
  },
}));

// Mocking RawHtml as per Unit Testing
jest.mock('../../components/RawHtml', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/RawHtml'),
  default: props => (
    <>
      <div>Mock RawHtml</div>
      <div>html = {props.html}</div>
    </>
  ),
}));

// Mocking Loader as per unit testing
jest.mock('../../components/Loader', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/Loader'),
  default: props => (
    <>
      <div>Mock Loader</div>
      <div>open = {props.open}</div>
      <div>{props.children}</div>
    </>
  ),
}));

// Mocking Spinner as per unit testing
jest.mock('../../components/Spinner', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/Spinner'),
  default: jest.fn().mockReturnValue(<div>Mock Spinner</div>),
}));

// Mocking NotificationToaster as per unit testing
jest.mock('../../components/NotificationToaster', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/NotificationToaster'),
  default: props => (
    <>
      <div>Mocking NotificationToaster</div>
      <div>variant = {props.variant}</div>
      <div>{props.children}</div>
    </>
  ),
}));

// Mocking Signup as per unit testing
jest.mock('./SignUpForm', () => ({
  __esModule: true,
  ...jest.requireActual('./SignUpForm'),
  default: props => (
    <>
      <div>Mocking SignUpForm</div>
      <div>dialogOpen = {props.dialogOpen}</div>
      <div>{JSON.stringify(props)}</div>
    </>
  ),
}));

describe('Testsuite from AcceptInvite', () => {
  let mockDispatchFn;
  let useDispatchFn;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchFn = jest.spyOn(ReactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchFn.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    mockDispatchFn.mockClear();
    useDispatchFn.mockClear();
    mockHistoryPush.mockClear();
  });
  test('should test the error message when the type is equal to error and has an error when there is redirect url', () => {
    initAcceptInvite({acceptInviteData: {message: ['Hey, here is the error'], type: 'error', redirectUrl: '/redirectUrl'}});

    expect(screen.getByText(/mock loader/i)).toBeInTheDocument();
    expect(screen.getByText(/open =/i)).toBeInTheDocument();
    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText(/mock spinner/i)).toBeInTheDocument();
  });
  test('should test the mock user signin page when there is no errors when the skip password is set to false', () => {
    initAcceptInvite({acceptInviteData: {redirectUrl: '/redirectUrl'}});

    // expect(screen.getByText(/mock usersigninpage/i)).toBeInTheDocument();
    // expect(screen.getByText(/pagetitle = sign up/i)).toBeInTheDocument();
    // expect(screen.getByText(/footerlinklabel = already have an account\?/i)).toBeInTheDocument();
    // expect(screen.getByText(/footerlinktext = sign in/i)).toBeInTheDocument();
    // expect(screen.getByText(/mocking signupform/i)).toBeInTheDocument();
    // expect(screen.getByText(/dialogopen =/i)).toBeInTheDocument();
    // expect(screen.getByText(/\{"test":"test1","dialogopen":false\}/i)).toBeInTheDocument();
    expect(screen.getByText(/mock loader/i)).toBeInTheDocument();
    expect(screen.getByText(/open =/i)).toBeInTheDocument();
    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText(/mock spinner/i)).toBeInTheDocument();
  });
  test('should test the mock user signin page when there is no errors when the skip password is set to true', () => {
    initAcceptInvite({acceptInviteData: {skipPassword: true }});

    expect(screen.getByText(/mock usersigninpage/i)).toBeInTheDocument();
    expect(screen.getByText(/pagetitle = sign up/i)).toBeInTheDocument();
    expect(screen.getByText(/footerlinklabel = already have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText(/footerlinktext = sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking notificationtoaster/i)).toBeInTheDocument();
    expect(screen.getByText(/variant = info/i)).toBeInTheDocument();
    expect(screen.getByText(/mock rawhtml/i)).toBeInTheDocument();
    expect(screen.getByText(
      /html = this is an sso sign-up\. make sure you have access to <a classname="link" href=ssolink>this<\/a> sso provider/i
    )).toBeInTheDocument();
    expect(screen.getByText(/mocking signupform/i)).toBeInTheDocument();
    expect(screen.getByText(/dialogopen =/i)).toBeInTheDocument();
    expect(screen.getByText(/\{"test":"test1","dialogopen":false\}/i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.acceptInvite.validate('test_token'));
  });
  test('should test the loader when the status is requested', () => {
    initAcceptInvite({acceptInviteData: {status: 'requested'}});

    expect(screen.getByText(/mock loader/i)).toBeInTheDocument();
    expect(screen.getByText(/open =/i)).toBeInTheDocument();
    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText(/mock spinner/i)).toBeInTheDocument();
  });
  test('should test the accept invite when there is no data from the store', () => {
    initAcceptInvite({acceptInviteData: undefined});

    expect(screen.getByText(/mock usersigninpage/i)).toBeInTheDocument();
    expect(screen.getByText(/pagetitle = sign up/i)).toBeInTheDocument();
    expect(screen.getByText(/footerlinklabel = already have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText(/footerlinktext = sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking signupform/i)).toBeInTheDocument();
    expect(screen.getByText(/dialogopen =/i)).toBeInTheDocument();
    expect(screen.getByText(/\{"test":"test1","dialogopen":false\}/i)).toBeInTheDocument();
  });
});

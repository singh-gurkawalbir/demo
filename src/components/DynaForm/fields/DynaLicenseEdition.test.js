
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import DynaLicenseEdition from './DynaLicenseEdition';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';

const mockDispatchFn = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

describe('test suite for DynaLicenseEdition field', () => {
  afterEach(() => {
    mockDispatchFn.mockClear();
  });

  test('should not render if no editions available', () => {
    const props = {
      id: 'edition',
      resourceId: 'license123',
      connectorId: 'integrationApp-123',
      formKey: 'licenses-license123',
    };

    renderWithProviders(<DynaLicenseEdition {...props} />);
    expect(document.querySelector('body > div')).toBeEmptyDOMElement();
  });

  test('should be required when creating new license', async () => {
    const props = {
      id: 'edition',
      label: 'Edition',
      resourceId: 'new-license123',
      connectorId: 'integrationApp-123',
      formKey: 'licenses-new-license123',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.connectors = [{
        _id: props.connectorId,
        twoDotZero: {
          editions: [
            {
              _id: 'id_standard',
              displayName: 'Standard',
            },
            {
              _id: 'id_premium',
              displayName: 'Premium',
            },
            {
              _id: 'id_starter',
            },
          ],
        },
      }];
    });

    const {utils: {unmount}} = renderWithProviders(<DynaLicenseEdition {...props} />, {initialStore});

    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState(props.formKey)(props.id, {required: true}));
    await userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    [
      'Please select',
      'id_starter',
      'Premium',
      'Standard',
    ].forEach(edition => expect(screen.getByRole('menuitem', {name: edition})).toBeInTheDocument());

    unmount();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.clearForceFieldState(props.formKey)(props.id));
  });
});

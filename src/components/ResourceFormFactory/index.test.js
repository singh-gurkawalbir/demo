
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import { getCreatedStore } from '../../store';
import ResourceFormFactory from '.';
import actions from '../../actions';

const mockInitPermitFn = jest.fn();
const mockOptionsHandler = jest.fn();
const mockValidationHandler = jest.fn();

jest.mock('../DynaForm', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaForm'),
  default: props => {
    const { handleInitForm, optionsHandler, validationHandler } = props || {};

    return (
      <>
        <button type="button" onClick={handleInitForm}>
          Initialize Form
        </button>
        <button type="button" onClick={optionsHandler}>
          Handle Options
        </button>
        <button type="button" onClick={validationHandler}>
          Handle Validations
        </button>
      </>
    );
  },
}));

jest.mock('../../hooks/useFormInitWithPermissions', () => ({
  __esModule: true,
  ...jest.requireActual('../../hooks/useFormInitWithPermissions'),
  default: () => { mockInitPermitFn(); },
}));

jest.mock('../../forms/formFactory/getResourceFromAssets', () => ({
  __esModule: true,
  ...jest.requireActual('../../forms/formFactory/getResourceFromAssets'),
  default: jest.fn(({isNew}) => {
    if (isNew === 'error') {
      throw new Error('Throwing Error Here');
    }

    return {
      optionsHandler: mockOptionsHandler,
      validationHandler: mockValidationHandler,
    };
  }),
}));

jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  Spinner: () => (<div>Spinner</div>),
}));

async function initResourceFormFactory(props = {}, initialStore) {
  const ui = (
    <MemoryRouter>
      <ResourceFormFactory {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('test suite for ResourceFormFactory', () => {
  let useDispatchSpy;
  let mockDispatchFn;

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
    mockDispatchFn.mockClear();
    mockInitPermitFn.mockClear();
    mockOptionsHandler.mockClear();
    mockValidationHandler.mockClear();
  });

  test('should pass initial rendering', async () => {
    await initResourceFormFactory();
    expect(screen.getByText('Spinner')).toBeInTheDocument();
  });

  test('should display form when initialisation is complete', async () => {
    const resourceType = 'exports';
    const resourceId = '2345asdf';
    const KEY = `${resourceType}-${resourceId}`;
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.resourceForm[KEY] = {
        initComplete: true,
      };
    });
    await initResourceFormFactory({resourceId, resourceType, isNew: 'error'}, initialStore);
    expect(mockInitPermitFn).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('button', {name: 'Initialize Form'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Handle Options'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Handle Validations'})).toBeInTheDocument();
  });

  test('should be able to pass the expected values', async () => {
    const onSubmitComplete = jest.fn();
    const resourceType = 'exports';
    const resourceId = '2345asdf';
    const isNew = true;
    const KEY = `${resourceType}-${resourceId}`;
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.resourceForm[KEY] = {
        initComplete: true,
        skipClose: true,
        formSaveStatus: 'complete',
      };
    });

    await initResourceFormFactory({resourceType, resourceId, onSubmitComplete, isNew}, initialStore);
    expect(mockInitPermitFn).toHaveBeenCalledTimes(2);
    expect(onSubmitComplete).toHaveBeenCalledTimes(1);

    const initButton = screen.getByRole('button', {name: 'Initialize Form'});
    const optionsButton = screen.getByRole('button', {name: 'Handle Options'});
    const validationsButton = screen.getByRole('button', {name: 'Handle Validations'});

    await userEvent.click(initButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceForm.init(
      resourceType, resourceId, isNew, true, undefined
    ));
    await userEvent.click(optionsButton);
    expect(mockOptionsHandler).toHaveBeenCalledTimes(1);
    await userEvent.click(validationsButton);
    expect(mockValidationHandler).toHaveBeenCalledTimes(1);
  });
});


import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import DynaFileTypeSelect from './DynaFileTypeSelect';

const onFieldChange = jest.fn();
const props = {userDefinitionId: '_userDefinitionId', onFieldChange, id: 'file.type', formKey: 'imports-_importId', value: 'filedefinition'};

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

async function initDynaFileTypeSelect(props = {}, fileType) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data = {
      resources: {
        filedefinitions: [
          {
            _id: '_userDefinitionId',
            format: 'delimited',
          },
          {
            _id: '_userDefinitionId1',
            format: 'fixedWidth',
          },
        ],
      },
    };
    draft.session.form = {
      'imports-_importId': {
        value: {
          '/file/type': fileType,
        },
      },
    };
  });

  return renderWithProviders(<DynaFileTypeSelect {...props} />, { initialStore });
}
describe('dynaFileTypeSelect tests', () => {
  afterEach(() => {
    onFieldChange.mockClear();
  });
  test('should render dynaSelect with fileType xml', async () => {
    await initDynaFileTypeSelect(props, 'xml');
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Please select')).toBeInTheDocument();
    expect(onFieldChange).toHaveBeenCalledWith('file.type', 'filedefinition', true);
  });
  test('should render dynaSelect with fileType csv', async () => {
    await initDynaFileTypeSelect({...props, userDefinitionId: undefined}, 'csv');
    expect(onFieldChange).not.toHaveBeenCalledWith('file.type', 'none', true);
  });
  test('should render dynaSelect with fileType xlsx', async () => {
    await initDynaFileTypeSelect(props, 'xlsx');
    expect(onFieldChange).not.toHaveBeenCalledWith('file.type', 'none', true);
  });
  test('should render dynaSelect with fileType json', async () => {
    await initDynaFileTypeSelect({...props, userDefinitionId: '_userDefinitionId1'}, 'json');
    expect(onFieldChange).toHaveBeenCalledWith('file.type', 'fixedWidth', true);
  });
  test('should render dynaSelect with fileType undefined', async () => {
    await initDynaFileTypeSelect({...props, userDefinitionId: '_userDefinitionId1'});
    expect(onFieldChange).toHaveBeenCalledWith('file.type', 'fixedWidth', true);
  });
});


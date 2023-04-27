
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../../../../actions';
import {mutateStore, renderWithProviders} from '../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../store';

import OutputFormatsList from './OutputFormatsList';

const initialStore = getCreatedStore();

function initOutputFormatsList(props = {}) {
  const mustateState = draft => {
    draft.session.mapping = {
      mapping: {
        version: 2,
        isGroupedSampleData: props.sample,
        isGroupedOutput: props.output,
        importId: '5ea16cd30e2fab71928a6166',
      },
    };
    draft.data.resources = {imports: [{_id: '5ea16cd30e2fab71928a6166', name: 'import1', file: {type: props.csv} }]};
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<OutputFormatsList {...props} />, {initialStore});
}

describe('outputFormatsList UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should pass the initial render for grouped sample data', async () => {
    initOutputFormatsList({sample: true, output: false});
    const visibleOption = screen.getByText('Create destination record { } from source rows [ ]');

    expect(visibleOption).toBeInTheDocument();
    await userEvent.click(visibleOption);
    expect(screen.getByText('Create destination rows [ ] from source rows [ ]')).toBeInTheDocument();
  });
  test('should pass the initial render when sample data is not grouped', async () => {
    initOutputFormatsList({sample: false, output: false});
    const visibleOption = screen.getByText('Create destination record { } from source record { }');

    expect(visibleOption).toBeInTheDocument();
    await userEvent.click(visibleOption);
    expect(screen.getByText('Create destination rows [ ] from source record { }')).toBeInTheDocument();
  });
  test('should pass the initial render when output data is not grouped', async () => {
    initOutputFormatsList({sample: false, output: true});
    const visibleOption = screen.getByText('Create destination rows [ ] from source record { }');

    expect(visibleOption).toBeInTheDocument();
    await userEvent.click(visibleOption);
    expect(screen.getByText('Create destination record { } from source record { }')).toBeInTheDocument();
  });
  test('should pass the initial render when both input and output data are grouped', async () => {
    initOutputFormatsList({sample: true, output: true});
    const visibleOption = screen.getByText('Create destination rows [ ] from source rows [ ]');

    expect(visibleOption).toBeInTheDocument();
    await userEvent.click(visibleOption);
    expect(screen.getByText('Create destination record { } from source rows [ ]')).toBeInTheDocument();
  });
  test('should make a dispatch call when the other option is chosen from the menu', async () => {
    initOutputFormatsList({sample: true, output: true});
    const visibleOption = screen.getByText('Create destination rows [ ] from source rows [ ]');

    expect(visibleOption).toBeInTheDocument();
    await userEvent.click(visibleOption);
    const menuoption = screen.getByText('Create destination record { } from source rows [ ]');

    await userEvent.click(menuoption);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.v2.toggleOutput('record')));
  });
});

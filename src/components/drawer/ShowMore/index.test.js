
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import actions from '../../../actions';
import ShowMore from '.';

const props = {
  count: 100,
  maxCount: 2000,
  filterKey: '_filterKey',
};

async function initShowMore(props = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.filters = {
      _filterKey: {
        _take: 100,
      },
    };
  });
  const ui = (
    <MemoryRouter>
      <ShowMore {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('ShowMore tests', () => {
  const useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
  const mockDispatchFn = jest.fn();

  useDispatchSpy.mockReturnValue(mockDispatchFn);
  test('Should able to test the ShowMore drawer is there when count< maxCount', async () => {
    await initShowMore({...props});
    expect(screen.getByText(/Viewing first 100 of 2000/i)).toBeInTheDocument();
    const loadMoreButton = screen.getByRole('button', {name: 'Load more'});

    expect(loadMoreButton).toBeInTheDocument();
    await userEvent.click(loadMoreButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.patchFilter(props.filterKey, {take: 200}));
  });

  test('Should able to test the ShowMore drawer is there when count == maxCount', async () => {
    await initShowMore({...props, count: 2000});
    expect(screen.queryByText(/Viewing first 100 of 2000/i)).not.toBeInTheDocument();
  });
});

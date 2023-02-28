
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders} from '../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../store';
import CategoryList from './CategoryList';

describe('CategoryList UI tests', () => {
  function initStoreAndRender(recordMappings) {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.integrationApps.settings['1234-4321'] = {
        response: [
          { operation: 'mappingData',
            data: {
              mappingData: {
                basicMappings: {
                  recordMappings,
                },
              },
            },
          }],
      };
    });

    return renderWithProviders(<MemoryRouter><CategoryList integrationId="4321" flowId="1234" /></MemoryRouter>, {initialStore});
  }
  test('should test when child and grandChild are provided', async () => {
    initStoreAndRender(
      [{name: 'name1',
        id: 'id1',
        children: [
          {name: 'child1', id: 'childid1', children: [{name: 'grandchild', id: 'grandchildid'}]},
        ],
      },
      ]
    );

    expect(screen.getByText('name1')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('arrow-down-icon'));
    expect(screen.getByText('child1')).toBeInTheDocument();
    expect(screen.getByText('grandchild')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('arrow-up-icon'));
    expect(screen.getByTestId('arrow-down-icon')).toBeInTheDocument();
  });
  test('shold test when no child provided', async () => {
    const {utils} = initStoreAndRender(
      [{name: 'name1',
        id: 'id1',
      },
      ],
    );

    expect(screen.getByText('name1')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('arrow-down-icon'));
    expect(utils.container.textContent).toBe('name1');
  });
});

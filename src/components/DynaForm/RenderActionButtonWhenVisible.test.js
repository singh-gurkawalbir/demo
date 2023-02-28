
import React from 'react';
import {screen} from '@testing-library/react';
import RenderActionButtonWhenVisible from './RenderActionButtonWhenVisible';
import { renderWithProviders, reduxStore, mutateStore} from '../../test/test-utils';

describe('renderActionButtonWhenVisible UI test cases', () => {
  const initialStore = reduxStore;
  const DummyComponent = () => 'Dummy';

  mutateStore(initialStore, draft => {
    draft.session.form = {
      _formKey: {
        fields: {
          FIELD1: {
            id: 'saveandclosegroup',
            name: 'FIELD1',
            label: 'field1',
            defaultValue: 'test',
          },
        },
        layout: { fields: ['FIELD1'] },
        fieldMeta: {
          actions: [
            {
              id: 'saveandclosegroup',
              visibleWhen: [
                {
                  field: 'FIELD1',
                  isNot: [''],
                },
              ],
            },
          ],
        },
      },
    };
  });

  test('should validate if action button not visible with invalid formKey', async () => {
    const props = {id: '_id', formKey: '_'};

    await renderWithProviders(
      <RenderActionButtonWhenVisible
        {...props}
      > <DummyComponent />
      </RenderActionButtonWhenVisible>, {initialStore});
    expect(screen.queryByText('Dummy')).not.toBeInTheDocument();
  });
  test('should validate if action button is visible', async () => {
    const props = {id: 'saveandclosegroup', formKey: '_formKey'};

    await renderWithProviders(
      <RenderActionButtonWhenVisible
        {...props}
      > <DummyComponent />
      </RenderActionButtonWhenVisible>, {initialStore});
    expect(screen.queryByText('Dummy')).toBeInTheDocument();
  });
});

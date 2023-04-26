
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Components from '.';
import { renderWithProviders } from '../../../../test/test-utils';

const props = {
  containers: [
    {
      type: 'collapsed',
      collapsed: false,
      label: 'General',
      fields: [
        'name',
        'description',
      ],
    },
    {
      type: 'collapsed',
      collapsed: false,
      label: 'Script content',
      fields: [
        'insertFunction',
        'content',
      ],
    },
  ],
  fieldMap: {
    name: {
      resourceId: '5ff687fa4f59bb348d41b332',
      resourceType: 'scripts',
      isLoggable: true,
      type: 'text',
      label: 'Name',
      required: true,
      fieldId: 'name',
      id: 'name',
      defaultValue: 'test',
    },
    description: {
      resourceId: '5ff687fa4f59bb348d41b332',
      resourceType: 'scripts',
      isLoggable: true,
      type: 'text',
      label: 'Description',
      fieldId: 'description',
      id: 'description',
      defaultValue: '',
    },
    insertFunction: {
      resourceId: '5ff687fa4f59bb348d41b332',
      resourceType: 'scripts',
      isLoggable: true,
      type: 'select',
      label: 'Insert function stub',
      options: [
        {
          items: [
            {
              label: 'Pre save page',
              value: 'preSavePage',
            },
            {
              label: 'Pre map',
              value: 'preMap',
            },
          ],
        },
      ],
      fieldId: 'insertFunction',
      id: 'insertFunction',
      defaultValue: '',
    },
    content: {
      resourceId: '5ff687fa4f59bb348d41b332',
      resourceType: 'scripts',
      isLoggable: true,
      defaultValue: {
        _scriptId: '5ff687fa4f59bb348d41b332',
        function: 'main',
      },
      type: 'scriptcontent',
      label: 'Edit content',
      fieldId: 'content',
      refreshOptionsOnChangesTo: [
        'insertFunction',
      ],
      id: 'content',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: false,
        label: 'General',
        fields: [
          'name',
          'description',
        ],
      },
      {
        collapsed: false,
        label: 'Script content',
        fields: [
          'insertFunction',
          'content',
        ],
      },
    ],
  },
  formKey: 'scripts-5ff687fa4f59bb348d41b332',
  resourceType: 'scripts',
  resourceId: '5ff687fa4f59bb348d41b332',
};

// jest.mock('..', () => ({
//   __esModule: true,
//   ...jest.requireActual('..'),
//   default: () => <div>Form Fragment</div>,
// }));

describe('boxComponents UI tests', () => {
  test('should pass the initial render for simple Tab component', () => {
    const Component = Components.TabComponentSimple;

    renderWithProviders(<Component {...props} />);

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Script content')).toBeInTheDocument();
  });
  test('should pass the initial render for  TabIAComponent', () => {
    const Component = Components.TabIAComponent;

    renderWithProviders(<Component {...props} />);

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Script content')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
  test('should pass the initial render for  TabIAComponent.', () => {
    const Component = Components.TabIAComponent;

    renderWithProviders(<Component {...props} />);

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Script content')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
  test('should pass the initial render for  SuiteScriptTabIACompleteSave Component', async () => {
    const Component = Components.SuiteScriptTabIACompleteSave;

    renderWithProviders(<Component {...props} />);

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Script content')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    await userEvent.click(screen.getByText('General'));
  });
  test('should pass the initial render for  TabComponentWithoutSave Component', () => {
    const Component = Components.TabComponentWithoutSave;

    renderWithProviders(<Component {...props} />);

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Script content')).toBeInTheDocument();
  });
  test('should pass the initial render for  TabComponentWithoutSave Component.', () => {
    const Component = Components.TabComponentWithoutSave;

    renderWithProviders(<Component {...props} />);

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Script content')).toBeInTheDocument();
  });
  test('should pass the initial render for  TabComponentWithoutSaveVertical Component', () => {
    const Component = Components.TabComponentWithoutSaveVertical;

    renderWithProviders(<Component {...props} />);

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Script content')).toBeInTheDocument();
  });
});

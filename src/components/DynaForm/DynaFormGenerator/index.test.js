/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import FormGenerator from '.';
import { renderWithProviders } from '../../../test/test-utils';

jest.mock('./TabComponent', () => ({
  __esModule: true,
  ...jest.requireActual('./TabComponent'),
  TabComponentSimple: () => <div>TabComponentSimple</div>,
  TabComponentWithoutSave: () => <div>TabComponentWithoutSave</div>,
  TabIAComponent: () => <div>TabIAComponent</div>,
  SuiteScriptTabIACompleteSave: () => <div>SuiteScriptTabIACompleteSave</div>,
  TabComponentWithoutSaveVertical: () => <div>TabComponentWithoutSaveVertical</div>,
}));

jest.mock('./CollapsedComponents', () => ({
  __esModule: true,
  ...jest.requireActual('./CollapsedComponents'),
  default: () => <div>Collapsed Component</div>,
}));
jest.mock('./IndentedComponents', () => ({
  __esModule: true,
  ...jest.requireActual('./IndentedComponents'),
  default: () => <div>Indented Component</div>,
}));
jest.mock('./BoxComponents', () => ({
  __esModule: true,
  ...jest.requireActual('./BoxComponents'),
  default: () => <div>Box Component</div>,
}));
jest.mock('./BoxWrapperComponents', () => ({
  __esModule: true,
  ...jest.requireActual('./BoxWrapperComponents'),
  default: () => <div>BoxWrapper Component</div>,
}));
jest.mock('./ColumnComponents', () => ({
  __esModule: true,
  ...jest.requireActual('./ColumnComponents'),
  default: () => <div>Column Component</div>,
}));
jest.mock('../../Form/FormFragment', () => ({
  __esModule: true,
  ...jest.requireActual('../../Form/FormFragment'),
  default: props => {
    const fields = props.defaultFields.map(e => <div key={e}>{e.defaultValue}</div>);

    return fields;
  },
}));

const props = {
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
      defaultValue: 'default name',
    },
    description: {
      resourceId: '5ff687fa4f59bb348d41b332',
      resourceType: 'scripts',
      isLoggable: true,
      type: 'text',
      label: 'Description',
      fieldId: 'description',
      id: 'description',
      defaultValue: 'default description',
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
      defaultValue: 'default function',
    },
    content: {
      resourceId: '5ff687fa4f59bb348d41b332',
      resourceType: 'scripts',
      isLoggable: true,
      defaultValue: 'default content',
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
    fields: [
      'name',
      'description',
    ],
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
};

describe('DynaFormGenerator UI tests', () => {
  test('should pass the initial render with default form values', () => {
    props.layout.type = 'collapse';
    renderWithProviders(<FormGenerator {...props} />);
    expect(screen.getByText('Collapsed Component')).toBeInTheDocument();
    expect(screen.getByText('default name')).toBeInTheDocument();
    expect(screen.getByText('default description')).toBeInTheDocument();         // default name and default description are the mocked default values present in the form //
  });
  test('should render the BoxComponent when layout type is "box"', () => {
    props.layout.type = 'box';
    renderWithProviders(<FormGenerator {...props} />);
    expect(screen.getByText('Box Component')).toBeInTheDocument();
    expect(screen.getByText('default name')).toBeInTheDocument();
    expect(screen.getByText('default description')).toBeInTheDocument();
  });
  test('should render the BoxWrapperComponent when layout type is "boxWrapper"', () => {
    props.layout.type = 'boxWrapper';
    renderWithProviders(<FormGenerator {...props} />);
    expect(screen.getByText('BoxWrapper Component')).toBeInTheDocument();
    expect(screen.getByText('default name')).toBeInTheDocument();
    expect(screen.getByText('default description')).toBeInTheDocument();
  });
  test('should render the IndentedComponent when layout type is "indent"', () => {
    props.layout.type = 'indent';
    renderWithProviders(<FormGenerator {...props} />);
    expect(screen.getByText('Indented Component')).toBeInTheDocument();
    expect(screen.getByText('default name')).toBeInTheDocument();
    expect(screen.getByText('default description')).toBeInTheDocument();
  });
  test('should render the columnComponent when layout type is "column"', () => {
    props.layout.type = 'column';
    renderWithProviders(<FormGenerator {...props} />);
    expect(screen.getByText('Column Component')).toBeInTheDocument();
    expect(screen.getByText('default name')).toBeInTheDocument();
    expect(screen.getByText('default description')).toBeInTheDocument();
  });
  test('should render the BoxComponent when layout type is "tabIA"', () => {
    props.layout.type = 'tabIA';
    renderWithProviders(<FormGenerator {...props} />);
    expect(screen.getByText('TabIAComponent')).toBeInTheDocument();
    expect(screen.getByText('default name')).toBeInTheDocument();
    expect(screen.getByText('default description')).toBeInTheDocument();
  });
  test('should render the BoxComponent when layout type is "suitScriptTabIA"', () => {
    props.layout.type = 'suitScriptTabIA';
    renderWithProviders(<FormGenerator {...props} />);
    expect(screen.getByText('SuiteScriptTabIACompleteSave')).toBeInTheDocument();
    expect(screen.getByText('default name')).toBeInTheDocument();
    expect(screen.getByText('default description')).toBeInTheDocument();
  });
  test('should render the TabComponent when layout type is "tab"', () => {
    props.layout.type = 'tab';
    renderWithProviders(<FormGenerator {...props} />);
    expect(screen.getByText('TabComponentSimple')).toBeInTheDocument();
    expect(screen.getByText('default name')).toBeInTheDocument();
    expect(screen.getByText('default description')).toBeInTheDocument();
  });
  test('should render the TabComponent when layout type is "tabWithoutSave"', () => {
    props.layout.type = 'tabWithoutSave';
    renderWithProviders(<FormGenerator {...props} />);
    expect(screen.getByText('TabComponentWithoutSave')).toBeInTheDocument();
    expect(screen.getByText('default name')).toBeInTheDocument();
    expect(screen.getByText('default description')).toBeInTheDocument();
  });
  test('should render the TabComponentWithoutSaveVertical component when layout type is "verticalTabWithoutSave"', () => {
    props.layout.type = 'verticalTabWithoutSave';
    renderWithProviders(<FormGenerator {...props} />);
    expect(screen.getByText('TabComponentWithoutSaveVertical')).toBeInTheDocument();
    expect(screen.getByText('default name')).toBeInTheDocument();
    expect(screen.getByText('default description')).toBeInTheDocument();
  });
  test('should render a form with default field values when layout type does match any of the above', () => {
    props.layout.type = '';
    renderWithProviders(<FormGenerator {...props} />);
    const functonFields = screen.getAllByText('default name');
    const contentFields = screen.getAllByText('default description');

    expect(functonFields).toHaveLength(2);
    expect(contentFields).toHaveLength(2);
  });
});

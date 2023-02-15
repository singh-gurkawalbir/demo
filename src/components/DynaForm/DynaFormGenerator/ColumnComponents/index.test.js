
import React from 'react';
import { screen } from '@testing-library/react';
import ColumnComponent from '.';
import { renderWithProviders } from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initColumnComponent(props = {}) {
  initialStore.getState().data.resources = {scripts: [{
    _id: '5ff687fa4f59bb348d41b332',
    lastModified: '2022-10-06T16:26:46.934Z',
    createdAt: '2021-01-07T04:03:06.229Z',
    name: 'test',
  }]};
  initialStore.getState().session.form = {'scripts-5ff687fa4f59bb348d41b332': {fields: props.fields, validationOnSaveIdentifier: true}};

  return renderWithProviders(<ColumnComponent {...props} />, {initialStore});
}

const props = {
  classes: {
    container: 'class-containers',
    child: 'class-child',
  },
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

describe('collapsed Components UI tests', () => {
  test('should pass the initial render', () => {
    props.fields = [{visible: true, id: 'name', isValid: false}, {visible: 'true', id: 'description', isValid: false}, {visible: 'true', id: 'content', isValid: false}, {visible: 'true', id: 'insertFunction', isValid: false}];
    initColumnComponent(props);
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Script content')).toBeInTheDocument();
  });
  test('should not render a container when all the fields corresponding to the container are not mapped', () => {
    props.fields = [{visible: true, id: 'name'}, {visible: 'true', id: 'description'}];
    initColumnComponent(props);
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.queryByText('Script content')).toBeNull();
  });
});

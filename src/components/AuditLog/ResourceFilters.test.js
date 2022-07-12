/* eslint-disable react/jsx-closing-tag-location */
/* global describe,expect, test */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {screen} from '@testing-library/react';
import {ResourceTypeFilter, ResourceIdFilter} from './ResourceFilters';
import {renderWithProviders} from '../../test/test-utils';

const resourceDetails = {
  integrations: {
    integration_id_1: {
      name: 'integration_one',
    },
    integration_id_2: {
      name: 'integration_two',
      _connectorId: 'integration_id_2',
    },
  },
  'transfers/invited': {},
  'ui/assistants': {},
  flows: {
    flow_id_1: {
      id: 'flow_one',
      _integrationId: 'integration_id_2',
      numImports: 2,
      disabled: true,
    },
  },
  exports: {
    export_id_1: {
      name: 'export_one',
    },
  },
  imports: {
    import_id_1: {
      name: 'import_one',
    },
    import_id_2: {
      name: 'import_two',
    },
  },
};
const filters = {
  resourceType: 'all',
  _resourceId: 'all',
  byUser: 'all',
  source: 'all',
};
const affectedResources = {
  flow: [
    'flow_id_1',
  ],
  integration: [
    'integration_id_2',
  ],
  import: [
    'import_id_2',
  ],
  connection: [
    'connection_id_3',
  ],
};

describe('UI test cases for resource type filters', () => {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  test('Resource filter to return null when resource type can be any of acccestokens, connections, stacks, scripts, apis', () => {
=======
  test('should render empty DOM,when resource type is one of acccestokens, connections, stacks, scripts, apis', () => {
>>>>>>> Stashed changes
=======
  test('should render empty DOM,when resource type is one of acccestokens, connections, stacks, scripts, apis', () => {
>>>>>>> Stashed changes
    const {utils: {container}} = renderWithProviders(<MemoryRouter><ResourceTypeFilter resourceType="connections" resourceDetails={resourceDetails} /> </MemoryRouter>);

    expect(container.childElementCount).toBe(0);
  });
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  test('Resource filter options when resource type is not provided', () => {
=======
  test('should display all the resource options when clicked on Select resource type', () => {
>>>>>>> Stashed changes
=======
  test('should display all the resource options when clicked on Select resource type', () => {
>>>>>>> Stashed changes
    renderWithProviders(<MemoryRouter><ResourceTypeFilter filters={filters} resourceDetails={resourceDetails} /> </MemoryRouter>);
    const resourceType = screen.getByText('Select resource type');

    expect(resourceType).toBeInTheDocument();
    userEvent.click(resourceType);
    const resourceOptions = screen.getAllByRole('option');

    expect(resourceOptions).toHaveLength(17);
  });

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  test('Resource filter options with resource type as integrations and _connectorId present', () => {
=======
  test('should display 6 options,when resource type is integrations and _connectorId is present', () => {
>>>>>>> Stashed changes
=======
  test('should display 6 options,when resource type is integrations and _connectorId is present', () => {
>>>>>>> Stashed changes
    renderWithProviders(<MemoryRouter><ResourceTypeFilter resourceType="integrations" resourceId="integration_id_2" filters={filters} resourceDetails={resourceDetails} /> </MemoryRouter>);
    const resourceType = screen.getByText('Select resource type');

    expect(resourceType).toBeInTheDocument();
    userEvent.click(resourceType);
    const resourceOptions = screen.getAllByRole('option');

    expect(resourceOptions).toHaveLength(6);
    const defaultType = screen.getByRole('option', {name: /Select resource type/i});

    expect(defaultType).toBeInTheDocument();
  });

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  test('Resource filter options with resource type as integrations and _connectorId not present', () => {
=======
  test('should display all the options,when resource type is integrations and _connectorId is not present', () => {
>>>>>>> Stashed changes
=======
  test('should display all the options,when resource type is integrations and _connectorId is not present', () => {
>>>>>>> Stashed changes
    renderWithProviders(<MemoryRouter><ResourceTypeFilter resourceType="integrations" resourceId="integration_id_1" filters={filters} resourceDetails={resourceDetails} /> </MemoryRouter>);
    const resourceType = screen.getByText('Select resource type');

    expect(resourceType).toBeInTheDocument();
    userEvent.click(resourceType);
    const resourceOptions = screen.getAllByRole('option');

    expect(resourceOptions).toHaveLength(17);
  });
});

describe('UI test cases for resource Id filters', () => {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  test('Resource Id filter should return null', () => {
=======
  test('should render empty DOM', () => {
>>>>>>> Stashed changes
=======
  test('should render empty DOM', () => {
>>>>>>> Stashed changes
    const {utils: {container}} = renderWithProviders(<MemoryRouter><ResourceIdFilter
      resourceType="integrations" resourceId="integration_id_1" resourceDetails={resourceDetails} affectedResources={affectedResources}
      filters={filters} />
    </MemoryRouter>);

    expect(container.childElementCount).toEqual(0);
  });
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  test("Resource Id filter with option 'All' is visible with no menuoptions when filters.resourcetype is not present in affectedResources", () => {
=======
  test("should display the option 'All' with no menuoptions when filters.resourcetype is not present in affectedResources", () => {
>>>>>>> Stashed changes
=======
  test("should display the option 'All' with no menuoptions when filters.resourcetype is not present in affectedResources", () => {
>>>>>>> Stashed changes
    renderWithProviders(<MemoryRouter><ResourceIdFilter
      resourceType="integrations" resourceId="integration_id_1" resourceDetails={resourceDetails} affectedResources={affectedResources}
      filters={{
        resourceType: 'connection',
        _resourceId: 'all',
        byUser: 'all',
        source: 'all',
      }} classes={{formControl: 'makeStyles-formControl'}} />
    </MemoryRouter>);

    expect(screen.getByText('All')).toBeInTheDocument();
  });
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  test("Resource Id filter with option 'All' is visible with other menuoptions when filters.resourcetype is present in affectedResources but not resourceDetails", () => {
=======
  test("should display the option 'All' with other menuoptions when filters.resourcetype is present in affectedResources but not resourceDetails", () => {
>>>>>>> Stashed changes
=======
  test("should display the option 'All' with other menuoptions when filters.resourcetype is present in affectedResources but not resourceDetails", () => {
>>>>>>> Stashed changes
    renderWithProviders(<MemoryRouter><ResourceIdFilter
      resourceType="integrations" resourceId="integration_id_1" resourceDetails={resourceDetails} affectedResources={affectedResources}
      filters={{
        resourceType: 'connection',
        _resourceId: 'all',
        byUser: 'all',
        source: 'all',
      }} classes={{formControl: 'makeStyles-formControl'}} />
    </MemoryRouter>);

    expect(screen.getByText('All')).toBeInTheDocument();
  });
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  test("Resource Id filter with option 'All' is visible with other menuoptions when filters.resourcetype is present in affectedResources and resourceDetails", () => {
=======
  test("should display the option 'All' with other menuoptions when filters.resourcetype is present in affectedResources and resourceDetails", () => {
>>>>>>> Stashed changes
=======
  test("should display the option 'All' with other menuoptions when filters.resourcetype is present in affectedResources and resourceDetails", () => {
>>>>>>> Stashed changes
    renderWithProviders(<MemoryRouter><ResourceIdFilter
      resourceType="integrations" resourceId="integration_id_1" resourceDetails={resourceDetails} affectedResources={affectedResources}
      filters={{
        resourceType: 'flow',
        _resourceId: 'all',
        byUser: 'all',
        source: 'all',
      }} classes={{formControl: 'makeStyles-formControl'}} />
    </MemoryRouter>);

    expect(screen.getByText('All')).toBeInTheDocument();
  });
});

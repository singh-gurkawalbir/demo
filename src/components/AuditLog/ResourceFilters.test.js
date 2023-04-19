import React from 'react';
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

describe('uI test cases for resource type filters', () => {
  test('should render empty DOM when resource type is one of accestokens, connections, stacks, scripts, apis', () => {
    const {utils} = renderWithProviders(<ResourceTypeFilter resourceType="connections" resourceDetails={resourceDetails} />);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should display the "Select Resource Type" dropdown when no resourceType is passed and should display all the 17 options on clicking it', async () => {
    renderWithProviders(<ResourceTypeFilter filters={filters} resourceDetails={resourceDetails} />);
    const resourceType = screen.getByText('Select resource type');

    expect(resourceType).toBeInTheDocument();
    await userEvent.click(resourceType);
    const resourceOptions = screen.getAllByRole('option');

    expect(resourceOptions).toHaveLength(17);
  });

  test('should display the applicable filter options when resource type is integrations and _connectorId is present', async () => {
    renderWithProviders(<ResourceTypeFilter resourceType="integrations" resourceId="integration_id_2" filters={filters} resourceDetails={resourceDetails} />);
    const resourceType = screen.getByText('Select resource type');

    expect(resourceType).toBeInTheDocument();
    await userEvent.click(resourceType);
    const resourceOptions = screen.getAllByRole('option');

    expect(resourceOptions).toHaveLength(6);
    const defaultType = screen.getByRole('option', {name: /Select resource type/i});

    expect(defaultType).toBeInTheDocument();
  });

  test('should display all the available options when resource type is integrations and _connectorId is not present', async () => {
    renderWithProviders(<ResourceTypeFilter resourceType="integrations" resourceId="integration_id_1" filters={filters} resourceDetails={resourceDetails} />);
    const resourceType = screen.getByText('Select resource type');

    expect(resourceType).toBeInTheDocument();
    await userEvent.click(resourceType);
    const resourceOptions = screen.getAllByRole('option');

    expect(resourceOptions).toHaveLength(13);
  });
});

describe('uI test cases for resource Id filters', () => {
  test('should render empty DOM when filters.resourceType is "all"', () => {
    const {utils} = renderWithProviders(<ResourceIdFilter
      resourceType="integrations" resourceId="integration_id_1" resourceDetails={resourceDetails} affectedResources={affectedResources}
      filters={filters} />
    );

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should display ResourceId filter with option "All" with no menuoptions when filters.resourcetype is not present in affectedResources', async () => {
    renderWithProviders(<ResourceIdFilter
      resourceType="integrations" resourceId="integration_id_1" resourceDetails={resourceDetails} affectedResources={affectedResources}
      filters={{
        resourceType: 'connections',
        _resourceId: 'all',
        byUser: 'all',
        source: 'all',
      }} classes={{formControl: 'makeStyles-formControl'}} />
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    await userEvent.click(screen.getByText('All'));
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });
  test('should display ResourceId filter with option "All" without menuoptions when filters.resourcetype is present in affectedResources but not in resourceDetails', async () => {
    renderWithProviders(<ResourceIdFilter
      resourceType="integrations" resourceId="integration_id_1" resourceDetails={resourceDetails} affectedResources={affectedResources}
      filters={{
        resourceType: 'connection',
        _resourceId: 'all',
        byUser: 'all',
        source: 'all',
      }} classes={{formControl: 'makeStyles-formControl'}} />
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    await userEvent.click(screen.getByText('All'));
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });
  test('should display ResourceId filter with option "All" is visible with other menuoptions when filters.resourcetype is present in affectedResources and in resourceDetails', async () => {
    renderWithProviders(<ResourceIdFilter
      resourceType="integrations" resourceId="integration_id_1" resourceDetails={resourceDetails} affectedResources={affectedResources}
      filters={{
        resourceType: 'flow',
        _resourceId: 'all',
        byUser: 'all',
        source: 'all',
      }} classes={{formControl: 'makeStyles-formControl'}} />
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    await userEvent.click(screen.getByText('All'));
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });
});

/* eslint-disable no-plusplus */
import { reduce } from 'lodash';
import { applicationsList } from '../constants/applications';
import {
  NETSUITE_BUNDLE_URL,
  SALESFORCE_DA_PACKAGE_URL,
  INSTALL_STEP_TYPES,
} from './constants';
import { rdbmsSubTypeToAppType } from './resource';
import { capitalizeFirstLetter } from './string';

export const getTemplateUrlName = applications => {
  if (!applications || !Array.isArray(applications) || !applications.length) return;
  function appName(app) {
    return capitalizeFirstLetter(app);
  }

  if (applications.length === 1) {
    return `${appName(applications[0])}-${appName(applications[0])}`;
  }

  return applications.map(appName).join('-').replace(/\./g, '');
};

export const getApplication = conn => {
  if (!conn) {
    return {};
  }
  const applications = applicationsList();
  const app = applications.find(a => {
    if (conn.assistant) {
      return a.id === conn.assistant;
    }

    if (conn.type === 'rdbms' && conn.rdbms) {
      return a.id === rdbmsSubTypeToAppType(conn.rdbms.type);
    }

    if (conn.type === 'http' && conn.http?.formType === 'rest') {
      return a.id === 'rest';
    }

    if (conn.type === 'http' && conn.http?.formType === 'graph_ql') {
      return a.id === 'graph_ql';
    }

    return a.id === conn.type;
  }) || {};

  return { name: app.name, id: app.id };
};

export default {
  getDependentResources: components => {
    if (!components || !Array.isArray(components)) {
      return [];
    }

    return components.map(component => ({
      resourceType: `${component.model.toLowerCase()}s`,
      id: component._id,
    }));
  },
  getInstallSteps: previewData => {
    const connectionMap = {};
    const netsuiteBundleNeededForConnections = [];
    const salesforceBundleNeededForConnections = [];
    const installSteps = [];

    if (!previewData || !previewData.objects) {
      return {connectionMap, installSteps};
    }
    const {
      Connection: connections,
      Export: exportDocs,
      Import: importDocs,
    } = reduce(
      previewData.objects,
      (draft, obj) => {
        if (!draft[obj.model]) {
          draft[obj.model] = [];
        }

        draft[obj.model].push(obj.doc);

        return draft;
      },
      {}
    );

    if (previewData.stackRequired) {
      installSteps.push({
        name: 'Configure Stack',
        description: 'Please provide Stack details',
        type: INSTALL_STEP_TYPES.STACK,
        completed: false,
        imageURL: 'images/icons/icon/stacks.png',
        options: {
          stackProvided: previewData.stackProvided,
        },
      });
    }

    (connections || []).forEach(conn => {
      connectionMap[conn._id] = conn;
      const { name: connectionTypeName, id: connectionType} = getApplication(conn);

      installSteps.push({
        name: conn.name,
        _connectionId: conn._id,
        description: `Please configure ${connectionTypeName} connection`,
        type: INSTALL_STEP_TYPES.CONNECTION,
        completed: false,
        options: {
          connectionType,
        },
      });
    });
    (exportDocs || []).forEach(exp => {
      const conn = connections?.find(c => c._id === exp._connectionId);

      if (
        (((exp?.netsuite || {}).type === 'restlet' &&
          exp?.netsuite?.restlet?.recordType) ||
          (exp?.type === 'distributed' && conn?.type === 'netsuite')) &&
          (!netsuiteBundleNeededForConnections.includes(conn))
      ) {
        netsuiteBundleNeededForConnections.push(conn);
      }

      if (exp?.type === 'distributed' && conn?.type === 'salesforce' && !salesforceBundleNeededForConnections.includes(conn)) {
        salesforceBundleNeededForConnections.push(conn);
      }
    });
    (importDocs || []).forEach(imp => {
      const conn = connections?.find(c => c._id === imp._connectionId);

      if (imp.distributed && conn?.type === 'netsuite' && (!netsuiteBundleNeededForConnections.includes(conn))) {
        netsuiteBundleNeededForConnections.push(conn);
      }
    });

    netsuiteBundleNeededForConnections.forEach((conn, index) => installSteps.push({
      key: `NetSuite account ${index + 1}`,
      installURL: NETSUITE_BUNDLE_URL,
      imageURL: 'images/company-logos/netsuite.png',
      completed: false,
      description: `Please install Integrator bundle in ${
        netsuiteBundleNeededForConnections.length > 1 ? conn.name : 'NetSuite'
      } account`,
      name: 'Integrator Bundle',
      application: 'netsuite',
      type: INSTALL_STEP_TYPES.INSTALL_PACKAGE,
      options: {},
    }));

    salesforceBundleNeededForConnections.forEach((conn, index) => installSteps.push({
      key: `Salesforce account ${index + 1}`,
      imageURL: 'images/company-logos/salesforce.png',
      installURL: SALESFORCE_DA_PACKAGE_URL,
      completed: false,
      application: 'salesforce',
      description: `Please install Integrator bundle in ${
        salesforceBundleNeededForConnections.length > 1 ? conn.name : 'Salesforce'
      } account`,
      name: 'Integrator Adaptor Package',
      type: INSTALL_STEP_TYPES.INSTALL_PACKAGE,
      options: {},
    }));

    return {
      connectionMap,
      installSteps,
    };
  },
};

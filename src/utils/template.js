/* eslint-disable no-plusplus */
import { some, reduce } from 'lodash';
import applications from '../constants/applications';
import {
  NETSUITE_BUNDLE_URL,
  SALESFORCE_DA_PACKAGE_URL,
  INSTALL_STEP_TYPES,
} from './constants';

export default {
  getDependentResources: components =>
    components.map(component => ({
      resourceType: `${component.model.toLowerCase()}s`,
      id: component._id,
    })),
  getInstallSteps: previewData => {
    const connectionMap = {};
    const installSteps = [];
    let netsuiteConnFound = false;
    let salesforceConnFound = false;
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

      if (
        (conn.type === 'netsuite' && netsuiteConnFound) ||
        (conn.type === 'salesforce' && salesforceConnFound)
      ) {
        return;
      }

      if (conn.type === 'netsuite') {
        netsuiteConnFound = true;
      }

      if (conn.type === 'salesforce') {
        salesforceConnFound = true;
      }

      const app =
        applications.find(
          a => a.id === (conn.assistant ? conn.assistant : conn.type)
        ) || {};
      const connectionType = app.name;

      installSteps.push({
        name: conn.name,
        _connectionId: conn._id,
        description: `Please configure ${connectionType} connection`,
        type: INSTALL_STEP_TYPES.CONNECTION,
        completed: false,
        options: {
          connectionType,
        },
      });
    });
    const netsuiteBundleNeeded =
      some(exportDocs || [], exp => {
        const conn = connections.find(c => c._id === exp._connectionId);

        return (
          ((exp.netsuite || {}).type === 'restlet' &&
            exp.netsuite.restlet.recordType) ||
          (exp.type === 'distributed' && conn.type === 'netsuite')
        );
      }) ||
      some(importDocs || [], imp => {
        const conn = connections.find(c => c._id === imp._connectionId);

        return imp.distributed && conn.type === 'netsuite';
      });
    const salesforceBundleNeeded = some(exportDocs || [], exp => {
      const conn = connections.find(c => c._id === exp._connectionId);

      return exp.type === 'distributed' && conn.type === 'salesforce';
    });

    if (netsuiteBundleNeeded) {
      installSteps.push({
        installURL: NETSUITE_BUNDLE_URL,
        imageURL: 'images/company-logos/netsuite.png',
        completed: false,
        description: 'Please install Integrator bundle in NetSuite account',
        name: 'Integrator Bundle',
        application: 'netsuite',
        type: INSTALL_STEP_TYPES.INSTALL_PACKAGE,
        options: {},
      });
    }

    if (salesforceBundleNeeded) {
      installSteps.push({
        imageURL: 'images/company-logos/salesforce.png',
        installURL: SALESFORCE_DA_PACKAGE_URL,
        completed: false,
        application: 'salesforce',
        description: 'Please install Integrator bundle in Salesforce account',
        name: 'Integrator Adaptor Package',
        type: INSTALL_STEP_TYPES.INSTALL_PACKAGE,
        options: {},
      });
    }

    return {
      connectionMap,
      installSteps,
    };
  },
};

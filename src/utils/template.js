/* eslint-disable no-plusplus */
import * as _ from 'lodash';
import applications from '../constants/applications';
import { NETSUITE_BUNDLE_URL, SALESFORCE_DA_PACKAGE_URL } from './constants';

export default {
  getInstallSteps: previewData => {
    const connectionMap = {};
    const installSteps = [];
    let index = -1;
    let netsuiteConnFound = false;
    let salesforceConnFound = false;
    let netsuiteBundleNeeded = false;
    let salesforceBundleNeeded = false;
    const {
      Connection: connections,
      Export: exportDocs,
      Import: importDocs,
    } = _.reduce(
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
        type: 'Stack',
        __index: index++,
        completed: false,
        imageURL: '/images/icons/icon/stacks.png',
        options: {
          stackProvided: previewData.stackProvided,
        },
      });
    }

    connections.forEach(conn => {
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
        type: 'Connection',
        completed: false,
        __index: index++,
        options: {
          connectionType: conn.type,
          assistant: conn.assistant,
          displayName: conn.name,
        },
      });
    });
    exportDocs.forEach(exp => {
      if (
        (exp.netsuite || {}).type === 'restlet' &&
        exp.netsuite.restlet.recordType
      ) {
        netsuiteBundleNeeded = true;
      }

      if (exp.type === 'distributed') {
        const conn = connections.find(c => c._id === exp._connectionId);

        if (conn.type === 'netsuite') {
          netsuiteBundleNeeded = true;
        } else if (conn.type === 'salesforce') {
          salesforceBundleNeeded = true;
        }
      }
    });
    importDocs.forEach(imp => {
      if (imp.distributed) {
        const conn = connections.find(c => c._id === imp._connectionId);

        if (conn.type === 'netsuite') {
          netsuiteBundleNeeded = true;
        }
      }
    });

    if (netsuiteBundleNeeded) {
      installSteps.push({
        installURL: NETSUITE_BUNDLE_URL,
        completed: false,
        description: 'Please install Integrator bundle in NetSuite account',
        name: 'Integrator Bundle',
        __index: index++,
        type: 'installPackage',
      });
    }

    if (salesforceBundleNeeded) {
      installSteps.push({
        imageURL: '/images/company-logos/salesforce.png',
        installURL: SALESFORCE_DA_PACKAGE_URL,
        completed: false,
        description: 'Please install Integrator bundle in Salesforce account',
        name: 'Integrator Adaptor Package',
        __index: index++,
        type: 'installPackage',
      });
    }

    return {
      connectionMap,
      installSteps,
    };
  },
};

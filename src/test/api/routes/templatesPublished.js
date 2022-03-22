import { API } from '../utils';

export default API.get('/api/templates/published', [
  {
    _id: '5d9eb2c7224c6042d7a2fc98',
    name: '135',
    user: {
      name: 'swarna suvarchala 123',
      company: 'celigo',
    },
    lastModified: '2019-10-18T06:59:48.542Z',
  },
  {
    _id: '5e932e1fd133807f066f3ba0',
    name: '3PL Central - NetSuite',
    description: 'Sync Inventory Adjustments, Inventory Receivers, Shipment Confirmations, Items, Sales Orders, Purchase Orders and Purchase Order Receipts between 3PL Central and NetSuite.',
    imageURL: 'https://s3.amazonaws.com/labs-template-images/celigolabs_1.png',
    websiteURL: 'http://www.celigo.com/ipaas-integration-platform/',
    applications: [
      '3plcentral',
      'netsuite',
    ],
    user: {
      name: 'Templates Team',
      company: 'Celigo - Templates Team',
    },
    lastModified: '2021-12-29T06:54:35.001Z',
  },
  {
    _id: '5fc88f506cfe5b44bb966951',
    name: '3dcart regression',
    applications: [
      '3dcart',
    ],
    user: {
      name: 'suvarchala',
      company: '',
    },
    lastModified: '2020-12-03T07:10:24.098Z',
  },
  {
    _id: '5d4aa1dcdaf8cb66639f0a89',
    name: 'ADP Workforce Now (API) - Acumatica',
    description: 'Sync Employees between ADP Workforce Now and Acumatica.\n\nNote: This is an API based integration and you need to have the ADP API access to use this template.',
    imageURL: 'https://s3.amazonaws.com/labs-template-images/celigolabs_1.png',
    websiteURL: 'http://www.celigo.com/ipaas-integration-platform/',
    applications: [
      'acumatica',
      'adp',
    ],
    user: {
      name: 'Templates Team',
      company: 'Celigo - Templates Team',
    },
    lastModified: '2022-02-01T08:51:34.092Z',
  },
  {
    _id: '5cf91c45a7e1ec44234fea75',
    name: 'ADP Workforce Now (API) - Azure Active Directory',
    description: 'Sync Employees between ADP Workforce Now and Azure Active Directory.\n\nNote: This is an API based integration and you need to have the ADP API access to use this template.',
    imageURL: 'https://s3.amazonaws.com/labs-template-images/celigolabs_1.png',
    websiteURL: 'http://www.celigo.com/ipaas-integration-platform/',
    applications: [
      'adp',
      'azureactivedirectory',
    ],
    user: {
      name: 'Templates Team',
      company: 'Celigo - Templates Team',
    },
    lastModified: '2022-02-01T08:51:58.042Z',
  },
]);

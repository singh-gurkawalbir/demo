import { API } from '../utils';

export default API.get('/api/licenses', [
  {
    _id: '5ca5c856ec5c172792285f54',
    created: '2019-04-04T09:03:18.211Z',
    lastModified: '2019-04-04T09:06:54.579Z',
    expires: '2022-05-04T09:06:54.578Z',
    type: 'integrator',
    tier: 'premium',
    numAddOnFlows: 1400,
    trialEndDate: '2019-05-04T09:06:54.578Z',
    supportTier: 'essential',
    numSandboxAddOnFlows: 500,
    resumable: false,
  },
  {
    _id: '61baae033f236054eee504bd',
    created: '2021-12-16T03:09:55.371Z',
    lastModified: '2022-01-15T03:57:21.820Z',
    type: 'connector',
    _connectorId: '5d1ef1765f96fa1577cf251f',
    opts: {
      addonLicenses: [
        {
          licenses: [
            {
              addOnEdition: 'premium',
            },
            {
              addOnEdition: 'premium',
            },
            {
              addOnEdition: 'premium',
            },
          ],
          type: 'store',
        },
        {
          type: 'addon',
          licenses: [
            {
              addOnId: 'transferOrder',
            },
            {
              addOnId: 'transferOrder',
            },
            {
              addOnId: 'fbaInventoryAdjustment',
            },
          ],
        },
      ],
      connectorEdition: 'premium',
    },
    _integrationId: '61baae033f236054eee504c3',
    sandbox: false,
    resumable: false,
    trialEndDate: '2022-01-15T03:09:55.368Z',
  },
]);

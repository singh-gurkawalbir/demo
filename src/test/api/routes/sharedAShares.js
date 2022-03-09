import { API } from '../utils';

export default API.get('/api/shared/ashares', [
  {
    _id: '618cc96475f94b333a55bbd3',
    dismissed: true,
    accessLevel: 'administrator',
    integrationAccessLevel: [],
    ownerUser: {
      _id: '5feda6fdae2e896a3f3c5cbf',
      email: 'dhilip.s@celigo.com',
      name: 'Dhilip S',
      company: 'Dhilip',
      preferences: {
        environment: 'production',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: 'h:mm:ss a',
        drawerOpened: true,
        defaultAShareId: 'own',
        scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
        showReactSneakPeekFromDate: '2019-11-05',
        showReactBetaFromDate: '2019-12-26',
        dashboard: {
          view: 'list',
          pinnedIntegrations: [
            '619f77445324e30fbb2a541c',
            '61f3e489aae2457e6ea838b6',
            '61f8ed0929a80b4b8134eb25',
            '61fa1ab7a6e61314fcdf8d86',
            '6203f8193ac01960c714e5ab',
            '60ee8aa598d5d30b37795033',
            '60f548a995933011558120f5',
            '61bb11b9c9995f173361c4e2',
          ],
        },
        expand: 'Resources',
        fbBottomDrawerHeight: 522,
      },
      allowedToPublish: true,
      timezone: 'Asia/Calcutta',
      useErrMgtTwoDotZero: true,
    },
  },
  {
    _id: '61dc35f368a1f148356e9b5e',
    dismissed: true,
    integrationAccessLevel: [
      {
        _integrationId: '611257aca39a7b5605ce2bdc',
        accessLevel: 'manage',
      },
    ],
    ownerUser: {
      _id: '60dad90c6ea2a002756f6a86',
      email: 'srilekha.tirumala@celigo.com',
      name: 'Srilekha Tirumala',
      company: 'Celigo',
      useErrMgtTwoDotZero: true,
      preferences: {
        environment: 'production',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: 'h:mm:ss a',
        scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
        showReactSneakPeekFromDate: '2019-11-05',
        showReactBetaFromDate: '2019-12-26',
        defaultAShareId: 'own',
        expand: 'Resources',
        fbBottomDrawerHeight: 421,
        drawerOpened: true,
        dashboard: {
          view: 'tile',
        },
      },
      timezone: 'Asia/Calcutta',
    },
  },
]);

import { API } from '../utils';

export default API.get('/api/preferences', {
  environment: 'production',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: 'h:mm:ss a',
  scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
  lastLoginAt: '2021-02-23T10:57:09.194Z',
  defaultAShareId: 'own',
  recentActivity: {
    production: {
      integration: '5cc9bd00581ace2bec7754eb',
      flow: '602d298186768419ca01101a',
    },
  },
  dashboard: {
    filters: {
      hideEmpty: true,
      status: '',
    },
    tilesOrder: [
      'none-sb',
      '5ea6afb3dedba94094c71d9a',
      '5ea7ad428922b87e3b2f25d5',
    ],
    view: 'tile',
  },
  pagination: {
    exports: {
      pageSize: 1000,
    },
    imports: {
      pageSize: 1000,
    },
    recyclebin: {
      pageSize: 1000,
    },
    jobErrors: {
      pageSize: 1000,
    },
  },
  showReactSneakPeekFromDate: '2019-11-05',
  showReactBetaFromDate: '2019-12-26',
  drawerOpened: true,
  expand: 'Tools',
  fbBottomDrawerHeight: 208,
});

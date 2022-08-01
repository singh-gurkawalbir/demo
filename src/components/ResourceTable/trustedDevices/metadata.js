import DeleteDevice from './actions/Delete';

export default {
  useColumns: () => {
    const columns = [{
      key: 'name',
      heading: 'Name',
      Value: ({rowData: r}) => `${r.browser} ${r.os}`,
    }];

    return columns;
  },
  useRowActions: () => [DeleteDevice],
};

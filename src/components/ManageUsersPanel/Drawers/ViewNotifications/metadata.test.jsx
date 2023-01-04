
import viewNotificationsMetadata from './metadata';

describe('metdata flows test cases', () => {
  test('should pass the initial render with default value', () => {
    const conns = [
      {
        _id: 'c1',
      },
      {
        _id: 'c2',
      },
      {
        _id: 'c3',
      },
      {
        _id: 'c4',
        _integrationId: 'i2',
      }, {
        _id: 'c5',
      }, {
        _id: 'c6',
        _integrationId: 'i3',
      }, {
        _id: 'c7',
        _integrationId: 'i2',
      },
    ];
    const flows = [
      {
        _id: 'f1',
        _integrationId: 'i1',
      },
      {
        _id: 'f2',
        _integrationId: 'i1',
      },
    ];
    const jobdata = {
      connectionValues: ['c1'],
      connectionOps: [conns[0], conns[1]],
      flowValues: ['i1',
        flows[0],
        flows[1]],
      flowOps: [flows[0],
        flows[1]],
      integrationId: 'i2',
    };
    const data = viewNotificationsMetadata(jobdata);

    expect(data).toEqual(
      {
        fieldMap: {
          flows: {
            id: 'flows',
            name: 'flows',
            type: 'multiselect',
            valueDelimiter: ',',
            label: 'Subscribed flows',
            defaultValue: ['i1', {
              _id: 'f1',
              _integrationId: 'i1',
            },
            {
              _id: 'f2',
              _integrationId: 'i1',
            }],
            options: [{ items: [{
              _id: 'f1',
              _integrationId: 'i1',
            },
            {
              _id: 'f2',
              _integrationId: 'i1',
            }] }],
            selectAllIdentifier: 'i2',
          },
          connections: {
            id: 'connections',
            name: 'connections',
            type: 'multiselect',
            valueDelimiter: ',',
            label: 'Subscribed connections',
            defaultValue: ['c1'],
            options: [{ items:
              [{
                _id: 'c1',
              },
              {
                _id: 'c2',
              }],
            }],
          },
        },
      }
    );
  });
});

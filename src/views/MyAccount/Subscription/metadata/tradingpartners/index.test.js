import React from 'react';
import defaultRef from '.';
import References from '../../actions/references';
import ConnectionResourceDrawerLink from '../../../../../components/ResourceDrawerLink/connection';

describe('metdata tradingpartner test cases', () => {
  test('should pass the initial render with default value', () => {
    const columns = defaultRef.useColumns();

    const value1Ref = columns[0].Value({
      rowData: { },
    });

    expect(value1Ref).toEqual(
      (
        <ConnectionResourceDrawerLink
          resource={{}}
        />
      ));

    const value2Ref = columns[1].Value({
      rowData: { },
    });

    expect(value2Ref).toEqual((
      <References resourceType="connections" rowData={{}} isSubscriptionPage />
    ));
  });
});

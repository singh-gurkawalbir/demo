/* global describe, test, expect */

import React from 'react';
import defaultRef from '.';
import References from '../../actions/references';
import ResourceDrawerLink from '../../../../../components/ResourceDrawerLink';

describe('metadata agents test cases', () => {
  test('should pass the initial render with default value', () => {
    const columns = defaultRef.useColumns();

    const value1Ref = columns[0].Value({
      rowData: {},
    });

    expect(value1Ref).toEqual(<ResourceDrawerLink resource={{}} resourceType="agents" />);

    const value2Ref = columns[1].Value({
      rowData: {},
    });

    expect(value2Ref).toEqual(<References resourceType="agents" rowData={{}} />);
  });
});

import React, { useRef, useEffect } from 'react';
import 'jQuery-QueryBuilder';
import 'jQuery-QueryBuilder/dist/css/query-builder.default.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';
import '../../Filter/queryBuilder.css';
import config from '../../Filter/config';

export default function BranchFilter() {
  const qbuilder = useRef(null);

  useEffect(() => {
    const filtersConfig = [{
      id: 'url',
      label: 'URL',
      type: 'string',
    },
    {
      id: 'nal',
      label: 'Org Name',
      type: 'string',
    },
    {
      id: 'ca',
      label: 'Created at',
      type: 'date',
      plugin: 'showCalender',
    }];
    const qbContainer = jQuery(qbuilder.current);

    qbContainer.queryBuilder({
      ...config,
      filters: filtersConfig,
    });
  }, []);

  return (
    <div ref={qbuilder} />
  );
}

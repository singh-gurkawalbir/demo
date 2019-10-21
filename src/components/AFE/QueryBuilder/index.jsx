import React, { useRef, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'jQuery-QueryBuilder';
import 'jQuery-QueryBuilder/dist/css/query-builder.default.css';
import jQuery from 'jquery';
import config from './config';
import './queryBuilder.css';

const useStyles = makeStyles(() => ({
  container: {
    padding: 5,
  },
  queryBlock: {
    background: 'whitesmoke',
    padding: '16px',
  },
}));

export default function QueryBuilder() {
  const qbuilder = useRef(null);
  const classes = useStyles();
  // const [query, setQuery] = useState('');
  const [rulesData, setRulesData] = useState({});

  useEffect(() => {
    const x = jQuery(qbuilder.current);

    x.queryBuilder({
      ...config,
      filters: [
        {
          id: 'name',
          label: 'Name',
          type: 'string',
          input(rule, name) {
            let ruleData = rulesData[rule.id];

            if (!ruleData) {
              ruleData = {
                rule,
                data: {
                  lhs: { type: 'field' },
                  rhs: { type: 'value' },
                },
              };
            }

            setRulesData({ ...rulesData, [rule.id]: ruleData });

            rule.$el
              .find('.rule-value-container')
              .unbind('mouseover')
              .on('mouseover', () => {
                rule.$el
                  .find('.rule-value-container img.settings-icon')
                  .unbind('click')
                  .on('click', () => {
                    alert(`rule.id ${rule.id}`);
                  });
              });

            return `<input class="form-control" name="${name}">${'<img class="settings-icon" src="https://d142hkd03ds8ug.cloudfront.net/images/icons/icon/gear.png">'}`;
          },
        },
      ],
    });
  }, [qbuilder, rulesData]);

  return (
    <div>
      <div className={classes.container}>
        <div ref={qbuilder} />
        {/* <div className={classes.queryBlock}>{query}</div> */}
      </div>
    </div>
  );
}

/* eslint-disable no-param-reassign */
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
// eslint-disable-next-line no-unused-vars
import sqlParser from 'sql-parser-mistic';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import 'jQuery-QueryBuilder';
import 'jQuery-QueryBuilder/dist/css/query-builder.default.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';
import { isEmpty } from 'lodash';
import config from './config';
import './queryBuilder.css';
import {
  convertSalesforceQualificationCriteria,
  getFilterList,
  getAllFiltersConfig,
} from './util';
import actions from '../../../../actions';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    overflowY: 'auto',
  },
}));
const defaultFilters = [];

export default function FilterPanel({
  id,
  onFieldChange,
  editorId,
  rule,
  filters = defaultFilters,
}) {
  // TODO: is this the right way to add reference to window object? check the best way to do this.
  window.SQLParser = sqlParser;
  const qbuilder = useRef(null);
  const classes = useStyles();
  const [rules, setRules] = useState();
  const [referencedFieldsResolved, setReferencedFieldsResolved] = useState(
    false
  );
  const [referenceFields, setReferenceFields] = useState([]);
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const [builderInitComplete, setBuilderInitComplete] = useState(false);
  const [filtersMetadata, setFiltersMetadata] = useState();
  const dispatch = useDispatch();
  const patchEditor = useCallback(
    value => {
      if (editorId) {
        dispatch(actions.editor.patch(editorId, { rule: value || '' }));
      } else if (onFieldChange) {
        onFieldChange(id, value);
      }
    },
    [dispatch, editorId, id, onFieldChange]
  );
  const jsonPathsFromData = useMemo(
    () => filters.map(sf => ({ id: sf.value, ...sf, name: sf.label })),
    [filters]
  );

  useEffect(() => {
    setFiltersMetadata(getFilterList(jsonPathsFromData, rules || []));
  }, [jsonPathsFromData, rules]);

  const isValid = () => jQuery(qbuilder.current).queryBuilder('validate');
  const getRules = () => {
    const result = jQuery(qbuilder.current).queryBuilder('getSQL');

    if (isEmpty(result) || !result.sql) {
      return undefined;
    }

    result.sql = result.sql.replace(
      // eslint-disable-next-line no-useless-escape
      /'\d{4}-\d{2}-\d{2}\T\d{2}:\d{2}:\d{2}\.\d{3}[+,-]\d{4}'/g,
      dt => dt.replace(/'/g, '')
    );
    result.sql = result.sql.replace(
      // eslint-disable-next-line no-useless-escape
      /'\d{4}-\d{2}-\d{2}\T\d{2}:\d{2}:\d{2}[+,-]\d{2}:\d{2}'/g,
      dt => dt.replace(/'/g, '')
    );
    result.sql = result.sql.replace(
      // eslint-disable-next-line no-useless-escape
      /'\d{4}-\d{2}-\d{2}\T\d{2}:\d{2}:\d{2}Z'/g,
      dt => dt.replace(/'/g, '')
    );
    result.sql = result.sql.replace(/'\d{4}-\d{2}-\d{2}(?!T)'/g, dt =>
      dt.replace(/'/g, '')
    );

    return result.sql;
  };

  const handleFilterRulesChange = useCallback(() => {
    if (isValid()) {
      const rule = getRules();

      patchEditor(rule);
    }
  }, [patchEditor]);

  useEffect(() => {
    if (filtersMetadata) {
      const filtersConfig = getAllFiltersConfig(
        filtersMetadata,
        referenceFields
      );
      const qbContainer = jQuery(qbuilder.current);

      try {
        qbContainer.queryBuilder({
          ...config,
          filters: filtersConfig || [],
        });

        qbContainer.queryBuilder('setFilters', true, filtersConfig);
      } catch (e) {
        enqueueSnackbar({
          message: 'Error occured while parsing expression.',
          variant: 'error',
        });
      }

      setBuilderInitComplete(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersMetadata]);

  useEffect(() => {
    // update queryBuilder filters with reference fields
    if (referenceFields && referenceFields.length && builderInitComplete) {
      const filtersConfig = getAllFiltersConfig(
        filtersMetadata,
        referenceFields
      );

      jQuery(qbuilder.current).queryBuilder('setFilters', true, filtersConfig);
      setReferencedFieldsResolved(true);
    }
  }, [referenceFields, filtersMetadata, builderInitComplete]);

  useEffect(() => {
    if (builderInitComplete) {
      const {
        rules: qbRules,
        referenceFieldsUsed,
      } = convertSalesforceQualificationCriteria(rule, qbuilder.current);

      if (
        qbRules &&
        qbRules.rules &&
        qbRules.rules.length === 1 &&
        !qbRules.rules[0].id
      ) {
        qbRules.rules = [];
      }

      if (!referencedFieldsResolved) {
        setRules(qbRules);
      }

      if (
        referenceFieldsUsed &&
        referenceFieldsUsed.length &&
        !referenceFields.length
      ) {
        setReferenceFields(referenceFieldsUsed);
      } else {
        setReferencedFieldsResolved(true);
      }

      try {
        if (referencedFieldsResolved) {
          if (qbRules) {
            jQuery(qbuilder.current).queryBuilder('setRules', qbRules);
          }

          jQuery(qbuilder.current)
            .unbind('rulesChanged.queryBuilder')
            .on('rulesChanged.queryBuilder', () => {
              handleFilterRulesChange();
            });
        }
      } catch (e) {
        enqueueSnackbar({
          message: 'Error occured while parsing expression.',
          variant: 'error',
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builderInitComplete, referencedFieldsResolved]);

  return (
    <div className={classes.container} height="calc(100vh - 170px)" width="100%">
      <div className="salesforce-Qualifier" ref={qbuilder} />
    </div>
  );
}

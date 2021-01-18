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
import { ReferencedFieldsModal } from '../DynaSalesforceExportComponents/DynaTreeModal';

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    overflowY: 'auto',
    height: '100%',
  },
}));
const defaultFilters = [];

export default function FilterPanel({
  id,
  onFieldChange,
  editorId,
  connectionId,
  rule,
  filters = defaultFilters,
  options,
}) {
  // TODO: is this the right way to add reference to window object? check the best way to do this.
  window.SQLParser = sqlParser;
  const qbuilder = useRef(null);
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
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
  const toggleDialog = useCallback(() => {
    setOpenModal(state => !state);
  }, []);

  useEffect(() => {
    if (builderInitComplete) {
      const {
        rules: qbRules,
        referenceFieldsUsed,
        error,
      } = convertSalesforceQualificationCriteria(rule, qbuilder.current);

      if (error) {
        return enqueueSnackbar({
          message: error,
          variant: 'error',
        });
      }
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

        // Prepend the 'Add Referenced fields' button inside query builder before group actions
        if (jQuery('[data-add=add-reference-fields]').length === 0) {
          const buttonHtml = '<div class="btn-group"><button type="button" class="btn btn-xs btn-success" data-add="add-reference-fields"><i class="glyphicon"></i>Add Reference Fields</button></div>';

          jQuery(buttonHtml).prependTo(jQuery(jQuery('.rules-group-header:first .group-actions')[0]));
          jQuery(jQuery('[data-add=add-reference-fields]')[0]).on('click', () => {
            toggleDialog();
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

  const handleAddReferenceFields = useCallback((id, values) => {
    setReferenceFields(referenceFields => [...referenceFields, ...values]);
  }, []);

  return (
    <div className={classes.container}>
      <div className="salesforce-Qualifier" ref={qbuilder} />
      {openModal ? (
        <ReferencedFieldsModal
          handleClose={toggleDialog}
          connectionId={connectionId}
          onFieldChange={handleAddReferenceFields}
          selectedReferenceTo={options?.sObjectType}
          value={referenceFields}
          skipFirstLevelFields
          isFieldMetaRequired
        />
      ) : null}
    </div>
  );
}

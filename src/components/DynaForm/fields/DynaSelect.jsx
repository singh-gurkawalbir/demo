import { FormLabel, Input, ListSubheader, Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FixedSizeList, VariableSizeList } from 'react-window';
import { useSelector, useDispatch } from 'react-redux';
import isLoggableAttr from '../../../utils/isLoggableAttr';
import { stringCompare } from '../../../utils/sort';
import CeligoSelect from '../../CeligoSelect';
import CeligoTruncate from '../../CeligoTruncate';
import HelpLink from '../../HelpLink';
import FieldHelp from '../FieldHelp';
import FieldMessage from './FieldMessage';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import { getHttpConnector } from '../../../constants/applications';

const AUTO_CLEAR_SEARCH = 500;

const NO_OF_OPTIONS = 6;
const ITEM_SIZE = 48;
const ITEM_SIZE_WITH_1_OPTION = 60;
const ITEM_SIZE_WITH_2_OPTIONS = 80;
const OPTIONS_VIEW_PORT_HEIGHT = 300;

const getLabel = (items, value, classes) => {
  const item = items.find(item => item?.value === value);
  let label;

  if (typeof item?.label === 'string') {
    label = item.label;
  }
  if (item?.optionSearch) {
    label = item.optionSearch;
  }

  if (label) {
    return classes && item.itemInfo ? (
      <div title={item.value} className={classes.menuItem}>
        {label}
        <div className={classes.textInfo}>| {item.itemInfo}</div>
      </div>
    ) : label;
  }

  return '';
};
const optionSearch = search => ({label, optionSearch}) => search && (
  (typeof optionSearch === 'string' && optionSearch.toLowerCase().startsWith(search.toLowerCase())) ||
 (typeof label === 'string' && label.toLowerCase().startsWith(search.toLowerCase())));
const useAutoScrollOption = (items, open, setOpen, listRef, id, value, onFieldChange) => {
  const label = getLabel(items, value) || '';
  const [search, setSearch] = useState(label);
  const [scrollIndex, setScrollIndex] = useState(-1);

  useEffect(() => {
    setSearch(label);
    setScrollIndex(-1);
  }, [open, label]);

  useEffect(() => {
    // clear out search result after
    const timerId = setTimeout(() => setSearch(''), AUTO_CLEAR_SEARCH);

    return () => {
      clearTimeout(timerId);
    };
  }, [search]);
  const keydownListener = useCallback(e => {
    // enter key
    if (e.keyCode === 13) {
      // scrollIndex -1 means the user hasn't selected anything using the key board based scroll...
      // so we should just close the options dropdown
      if (scrollIndex !== -1) { onFieldChange(id, items[scrollIndex].value); }
      setOpen(false);

      return;
    }

    if (e.keyCode < 32 || e.keyCode > 90) {
      return;
    }
    // up arrow key
    if (e.keyCode === 38) {
      if (scrollIndex <= 0) { return; }
      setScrollIndex(index => index - 1);

      return;
    }
    // down arrow key
    if (e.keyCode === 40) {
      if (scrollIndex >= items.length) { return; }
      setScrollIndex(index => index + 1);

      return;
    }

    if (e.key) {
      setSearch(str => str + e.key);
    }
  }, [onFieldChange, id, items, scrollIndex, setOpen]);

  useEffect(() => {
    const matchingIndex = items.findIndex(optionSearch(search));

    if (matchingIndex > 0) {
      setScrollIndex(matchingIndex);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', keydownListener, true);
    }

    return () => window.removeEventListener('keydown', keydownListener, true);
  }, [keydownListener, open]);

  useEffect(() => {
    if (scrollIndex > 0) {
      if (scrollIndex + NO_OF_OPTIONS / 2 < items.length) {
        listRef?.current?.scrollToItem(scrollIndex + (NO_OF_OPTIONS / 2));
      } else {
        listRef?.current?.scrollToItem(scrollIndex);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollIndex]);

  return scrollIndex;
};

const useStyles = makeStyles(theme => ({
  fieldWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaSelectWrapper: {
    width: '100%',
  },
  focusVisibleMenuItem: {
    backgroundColor: theme.palette.secondary.lightest,
    transition: 'all .8s ease',
  },
  dynaSelectMenuItem: {
    wordBreak: 'break-word',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  textInfo: {
    color: theme.palette.secondary.light,
    marginLeft: 5,
  },
  menuItem: {
    maxWidth: '95%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: 'flex',
  },
  apiType: {
    color: theme.palette.secondary.light,
    lineHeight: '14px',
  },
}));

const APIData = ({ connInfo = {} }) => {
  const classes = useStyles();
  const { httpConnectorId, httpConnectorApiId, httpConnectorVersionId } = connInfo;
  const connectorData = useSelector(state => selectors.connectorData(state, httpConnectorId) || {});
  const { versions = [], apis = [] } = connectorData;
  const currApi = apis?.filter(api => api._id === httpConnectorApiId)?.[0];
  let currVersion = currApi?.versions?.length ? currApi.versions : versions;

  currVersion = currVersion?.filter(ver => ver._id === httpConnectorVersionId)?.[0];

  if (!httpConnectorId) {
    return null;
  }

  return (
    <Typography component="div" variant="caption" className={classes.apiType}>
      {currApi?.name && <div><span><b>API type:</b></span> <span>{currApi.name}</span></div>}
      {currVersion?.name && <div><span><b>API version:</b> </span><span>{currVersion.name}</span></div>}
    </Typography>
  );
};

const Row = ({ index, style, data }) => {
  const {classes, items, matchMenuIndex, finalTextValue, onFieldChange, setOpen, isLoggable, id} = data;
  const { label, value, subHeader, disabled = false, itemInfo, connInfo } = items[index];

  if (subHeader) {
    return (
      <ListSubheader {...isLoggableAttr(isLoggable)} disableSticky key={subHeader} style={style}>
        {subHeader}
      </ListSubheader>
    );
  }

  return (
    <MenuItem
      {...isLoggableAttr(isLoggable)}
      key={value}
      value={value}
      data-value={value}
      disabled={disabled}
      className={clsx(classes.dynaSelectMenuItem, {
        [classes.focusVisibleMenuItem]: matchMenuIndex === index,
      })}
      style={style}
      selected={value === finalTextValue}
      onClick={() => {
        if (value !== undefined) {
          onFieldChange(id, value);
        }

        setOpen(false);
      }}>
      <CeligoTruncate isLoggable={isLoggable} placement="left" lines={1}>
        {label}
      </CeligoTruncate>
      {value && itemInfo ? <div className={classes.textInfo}>| {itemInfo}</div> : null}
      <APIData connInfo={connInfo} />
    </MenuItem>
  );
};

export default function DynaSelect(props) {
  const {
    disabled,
    id,
    value,
    isValid = true,
    removeHelperText = false,
    name,
    options = [],
    defaultValue = '',
    placeholder,
    required,
    className,
    rootClassName,
    label,
    skipDefault = false,
    onFieldChange,
    skipSort,
    dataTest,
    isLoggable,
    alwaysOpen,
  } = props;

  const listRef = React.createRef();
  const [open, setOpen] = useState(alwaysOpen || false);
  const [isConnectorCalled, setIsConnectorCalled] = useState({});
  const classes = useStyles();
  const dispatch = useDispatch();
  const connectorData = useSelector(selectors.httpConnectorsList);

  const isSubHeader =
    options &&
    options.length &&
    options.some(
      option =>
        option &&
        option.items &&
        option.items.length &&
        option.items.some(item => item.subHeader)
    );
  const items = useMemo(() => {
    let items =
      options &&
      options.reduce(
        (itemsSoFar, option) =>
          itemsSoFar.concat(
            option?.items?.map(item => {
              let label;
              let value;

              if (typeof item === 'string') {
                label = item;
                value = item;
              } else {
                ({ value } = item);
                label = item.label || item.value;
              }

              return typeof item === 'string'
                ? { label, value }
                : { ...item, label, value };
            })
          ),
        []
      );

    if (!isSubHeader && !skipSort) {
      items = items.sort(stringCompare('label'));
    }

    const defaultItem = {
      label: placeholder || 'Please select',
      value: '',
    };

    if (!skipDefault) {
      items = [defaultItem, ...items];
    }

    return items;
  }, [options, isSubHeader, skipSort, placeholder, skipDefault]);

  const matchMenuIndex = useAutoScrollOption(items, open, setOpen, listRef, id, value, onFieldChange);
  let finalTextValue;

  if (value === undefined || value === null) {
    finalTextValue = defaultValue;
  } else {
    finalTextValue = value;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderValue = useCallback(selected => getLabel(items, selected, classes), [items]);

  const openSelect = useCallback(() => {
    setOpen(true);
  }, []);
  const closeSelect = useCallback(
    () => {
      setOpen(false);
    }, []
  );
  const rowProps = useMemo(() => ({ classes, items, matchMenuIndex, finalTextValue, onFieldChange, setOpen, id, isLoggable}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [classes, finalTextValue, id, items, matchMenuIndex, onFieldChange]);
  const getItemSize = useCallback(rowIndex => {
    const { connInfo } = items[rowIndex];

    if (connInfo?.httpConnectorApiId && connInfo?.httpConnectorVersionId) return ITEM_SIZE_WITH_2_OPTIONS;
    if (connInfo?.httpConnectorApiId || connInfo?.httpConnectorVersionId) return ITEM_SIZE_WITH_1_OPTION;

    return ITEM_SIZE;
  }, [items]);
  const isConnForm = useMemo(() => id !== '_borrowConcurrencyFromConnectionId' && options?.some(option =>
    option.items?.some(item =>
      getHttpConnector(item.connInfo?.httpConnectorId) && (item.connInfo?.httpConnectorApiId || item.connInfo?.httpConnectorVersionId)
    )
  ), [id, options]);

  useEffect(() => {
    if (items.length && isConnForm) {
      const connectorIds = items.reduce((connSet, item) => {
        if (item.connInfo?.httpConnectorId && getHttpConnector(item.connInfo?.httpConnectorId)) {
          connSet.add(item.connInfo.httpConnectorId);
        }

        return connSet;
      }, new Set());

      connectorIds?.forEach(httpConnectorId => {
        if (!connectorData?.[httpConnectorId] && !isConnectorCalled?.[httpConnectorId]) {
          setIsConnectorCalled(connIds => ({ ...connIds, [httpConnectorId]: true }));
          dispatch(actions.httpConnectors.requestConnector({ httpConnectorId }));
        }
      });
    }
  }, [items, dispatch, connectorData, isConnForm, isConnectorCalled]);

  const [itemSize2Count, itemSize3Count] = useMemo(() => (
    options?.reduce(([count1, count2], option) => {
      const [c1 = 0, c2 = 0] = option.items?.reduce(([c1, c2], item) => {
        if (getHttpConnector(item.connInfo?.httpConnectorId)) {
          if (item.connInfo?.httpConnectorApiId && item.connInfo?.httpConnectorVersionId) return [c1, c2 + 1];
          if (item.connInfo?.httpConnectorApiId || item.connInfo?.httpConnectorVersionId) return [c1 + 1, c2];
        }

        return [c1, c2];
      }, [0, 0]) || [0, 0];

      return [count1 + c1, count2 + c2];
    }, [0, 0])
  ), [options]);
  const getSize = useCallback(() => {
    if (isConnForm) {
      return ((items.length - itemSize2Count - itemSize3Count) * ITEM_SIZE) +
        (itemSize2Count * ITEM_SIZE_WITH_1_OPTION) +
        (itemSize3Count * ITEM_SIZE_WITH_2_OPTIONS);
    }

    return ITEM_SIZE * items.length;
  }, [isConnForm, itemSize2Count, itemSize3Count, items.length]);
  // if there are fewer options the view port height then let height scale per number of options

  const maxHeightOfSelect = items.length > NO_OF_OPTIONS
    ? OPTIONS_VIEW_PORT_HEIGHT
    : getSize();

  return (
    <div className={clsx(classes.dynaSelectWrapper, rootClassName)}>
      <div className={classes.fieldWrapper}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
        <HelpLink {...props} />
      </div>
      <FormControl
        key={id}
        disabled={disabled}
        required={required}
        className={classes.dynaSelectWrapper}>
        <CeligoSelect
          data-test={dataTest || id}
          isLoggable={isLoggable}
          value={finalTextValue}
          disableUnderline
          displayEmpty
          maxHeightOfSelect={maxHeightOfSelect}
          renderValue={renderValue}
          open={open}
          onOpen={openSelect}
          onClose={closeSelect}
          disabled={disabled}
          // TODO: memoize this
          input={<Input name={name} id={id} />}>
          {
              isConnForm ? (
                <VariableSizeList
                  className={className}
                  ref={listRef}
                  itemSize={getItemSize}
                  height={maxHeightOfSelect}
                  itemCount={items.length}
                  itemData={rowProps}
                >
                  {Row}
                </VariableSizeList>
              ) : (
                <FixedSizeList
                  className={className}
                  ref={listRef}
                  itemSize={ITEM_SIZE}
                  height={
                    maxHeightOfSelect
                  }
                  itemCount={items.length}
                  itemData={rowProps}
                  >
                  {Row}
                </FixedSizeList>
              )
            }
        </CeligoSelect>
      </FormControl>

      {!removeHelperText && <FieldMessage {...props} />}
    </div>
  );
}

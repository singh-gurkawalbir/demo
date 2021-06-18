import { FormLabel, TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import { FixedSizeList } from 'react-window';
import FieldHelp from '../FieldHelp';
import FieldMessage from './FieldMessage';

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
  },
}));

const Row = ({ data, index, style }) => React.cloneElement(data[index], {
  style: {
    ...style,
  },
});

const OuterElementContext = React.createContext({});

const SelectedIndexContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);

  return <div ref={ref} {...props} {...outerProps} />;
});

const NO_OF_OPTIONS = 6;
const ITEM_SIZE = 40;
const OPTIONS_VIEW_PORT_HEIGHT = 250;

const ListboxComponent = React.forwardRef(props => {
  const {children, ...rest} = props;
  const listRef = React.useRef();

  const itemData = React.Children.toArray(children);

  const itemCount = itemData.length;

  const {selectedItemIndex, modalOpen} = React.useContext(SelectedIndexContext);

  useEffect(() => {
    if (modalOpen) { listRef?.current?.scrollToItem(selectedItemIndex, 'start'); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);

  const maxHeightOfSelect = itemData.length > NO_OF_OPTIONS
    ? OPTIONS_VIEW_PORT_HEIGHT
    : ITEM_SIZE * itemData.length;

  return (
    <OuterElementContext.Provider value={rest}>
      <FixedSizeList
        ref={listRef}
        itemData={itemData}
        itemCount={itemCount}
        outerElementType={OuterElementType}
        itemSize={ITEM_SIZE}
        height={maxHeightOfSelect}
    >
        {Row}
      </FixedSizeList>
    </OuterElementContext.Provider>

  );
});

export default function DynaAutocomplete(props) {
  const {
    disabled,
    id,
    value: actualValue,
    isValid = true,
    removeHelperText = false,
    name,
    required,
    rootClassName,
    label,
    onFieldChange,
    dataTest,
    options: actualOptions,
  } = props;

  const actualValueInString = `${actualValue}`;

  const classes = useStyles();
  const options = useMemo(() => actualOptions.map(opt => opt.value), [actualOptions]);
  const [value, setValue] = useState(actualValueInString);
  const [inputValue, setInputValue] = useState(actualOptions.find(
    opt => opt.value === actualValueInString)?.label || actualValueInString);

  const [modalOpen, setModalOpen] = useState(false);
  const selectedItemIndex = actualOptions.findIndex(
    opt => opt.value === actualValueInString);

  return (
    <div className={clsx(classes.dynaSelectWrapper, rootClassName)}>
      <div className={classes.fieldWrapper}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <FormControl
        key={id}
        disabled={disabled}
        required={required}
        className={classes.dynaSelectWrapper}>
        {/* we need to pass these props to the options list element(ListboxComponent)
        there is no other way to inject these props */}
        <SelectedIndexContext.Provider value={{selectedItemIndex, modalOpen}}>
          <Autocomplete
            disableClearable
            freeSolo
            options={options}
            onOpen={() => { setModalOpen(true); }}
            onClose={() => { setModalOpen(false); }}
            getOptionLabel={option => (
              actualOptions.find(opt => opt.value === `${option}`)?.label || `${option}`
            )}
            data-test={dataTest || id}
            value={value}
            ListboxComponent={ListboxComponent}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
              const corrVal = actualOptions.find(
                opt => opt.label === newInputValue
              );

              if (corrVal) onFieldChange(id, corrVal.value);
              else onFieldChange(id, newInputValue);
            }}
            onChange={(event, newValue) => {
              setValue(newValue);
              onFieldChange(id, newValue);
            }}
            renderInput={params => (
              <TextField
                {...params} name={name}
                id={id} />
            )}
        />
        </SelectedIndexContext.Provider>
      </FormControl>

      {!removeHelperText && <FieldMessage {...props} />}
    </div>
  );
}

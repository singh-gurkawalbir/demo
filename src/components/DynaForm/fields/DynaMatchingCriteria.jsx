import produce from 'immer';
import React, { useEffect, useMemo, useState } from 'react';
import DynaMultiSelect from './DynaMultiSelect';
// import { deepClone } from 'fast-json-patch/lib/core';
import DynaSelect from './DynaSelect';


const labelKeyAr = [
  {label: 'Matched', key: 'matched'},
  {label: 'Partially Matched', key: 'partiallyMatched'},
  {label: 'Potentially Matched', key: 'potentiallyMatched'},
];
const generateOptionsFormLabelValueAr = (ar) => ar.map(([label, value]) => ({label, value}));
const withItemsWrapper = (ar) => ([{items: ar}]);
const stateTiedToAccountType = (state, selectedAccountType) => state?.find(ele => ele?.accountType === selectedAccountType);

const allOptionKeys = (values, key) => values?.[key] && Object.keys(values?.[key]);
export const DynaMatchingCriteria = (props) => {
  const { allValues, accountTypeOptions, setAllValues, required, disabled} = props;

  const accountTypeSelectOptions = useMemo(
    () => withItemsWrapper(generateOptionsFormLabelValueAr(accountTypeOptions)), [accountTypeOptions]);
  const [selectedAccountType, setSelectedAccountType] = useState(generateOptionsFormLabelValueAr(accountTypeOptions)?.[0]?.value);
  return (
    <>
      <DynaSelect
        required={required}
        disabled={disabled}
        value={selectedAccountType}
        options={accountTypeSelectOptions}
        onFieldChange={(id, value) => setSelectedAccountType(value)} />
      {labelKeyAr.map(({label, key}) => {
        const values = stateTiedToAccountType(allValues, selectedAccountType);
        const allSelectedValues = allOptionKeys(values, key)?.filter(key1 => values?.[key]?.[key1]).map(key => key);

        const allOptions = allOptionKeys(values, key)?.map(key => ({label: key, value: key}));
        return (

          <DynaMultiSelect
            required={required}
            disabled={disabled}
            isValid
            key={key}
            options={[{items: allOptions}]}
            label={label}
            value={allSelectedValues}
            onFieldChange={(id, values) => {
              setAllValues(origState => produce(origState, state => {
                const selectedAccount = stateTiedToAccountType(state, selectedAccountType);
                allOptionKeys(selectedAccount, key)?.forEach(accountKey => {
                  selectedAccount[key][accountKey] = !!values?.includes(accountKey);
                });
              }));
            }} />
        );
      })}
    </>
  );
};

export default function DynaMatchingCriteriaWithModal(props) {
  const { label, onFieldChange, id, value, content} = props;

  const [allValues, setAllValues] = useState(value || content);


  useEffect(() => {
    onFieldChange(id, allValues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allValues, id]);

  return (
    <>
      <span>{label}</span>
      <DynaMatchingCriteria {...props} allValues={allValues} setAllValues={setAllValues} />
    </>
  );
}

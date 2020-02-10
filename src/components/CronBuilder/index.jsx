import { useMemo, useState, useCallback, useEffect } from 'react';
import DynaForm from '../DynaForm';

export default function CronBuilder(props) {
  const { value, onChange, reset, setReset } = props;
  //* (sec) *(min) *(hour) *(week) *(day) *(month)
  const splitVal = value && value.split(' ');
  const meta = useMemo(
    () => ({
      fieldMap: {
        everyNMinutes: {
          name: 'everyNMinutes',
          id: 'everyNMinutes',
          label: 'Every n Minutes',
          type: 'slider',
          min: 5,
          max: 55,
          step: 5,
          unit: 'minute',
          setReset,
          clearFields: ['everySelectedMinute'],
          defaultValue: splitVal[1] || '',
        },
        everySelectedMinute: {
          id: 'everySelectedMinute',
          name: 'everySelectedMinute',
          label: ' Each selected minute',
          type: 'groupedButton',
          clearFields: ['everyNMinutes'],
          unit: 'minute',
          setReset,
          defaultValue: splitVal[1] || '',
          options: [
            {
              items: [
                { label: '10', value: '10' },
                { label: '25', value: '25' },
                { label: '40', value: '40' },
                { label: '55', value: '55' },
              ],
            },
          ],
        },
        everyHour: {
          id: 'everyHour',
          name: 'everyHour',
          unit: 'hour',
          type: 'cronlabel',
          setReset,

          clearFields: ['everyNHours', 'eachSelectedHour'],
          defaultValue: splitVal[2] || '',
        },
        everyNHours: {
          id: 'everyNHours',
          name: 'everyNHours',
          label: 'Every n Hours',
          type: 'slider',
          setReset,

          unit: 'hour',
          min: 1,
          max: 23,
          step: 1,
          defaultValue: splitVal[2] || '',
          clearFields: ['everyHour', 'eachSelectedHour'],
        },
        eachSelectedHour: {
          id: 'eachSelectedHour',
          name: 'eachSelectedHour',
          label: 'Each selected',
          type: 'groupedButton',
          clearFields: ['everyNHours', 'everyHour'],
          setReset,
          defaultValue: splitVal[2] || '',
          options: [
            {
              items: [
                { label: '00', value: '0' },
                { label: '01', value: '1' },
                { label: '02', value: '2' },
                { label: '03', value: '3' },
                { label: '04', value: '4' },
                { label: '05', value: '5' },
                { label: '06', value: '6' },
                { label: '07', value: '7' },
                { label: '08', value: '8' },
                { label: '09', value: '9' },
                { label: '10', value: '10' },
                { label: '11', value: '11' },
                { label: '12', value: '12' },
                { label: '13', value: '13' },
                { label: '14', value: '14' },
                { label: '15', value: '15' },
                { label: '16', value: '16' },
                { label: '17', value: '17' },
                { label: '18', value: '18' },
                { label: '19', value: '19' },
                { label: '20', value: '20' },
                { label: '21', value: '21' },
                { label: '22', value: '22' },
                { label: '23', value: '23' },
              ],
            },
          ],
        },
        everyDay: {
          id: 'everyDay',
          name: 'everyDay',
          unit: 'day',
          type: 'cronlabel',
          setReset,

          clearFields: ['eachDay'],
          defaultValue: splitVal[3] || '',
        },
        eachDay: {
          id: 'eachDay',
          clearFields: ['everyDay'],
          name: 'eachDay',
          label: 'Each Selected Day',
          setReset,

          type: 'groupedButton',
          defaultValue: splitVal[3] || '',

          options: [
            {
              items: [
                { label: '00', value: '0' },
                { label: '01', value: '1' },
                { label: '02', value: '2' },
                { label: '03', value: '3' },
                { label: '04', value: '4' },
                { label: '05', value: '5' },
                { label: '06', value: '6' },
                { label: '07', value: '7' },
                { label: '08', value: '8' },
                { label: '09', value: '9' },
                { label: '10', value: '10' },
                { label: '11', value: '11' },
                { label: '12', value: '12' },
                { label: '13', value: '13' },
                { label: '14', value: '14' },
                { label: '15', value: '15' },
                { label: '16', value: '16' },
                { label: '17', value: '17' },
                { label: '18', value: '18' },
                { label: '19', value: '19' },
                { label: '20', value: '20' },
                { label: '21', value: '21' },
                { label: '22', value: '22' },
                { label: '23', value: '23' },
                { label: '24', value: '24' },
                { label: '25', value: '25' },
                { label: '26', value: '26' },
                { label: '27', value: '27' },
                { label: '28', value: '28' },
                { label: '29', value: '29' },
                { label: '30', value: '30' },
                { label: '31', value: '31' },
              ],
            },
          ],
        },

        everyMonth: {
          id: 'everyMonth',
          name: 'everyMonth',
          unit: 'month',
          type: 'cronlabel',
          setReset,

          defaultValue: splitVal[4] || '',
          clearFields: ['eachMonth'],
        },
        eachMonth: {
          id: 'eachMonth',
          clearFields: ['everyMonth'],
          name: 'eachMonth',
          label: 'Each selected month',
          type: 'groupedButton',
          setReset,

          defaultValue: splitVal[4] || '',
          options: [
            {
              items: [
                { label: 'Jan', value: '1' },
                { label: 'Feb', value: '2' },
                { label: 'March', value: '3' },
                { label: 'April', value: '4' },
                { label: 'May', value: '5' },
                { label: 'June', value: '6' },
                { label: 'July', value: '7' },
                { label: 'Aug', value: '8' },
                { label: 'Sept', value: '9' },
                { label: 'Oct', value: '10' },
                { label: 'Nov', value: '11' },
                { label: 'Dec', value: '12' },
              ],
            },
          ],
        },

        everyWeek: {
          id: 'everyWeek',
          name: 'everyWeek',
          unit: 'week',
          type: 'cronlabel',
          clearFields: ['eachWeek'],
          setReset,

          defaultValue: splitVal[5] || '',
        },
        eachWeek: {
          id: 'eachWeek',
          clearFields: ['everyWeek'],
          name: 'eachWeek',
          label: 'Each selected Day',
          type: 'groupedButton',
          setReset,

          defaultValue: splitVal[5] || '',
          options: [
            {
              items: [
                { label: 'Sunday', value: '1' },
                { label: 'Monday', value: '2' },
                { label: 'Tuesday', value: '3' },
                { label: 'Wednesday', value: '4' },
                { label: 'Thursday', value: '5' },
                { label: 'Friday', value: '6' },
                { label: 'Saturday', value: '0' },
              ],
            },
          ],
        },
      },
      layout: {
        type: 'tabWithoutSave',
        containers: [
          {
            label: 'Minute',
            type: 'tabWithoutSave',
            containers: [
              { label: 'Every n Minutes', fields: ['everyNMinutes'] },
              {
                label: 'Every selected minute',
                fields: ['everySelectedMinute'],
              },
            ],
          },
          {
            label: 'Hour',
            type: 'tabWithoutSave',
            containers: [
              { label: 'Every Hour', fields: ['everyHour'] },
              { label: 'Every n Hours', fields: ['everyNHours'] },
              { label: 'Each Selected Hour', fields: ['eachSelectedHour'] },
            ],
          },
          {
            label: 'Day of Month',
            type: 'tabWithoutSave',
            containers: [
              { label: 'Every Day', fields: ['everyDay'] },
              { label: 'Each Day', fields: ['eachDay'] },
            ],
          },
          {
            label: 'Month',
            type: 'tabWithoutSave',
            containers: [
              { label: 'Every Month', fields: ['everyMonth'] },
              { label: 'Each Month', fields: ['eachMonth'] },
            ],
          },
          {
            label: 'Day of Week',
            type: 'tabWithoutSave',
            containers: [
              { label: 'Every Week', fields: ['everyWeek'] },
              { label: 'Each Week', fields: ['eachWeek'] },
            ],
          },
        ],
      },
    }),
    [setReset, splitVal]
  );
  const [isCronTouched, setIsCronTouched] = useState(false);
  const [externalTabState, setExternalTabStateFn] = useState({
    activeTab: 0,
    tabHistory: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    },
  });
  const setExternalTabState = useCallback(
    (index, val) => {
      setIsCronTouched(true);
      setReset(false);
      setExternalTabStateFn(state => {
        const stateCopy = { ...state };

        if (index === 0) {
          stateCopy.activeTab = val;
        }

        if (index === 1) {
          stateCopy.tabHistory = { ...stateCopy.tabHistory };
          stateCopy.tabHistory[stateCopy.activeTab] = val;
        }

        return stateCopy;
      });
    },
    [setReset]
  );
  const onFormChange = useCallback(
    formValue => {
      if (reset) return;
      const { tabHistory } = externalTabState;
      const finalResult = Object.keys(tabHistory)
        .map(key => {
          const fieldId =
            meta.layout.containers[key].containers[tabHistory[key]].fields[0];

          return { key, value: formValue[fieldId] || splitVal[key + 1] || '*' };
        })
        .sort((first, second) => first.key - second.key)
        .reduce((finalRes, curr) => {
          let acc = finalRes;

          acc += ` ${curr.value}`;

          return acc;
        }, '?');

      onChange(finalResult, !isCronTouched);
    },
    [
      externalTabState,
      isCronTouched,
      meta.layout.containers,
      onChange,
      reset,
      splitVal,
    ]
  );
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reset) setCount(count => count + 1);
  }, [reset, setCount]);

  return (
    <DynaForm
      key={count}
      fieldMeta={meta}
      externalTabState={externalTabState}
      setExternalTabState={setExternalTabState}
      onChange={onFormChange}
    />
  );
}

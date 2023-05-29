import { transformData, transformData2 } from './Transform';

describe('transformData', () => {
  test('should transform data correctly', () => {
    const data = [
      { _time: '2023-05-01', attribute: 's' },
      { _time: '2023-05-01', attribute: 'e' },
      { _time: '2023-05-02', attribute: 's' },
    ];

    const result = transformData(data);

    expect(result.ids).toEqual({
      XAxis: 'label',
      YAxis: '',
      Plots: ['success', 'error'],
      MaximumYaxis: '',
    });

    expect(result.values).toEqual([
      { label: '2023-5-1', success: 1, error: 1 },
    ]);
  });
});

describe('transformData2', () => {
  test('should transform data correctly', () => {
    const data = {
      A: 10,
      B: 20,
      C: 5,
    };

    const result = transformData2(data);

    expect(result.ids).toEqual({
      XAxis: 'label',
      YAxis: '',
      Plots: ['count'],
      MaximumYaxis: '',
    });

    expect(result.values).toEqual([
      { label: 'A', count: 10 },
      { label: 'B', count: 20 },
      { label: 'C', count: 5 },
    ]);
  });
});


import React from 'react';
import { screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CronBuilder from '.';
import { renderWithProviders } from '../../test/test-utils';

jest.mock('@mui/material/Slider', () => props => {
  const {onChange, ...others } = props;
  const testid = 'testid';

  return (
    <input
      data-testid={testid}
      onChange={event => onChange(event, event.target.value)}
      {...others}
      />
  );
});

// eslint-disable-next-line jest/valid-describe-callback
describe('cronBuilder UI tests', async () => {
  test('rendering', async () => {
    const onchange = jest.fn();

    renderWithProviders(<CronBuilder value="? */5 * * * *" onChange={onchange} />);
    const button = screen.getByText('Day of week');

    await userEvent.click(button);
    expect(screen.getByText('Every * week')).toBeInTheDocument();
  });

  test('should click the same date twice', async () => {
    const onchange = jest.fn();

    renderWithProviders(<CronBuilder value="1 0,a,c,b 3 4 5 6 7" onChange={onchange} />);
    const dayofmonth = screen.getByText('Day of month');

    await userEvent.click(dayofmonth);
    const date = screen.getByText('24');

    await userEvent.click(date);
    const date2 = screen.getByText('23');

    await userEvent.click(date2);
    const date3 = screen.getByText('24');

    await userEvent.click(date3);
    expect(onchange).toHaveBeenCalledWith('? 0,a,c,b 3 4,24 5 6');
  });

  test('should test when one hour only is choosen', async () => {
    const onchange = jest.fn();

    renderWithProviders(<CronBuilder value="1 0,a,c,b 3 4 5 6 7" onChange={onchange} />);
    const houroption = screen.getByText('Hour');

    await userEvent.click(houroption);

    const hour = screen.getByText('23');

    await userEvent.click(hour);
    expect(onchange).toHaveBeenCalledWith('? 0,a,c,b 3,23 4 5 6');
  });

  test('should test when final array is empty', async () => {
    const onchange = jest.fn();

    renderWithProviders(<CronBuilder value="1 * * 5 6 7 " onChange={onchange} />);
    const houroption = screen.getByText('Hour');

    await userEvent.click(houroption);
    const eachSelectedHour = screen.getByText('Each selected hour');

    await userEvent.click(eachSelectedHour);

    const firstclick = screen.getByText('04');

    await userEvent.click(firstclick);

    const secClick = screen.getByText('04');

    await userEvent.click(secClick);

    expect(onchange).toHaveBeenCalledWith('? * * 5 6 7');
  });

  test('should do test when initial value is given as empty string', async () => {
    const onchange = jest.fn();

    renderWithProviders(<CronBuilder value="         " onChange={onchange} />);
    const houroption = screen.getByText('Hour');

    await userEvent.click(houroption);
    const eachSelectedHour = screen.getByText('Each selected hour');

    await userEvent.click(eachSelectedHour);

    const firstclick = screen.getByText('04');

    await userEvent.click(firstclick);

    const secclick = screen.getByText('04');

    await userEvent.click(secclick);
    expect(onchange).toHaveBeenCalledWith('? * * * * *');
  });

  test('should test when slider > 10', async () => {
    const onchange = jest.fn();

    renderWithProviders(<CronBuilder value=" */20 1 3 4 5/10 6 7" onChange={onchange} />);
    const dayofmonth = screen.getByText('Minute');

    await userEvent.click(dayofmonth);
    const everynminutes = screen.getByText('Every n minutes');

    await userEvent.click(everynminutes);
    fireEvent.change(screen.getByTestId('testid'), { target: { value: 25 } });
    expect(onchange).toHaveBeenCalledWith('? 10-59/25 1 3 4 5/10');
  });
  test('should test when slider < 10', async () => {
    const onchange = jest.fn();

    renderWithProviders(<CronBuilder value=" */20 1 3 4 5/10 6 7" onChange={onchange} />);
    const dayofmonth = screen.getByText('Minute');

    await userEvent.click(dayofmonth);
    const everynminutes = screen.getByText('Every n minutes');

    await userEvent.click(everynminutes);
    fireEvent.change(screen.getByTestId('testid'), { target: { value: 5 } });
    expect(onchange).toHaveBeenCalledWith('? */5 1 3 4 5/10');
  });
});

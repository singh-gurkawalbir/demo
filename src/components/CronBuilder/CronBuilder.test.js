/* global describe, test, expect ,jest */
import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CronBuilder from '.';

jest.mock('@material-ui/core/Slider', () => props => {
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

describe('CronBuilder testing', () => {
  test('rendering', () => {
    const onchange = jest.fn();

    render(<CronBuilder value="? */5 * * * *" onChange={onchange} />);
    const button = screen.getByText('Day of week');

    userEvent.click(button);
    expect(screen.getByText('Every * week')).toBeInTheDocument();
  });

  test('clicking the same date twice', () => {
    const onchange = jest.fn();

    render(<CronBuilder value="1 0,a,c,b 3 4 5 6 7" onChange={onchange} />);
    const dayofmonth = screen.getByText('Day of month');

    userEvent.click(dayofmonth);
    const date = screen.getByText('24');

    userEvent.click(date);
    const date2 = screen.getByText('23');

    userEvent.click(date2);
    const date3 = screen.getByText('24');

    userEvent.click(date3);
    expect(onchange).toHaveBeenCalledWith('? 0,a,c,b 3 4,24 5 6');
  });

  test('getting one hour only', () => {
    const onchange = jest.fn();

    render(<CronBuilder value="1 0,a,c,b 3 4 5 6 7" onChange={onchange} />);
    const houroption = screen.getByText('Hour');

    userEvent.click(houroption);

    const hour = screen.getByText('23');

    userEvent.click(hour);
    expect(onchange).toHaveBeenCalledWith('? 0,a,c,b 3,23 4 5 6');
  });

  test('final array empty case', () => {
    const onchange = jest.fn();

    render(<CronBuilder value="1 * * 5 6 7 " onChange={onchange} />);
    const houroption = screen.getByText('Hour');

    userEvent.click(houroption);
    const eachSelectedHour = screen.getByText('Each selected hour');

    userEvent.click(eachSelectedHour);

    const firstclick = screen.getByText('04');

    userEvent.click(firstclick);

    const secclick = screen.getByText('04');

    userEvent.click(secclick);

    expect(onchange).toHaveBeenCalledWith('? * * 5 6 7');
  });

  test('rendering with null value', () => {
    const onchange = jest.fn();

    render(<CronBuilder value="         " onChange={onchange} />);
    const houroption = screen.getByText('Hour');

    userEvent.click(houroption);
    const eachSelectedHour = screen.getByText('Each selected hour');

    userEvent.click(eachSelectedHour);

    const firstclick = screen.getByText('04');

    userEvent.click(firstclick);

    const secclick = screen.getByText('04');

    userEvent.click(secclick);
    expect(onchange).toHaveBeenCalledWith('? * * * * *');
  });

  test('rendering with slider > 10', () => {
    const onchange = jest.fn();

    render(<CronBuilder value=" */20 1 3 4 5/10 6 7" onChange={onchange} />);
    const dayofmonth = screen.getByText('Minute');

    userEvent.click(dayofmonth);
    const everynminutes = screen.getByText('Every n minutes');

    userEvent.click(everynminutes);
    fireEvent.change(screen.getByTestId('testid'), { target: { value: 25 } });
    expect(onchange).toHaveBeenCalledWith('? 10-59/25 1 3 4 5/10');
  });
  test('rendering with slider < 10', () => {
    const onchange = jest.fn();

    render(<CronBuilder value=" */20 1 3 4 5/10 6 7" onChange={onchange} />);
    const dayofmonth = screen.getByText('Minute');

    userEvent.click(dayofmonth);
    const everynminutes = screen.getByText('Every n minutes');

    userEvent.click(everynminutes);
    fireEvent.change(screen.getByTestId('testid'), { target: { value: 5 } });
    expect(onchange).toHaveBeenCalledWith('? */5 1 3 4 5/10');
  });
});

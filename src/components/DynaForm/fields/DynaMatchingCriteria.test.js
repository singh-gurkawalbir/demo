import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaMatchingCriteriaWithModal from './DynaMatchingCriteria';

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

describe('test suite for DynaMatchingCriteriaWithModal field', () => {
  test('should be able to modify account type', async () => {
    const onFieldChange = jest.fn();
    const props = {
      label: 'Matching Criteria',
      onFieldChange,
      required: true,
      id: 'matchingcriteria',
      value: [
        {
          accountType: 'type1',
          matched: {
            content: true,
            percentage: false,
            lines: true,
          },
          partiallyMatched: {
            content: true,
            percentage: true,
            lines: false,
          },
          potentiallyMatched: {
            content: false,
            percentage: true,
            lines: true,
          },
        },
        {
          accountType: 'type2',
          matched: {
            content: true,
            percentage: true,
            lines: false,
          },
          partiallyMatched: {
            content: false,
            percentage: true,
            lines: true,
          },
          potentiallyMatched: {
            content: true,
            percentage: false,
            lines: true,
          },
        },
        {
          accountType: 'type3',
          matched: {
            content: false,
            percentage: true,
            lines: true,
          },
          partiallyMatched: {
            content: true,
            percentage: false,
            lines: true,
          },
          potentiallyMatched: {
            content: true,
            percentage: true,
            lines: false,
          },
        },
      ],
      accountTypeOptions: [
        ['Account type 1', 'type1'],
        ['Account type 2', 'type2'],
        ['Account type 3', 'type3'],
      ],
    };

    renderWithProviders(<DynaMatchingCriteriaWithModal {...props} />);
    expect(onFieldChange).toBeCalledWith(props.id, props.value, true);
    expect(screen.getByText(props.label)).toBeInTheDocument();

    const inputValues = Array.from(document.querySelectorAll('input')).map(ele => ele.value);
    const inputLabels = document.querySelectorAll('label');

    expect(inputValues).toEqual([
      'type1',
      'content,lines',
      'content,percentage',
      'percentage,lines',
    ]);
    expect(inputLabels[1].textContent).toContain('Matched');
    expect(inputLabels[2].textContent).toContain('Partially Matched');
    expect(inputLabels[3].textContent).toContain('Potentially Matched');

    Array.from(document.querySelectorAll('input')).forEach(inputField =>
      expect(inputField).toBeRequired());

    //  The first account type should be selected by default
    const accountTypeField = document.querySelectorAll('input')[0];
    const selectedAccountType = screen.getAllByRole('button')[0];

    expect(accountTypeField).toHaveValue('type1');
    expect(selectedAccountType).toHaveTextContent('Account type 1');

    await userEvent.click(selectedAccountType);
    const availableAccountTypes = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(availableAccountTypes).toEqual([
      'Please select',
      'Account type 1',
      'Account type 2',
      'Account type 3',
    ]);

    //  should be able to change account type
    await userEvent.click(screen.getByRole('menuitem', {name: 'Account type 3'}));
    expect(onFieldChange).toBeCalledWith(props.id, props.value);
    expect(onFieldChange).toBeCalledTimes(2);
    expect(accountTypeField).toHaveValue('type3');
    expect(selectedAccountType).toHaveTextContent('Account type 3');

    //  should update the values on changing account type
    const changedInputValues = Array.from(document.querySelectorAll('input')).map(ele => ele.value);

    expect(changedInputValues).toEqual([
      'type3',
      'percentage,lines',
      'content,lines',
      'content,percentage',
    ]);
  });

  test('should be able to change the multiselect values', async () => {
    const onFieldChange = jest.fn();
    const props = {
      label: 'Matching Criteria',
      onFieldChange,
      id: 'matchingcriteria',
      content: [
        {
          accountType: 'type1',
          matched: {
            content: true,
            percentage: false,
            lines: true,
          },
          partiallyMatched: {
            content: true,
            percentage: true,
            lines: false,
          },
          potentiallyMatched: {
            content: false,
            percentage: true,
            lines: true,
          },
        },
        {
          accountType: 'type2',
          matched: {
            content: true,
            percentage: true,
            lines: false,
          },
          partiallyMatched: {
            content: false,
            percentage: true,
            lines: true,
          },
          potentiallyMatched: {
            content: true,
            percentage: false,
            lines: true,
          },
        },
        {
          accountType: 'type3',
          matched: {
            content: false,
            percentage: true,
            lines: true,
          },
          partiallyMatched: {
            content: true,
            percentage: false,
            lines: true,
          },
          potentiallyMatched: {
            content: true,
            percentage: true,
            lines: false,
          },
        },
      ],
      accountTypeOptions: [
        ['Account type 1', 'type1'],
        ['Account type 2', 'type2'],
        ['Account type 3', 'type3'],
      ],
    };

    renderWithProviders(<DynaMatchingCriteriaWithModal {...props} />);
    expect(onFieldChange).toBeCalledWith(props.id, props.content, true);

    Array.from(document.querySelectorAll('input')).forEach(inputField =>
      expect(inputField).not.toBeRequired());

    const inputLabels = Array.from(document.querySelectorAll('label')).map(ele => ele.textContent);

    expect(inputLabels).toEqual([
      '',
      'Matched',
      'Partially Matched',
      'Potentially Matched',
    ]);

    Array.from(document.querySelectorAll('input')).forEach(inputField =>
      expect(inputField).not.toBeRequired());

    const matchedInputField = document.querySelectorAll('input')[1];
    const matchedSelected = screen.getByRole('button', {name: 'content lines'});

    expect(matchedInputField).toHaveValue('content,lines');
    await userEvent.click(matchedSelected);
    const availableOptions = screen.getAllByRole('option').map(ele => ele.textContent);

    expect(availableOptions).toEqual([
      'content',
      'percentage',
      'lines',
    ]);
    await userEvent.click(screen.getByRole('option', {name: 'percentage'}));
    await userEvent.click(screen.getByRole('button', {name: 'Done'}));

    expect(matchedInputField).toHaveValue('content,percentage,lines');
    expect(matchedSelected).toHaveTextContent('contentpercentagelines');

    const updatedValues = props.content.map(acc => acc.accountType === 'type1' ? {...acc, matched: {...acc.matched, percentage: true}} : acc);

    expect(onFieldChange).toBeCalledWith(props.id, updatedValues, false);
  });
});

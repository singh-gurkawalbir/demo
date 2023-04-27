import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {fireEvent, screen} from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import ButtonWithTooltip from './index';
import { message } from '../../../utils/messageStore';
import TextButton from '../TextButton';

import TrashIcon from '../../icons/TrashIcon';

function handleDeleteFlowGroupClick() {

}

describe('buttontooltip component test', () => {
  test('before hovering over the button the title is displayed', () => {
    renderWithProviders(
      <ButtonWithTooltip tooltipProps={{title: message.FLOWS.FLOW_GROUP_DELETE_MESSAGE }}>
        <TextButton onClick={handleDeleteFlowGroupClick} startIcon={<TrashIcon />}> Delete flow group </TextButton>
      </ButtonWithTooltip>
    );
    const ButtonName1 = screen.getByRole('button', {name: /Delete flow group/i});

    expect(ButtonName1).toBeInTheDocument();
    const TitleDisplay = screen.getByLabelText('Only the flow group will be deleted. Its flows will be moved into “Unassigned”.');

    expect(TitleDisplay).toBeInTheDocument();
    fireEvent.click(ButtonName1);
  });

  test('whenever hovering over the button then title is disappeared', () => {
    renderWithProviders(
      <ButtonWithTooltip tooltipProps={{title: message.FLOWS.FLOW_GROUP_DELETE_MESSAGE }}>
        <TextButton onClick={handleDeleteFlowGroupClick} startIcon={<TrashIcon />}> Delete flow group </TextButton>
      </ButtonWithTooltip>
    );
    const Title2 = screen.getByLabelText('Only the flow group will be deleted. Its flows will be moved into “Unassigned”.');

    expect(Title2).toBeInTheDocument();
    const Button2 = screen.getByRole('button', {name: /Delete flow group/i});

    expect(Button2).toBeInTheDocument();
    fireEvent.mouseOver(Button2);
    const Title3 = screen.queryByText('Only the flow group will be deleted. Its flows will be moved into “Unassigned”.');

    expect(Title3).not.toBeInTheDocument();
  });

  test('whenever hovering over the button then title is disappeared duplicate', () => {
    renderWithProviders(
      <ButtonWithTooltip tooltipProps={{title: message.FLOWS.FLOW_GROUP_DELETE_MESSAGE}}>
        <TextButton onClick={handleDeleteFlowGroupClick} startIcon={<TrashIcon />}> Delete flow group </TextButton>
      </ButtonWithTooltip>
    );
    const NewFlow1 = screen.getByRole('button', {name: /Delete flow group/i});

    expect(NewFlow1).toBeInTheDocument();
    fireEvent.mouseOver(screen.getByLabelText('Only the flow group will be deleted. Its flows will be moved into “Unassigned”.'));
  });
  test('whenever no title is passed', () => {
    renderWithProviders(
      <ButtonWithTooltip tooltipProps={{title: ''}}>
        <TextButton onClick={handleDeleteFlowGroupClick} startIcon={<TrashIcon />}> Delete flow group </TextButton>
      </ButtonWithTooltip>
    );
    const NewFlow1 = screen.getByRole('button', {name: /Delete flow group/i});

    expect(NewFlow1).toBeInTheDocument();
  });
});

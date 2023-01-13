import { screen } from '@testing-library/react';
import React from 'react';
import * as ReactFlowRenderer from 'react-flow-renderer';
import userEvent from '@testing-library/user-event';
import CanvasControls from './CanvasControls';
import { renderWithProviders } from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';

let initialStore;
const mockToggleMiniMap = jest.fn();
const mockZommIn = jest.fn();
const mockZoomOut = jest.fn();
const mockFitView = jest.fn();

function initCanvasControls({
  showMiniMap,
  toggleMiniMap,
}) {
  const ui = (
    <CanvasControls showMiniMap={showMiniMap} toggleMiniMap={toggleMiniMap} />
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('react-flow-renderer', () => ({
  __esModule: true,
  ...jest.requireActual('react-flow-renderer'),
  Controls: props => (
    <div>
      <div>showInteractive={props.showInteractive}</div>
      <div>showZoom={props.showZoom}</div>
      <div>showFitView={props.showFitView}</div>
      {props.children}
    </div>
  ),
  ControlButton: props => (
    <div>
      <button
        type="button"
        data-test="control-button"
        onClick={props.onClick}
      >
        {props.children}
      </button>
    </div>
  ),
}));
jest.mock('../../../../components/icons/AddIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/icons/AddIcon'),
  default: () => (
    <div>Mock Add Icon</div>
  ),
}));
jest.mock('../../../../components/icons/SubtractIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/icons/SubtractIcon'),
  default: () => (
    <div>Mock Subtract Icon</div>
  ),
}));
jest.mock('../../../../components/icons/ToggleMapIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/icons/ToggleMapIcon'),
  default: () => (
    <div>Mock Toggle Map Icon</div>
  ),
}));
jest.mock('../../../../components/icons/FullScreenOpenIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/icons/FullScreenOpenIcon'),
  default: () => (
    <div>Mock Full Screen Open Icon</div>
  ),
}));
describe('Testsuite for Canvas Controls', () => {
  beforeEach(() => {
    jest.spyOn(ReactFlowRenderer, 'useZoomPanHelper').mockReturnValue({zoomIn: mockZommIn, zoomOut: mockZoomOut, fitView: mockFitView});
    initialStore = getCreatedStore();
  });
  afterEach(() => {
    mockToggleMiniMap.mockClear();
    mockZommIn.mockClear();
    mockZoomOut.mockClear();
    mockFitView.mockClear();
  });

  test('should test the camvas controls when show mini map is set to true and click on zoom in button', () => {
    initCanvasControls({showMiniMap: true, toggleMiniMap: mockToggleMiniMap});
    expect(screen.getByText(/showinteractive=/i)).toBeInTheDocument();
    expect(screen.getByText(/showZoom=/i)).toBeInTheDocument();
    expect(screen.getByText(/showFitView=/i)).toBeInTheDocument();
    expect(screen.getByText(/mock add icon/i)).toBeInTheDocument();
    const zoominButtonNode = screen.getByRole('button', {
      name: /zoom in/i,
    });

    expect(zoominButtonNode).toBeInTheDocument();
    userEvent.click(zoominButtonNode);
    expect(mockZommIn).toHaveBeenCalled();
  });
  test('should test the camvas controls when show mini map is set to true and click on zoom out button', () => {
    initCanvasControls({showMiniMap: true, toggleMiniMap: mockToggleMiniMap});
    expect(screen.getByText(/showinteractive=/i)).toBeInTheDocument();
    expect(screen.getByText(/showZoom=/i)).toBeInTheDocument();
    expect(screen.getByText(/showFitView=/i)).toBeInTheDocument();
    expect(screen.getByText(/mock Subtract icon/i)).toBeInTheDocument();
    const zoomoutButtonNode = screen.getByRole('button', {
      name: /zoom out/i,
    });

    expect(zoomoutButtonNode).toBeInTheDocument();
    userEvent.click(zoomoutButtonNode);
    expect(mockZoomOut).toHaveBeenCalled();
  });
  test('should test the camvas controls when show mini map is set to true and click on zoom to fit button', () => {
    initCanvasControls({showMiniMap: true, toggleMiniMap: mockToggleMiniMap});
    expect(screen.getByText(/showinteractive=/i)).toBeInTheDocument();
    expect(screen.getByText(/showZoom=/i)).toBeInTheDocument();
    expect(screen.getByText(/showFitView=/i)).toBeInTheDocument();
    expect(screen.getByText(/mock full screen open icon/i)).toBeInTheDocument();
    const zoomToFitButtonNode = screen.getByRole('button', {
      name: /zoom to fit/i,
    });

    expect(zoomToFitButtonNode).toBeInTheDocument();
    userEvent.click(zoomToFitButtonNode);
    expect(mockFitView).toHaveBeenCalledWith({padding: 0.1});
  });
  test('should test the camvas controls when show mini map is set to true and click on hide map', () => {
    initCanvasControls({showMiniMap: true, toggleMiniMap: mockToggleMiniMap});
    expect(screen.getByText(/showinteractive=/i)).toBeInTheDocument();
    expect(screen.getByText(/showZoom=/i)).toBeInTheDocument();
    expect(screen.getByText(/showFitView=/i)).toBeInTheDocument();
    expect(screen.getByText(/mock toggle map icon/i)).toBeInTheDocument();
    const hideMapButtonNode = screen.getByRole('button', {
      name: /hide map/i,
    });

    expect(hideMapButtonNode).toBeInTheDocument();
    userEvent.click(hideMapButtonNode);
    expect(mockToggleMiniMap).toHaveBeenCalled();
  });
  test('should test the camvas controls when show mini map is set to false and click on hide map', () => {
    initCanvasControls({showMiniMap: false, toggleMiniMap: mockToggleMiniMap});
    expect(screen.getByText(/showinteractive=/i)).toBeInTheDocument();
    expect(screen.getByText(/showZoom=/i)).toBeInTheDocument();
    expect(screen.getByText(/showFitView=/i)).toBeInTheDocument();
    expect(screen.getByText(/mock toggle map icon/i)).toBeInTheDocument();
    const showMapButtonNode = screen.getByRole('button', {
      name: /show map/i,
    });

    expect(showMapButtonNode).toBeInTheDocument();
    userEvent.click(showMapButtonNode);
    expect(mockToggleMiniMap).toHaveBeenCalled();
  });
});


/* eslint-disable no-console */
import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import AddIcon from '../../../components/icons/AddIcon';
import AddEmptyStep from '../../../components/icons/AddEmptyStepIcon';
import AutoRetryIcon from '../../../components/icons/AutoRetryIcon';
import HardCodedIcon from '../../../components/icons/HardCodedIcon';
import LookupLetterIcon from '../../../components/icons/LookupLetterIcon';
import MultiFieldIcon from '../../../components/icons/MultiFieldIcon';
import ReplaceIcon from '../../../components/icons/ReplaceIcon';
import AdjustInventoryIcon from '../../../components/icons/AdjustInventoryIcon';
import AdminIcon from '../../../components/icons/AdminIcon';
import AppBuilderIcon from '../../../components/icons/AppBuilderIcon';
import ArrowLeftIcon from '../../../components/icons/ArrowLeftIcon';
import AgentsIcon from '../../../components/icons/AgentsIcon';
import ArrowRightIcon from '../../../components/icons/ArrowRightIcon';
import ArrowDownIcon from '../../../components/icons/ArrowDownIcon';
import ArrowUpIcon from '../../../components/icons/ArrowUpIcon';
import AuditLogIcon from '../../../components/icons/AuditLogIcon';
import BackArrowIcon from '../../../components/icons/BackArrowIcon';
import BranchIcon from '../../../components/icons/BranchIcon';
import CalendarIcon from '../../../components/icons/CalendarIcon';
import CancelIcon from '../../../components/icons/CancelIcon';
import CheckboxUnselectedIcon from '../../../components/icons/CheckboxUnselectedIcon';
import CheckboxSelectedIcon from '../../../components/icons/CheckboxSelectedIcon';
import CheckmarkIcon from '../../../components/icons/CheckmarkIcon';
import ConditionalIcon from '../../../components/icons/ConditionalIcon';
import CloseIcon from '../../../components/icons/CloseIcon';
import CopyIcon from '../../../components/icons/CopyIcon';
import ConnectorIcon from '../../../components/icons/ConnectorIcon';
import CollapseWindowIcon from '../../../components/icons/CollapseWindowIcon';
import CloudTransferIcon from '../../../components/icons/CloudTransferIcon';
import CeligoMarkIcon from '../../../components/icons/CeligoMarkIcon';
import ConnectionsIcon from '../../../components/icons/ConnectionsIcon';
import ConfigureSettingIcon from '../../../components/icons/ConfigureSettingIcon';
import CommunityIcon from '../../../components/icons/CommunityIcon';
import TransformIcon from '../../../components/icons/TransformIcon';
import DataLoaderIcon from '../../../components/icons/DataLoaderIcon';
import DashboardIcon from '../../../components/icons/DashboardIcon';
import DebugIcon from '../../../components/icons/DebugIcon';
import DownloadIcon from '../../../components/icons/DownloadIcon';
import DownloadIntegrationIcon from '../../../components/icons/DownloadIntegrationIcon';
import DiamondIcon from '../../../components/icons/DiamondIcon';
import EditIcon from '../../../components/icons/EditIcon';
import EditScriptIcon from '../../../components/icons/EditScriptIcon';
import EditorsPlaygroundIcon from '../../../components/icons/EditorsPlaygroundIcon';
import ErrorIcon from '../../../components/icons/ErrorIcon';
import EllipsisHorizontalIcon from '../../../components/icons/EllipsisHorizontalIcon';
import EllipsisVerticalIcon from '../../../components/icons/EllipsisVerticalIcon';
import ExitIcon from '../../../components/icons/ExitIcon';
import ExportsIcon from '../../../components/icons/ExportsIcon';
import ExpandWindowIcon from '../../../components/icons/ExpandWindowIcon';
import FilterIcon from '../../../components/icons/FilterIcon';
import FileIcon from '../../../components/icons/FileIcon';
import FlowBuilderIcon from '../../../components/icons/FlowBuilderIcon';
import FlowsIcon from '../../../components/icons/FlowsIcon';
import FlowBuilderAppIcon from '../../../components/icons/FlowBuilderAppIcon';
import FullScreenOpenIcon from '../../../components/icons/FullScreenOpenIcon';
import FullScreenCloseIcon from '../../../components/icons/FullScreenCloseIcon';
import GettingStartedIcon from '../../../components/icons/GettingStartedIcon';
import GroupOfUsersIcon from '../../../components/icons/GroupOfUsersIcon';
import GraphIcon from '../../../components/icons/GraphIcon';
import GripperIcon from '../../../components/icons/GripperIcon';
import GeneralIcon from '../../../components/icons/GeneralIcon';
import HelpIcon from '../../../components/icons/HelpIcon';
import HideContentIcon from '../../../components/icons/HideContentIcon';
import HomeIcon from '../../../components/icons/HomeIcon';
import HookIcon from '../../../components/icons/HookIcon';
import InfoIcon from '../../../components/icons/InfoIcon';
import InviteUsersIcon from '../../../components/icons/InviteUsersIcon';
import InstallIcon from '../../../components/icons/InstallIcon';
import InstallationGuideIcon from '../../../components/icons/InstallationGuideIcon';
import InstallIntegrationIcon from '../../../components/icons/InstallIntegrationIcon';
import IntegrationAppsIcon from '../../../components/icons/IntegrationAppsIcon';
import ImportsIcon from '../../../components/icons/ImportsIcon';
import IntegrationPinnedIcon from '../../../components/icons/IntegrationPinnedIcon';
import InputFilterIcon from '../../../components/icons/InputFilterIcon';
import KnowledgeBaseIcon from '../../../components/icons/KnowledgeBaseIcon';
import LayoutFourPanelIcon from '../../../components/icons/LayoutFourPanelIcon';
import LayoutTriVerticalIcon from '../../../components/icons/LayoutTriVerticalIcon';
import LayoutLgLeftSmrightIcon from '../../../components/icons/LayoutLgLeftSmrightIcon';
import LayoutLgTopSmBottomIcon from '../../../components/icons/LayoutLgTopSmBottomIcon';
import ListenerIcon from '../../../components/icons/ListenerIcon';
import LicensesIcon from '../../../components/icons/licensesIcon';
import ListViewIcon from '../../../components/icons/ListViewIcon';
import LookUpIcon from '../../../components/icons/LookUpIcon';
import LockIcon from '../../../components/icons/LockIcon';
import MapDataIcon from '../../../components/icons/MapDataIcon';
import MappingConnectorIcon from '../../../components/icons/MappingConnectorIcon';
import MarketplaceIcon from '../../../components/icons/MarketplaceIcon';
import MergeIcon from '../../../components/icons/MergeIcon';
import MyAPIIcon from '../../../components/icons/MyApiIcon';
import NotificationsIcon from '../../../components/icons/NotificationsIcon';
import OutputFilterIcon from '../../../components/icons/OutputFilterIcon';
import OptionalIcon from '../../../components/icons/OptionalIcon';
import PublishIcon from '../../../components/icons/PublishIcon';
import PublishedIcon from '../../../components/icons/PublishedIcon';
import PermissionsManageIcon from '../../../components/icons/PermissionsManageIcon';
import PurgeIcon from '../../../components/icons/PurgeIcon';
import PreferredIcon from '../../../components/icons/PreferredIcon';
import PermissionsMonitorIcon from '../../../components/icons/PermissionsMonitorIcon';
import PermissionExplorerIcon from '../../../components/icons/PermissionExplorerIcon';
import PentagonIcon from '../../../components/icons/PentagonIcon';
import PinIntegrationIcon from '../../../components/icons/PinIntegrationIcon';
import PortalIcon from '../../../components/icons/PortalIcon';
import RadioBtnSelectedIcon from '../../../components/icons/RadioBtnSelectedIcon';
import RadioBtnUnselectedIcon from '../../../components/icons/RadioBtnUnselectedIcon';
import ResourcesIcon from '../../../components/icons/ResourcesIcon';
import RegenerateTokenIcon from '../../../components/icons/RegenerateTokenIcon';
import RegisterConnectionIcon from '../../../components/icons/RegisterConnectionIcon';
import RefreshIcon from '../../../components/icons/RefreshIcon';
import RestoreIcon from '../../../components/icons/RestoreIcon';
import RevokeTokenIcon from '../../../components/icons/RevokeTokenIcon';
import ReactivateTokenIcon from '../../../components/icons/ReactivateTokenIcon';
import ReactivateIcon from '../../../components/icons/ReactivateIcon';
import RenewIcon from '../../../components/icons/RenewIcon';
import RequiredIcon from '../../../components/icons/RequiredIcon';
import RunIcon from '../../../components/icons/RunIcon';
import RecycleBinIcon from '../../../components/icons/RecycleBinIcon';
import StacksIcon from '../../../components/icons/StacksIcon';
import ShowContentIcon from '../../../components/icons/ShowContentIcon';
import SuccessIcon from '../../../components/icons/SuccessIcon';
import ScriptsIcon from '../../../components/icons/ScriptsIcon';
import SearchIcon from '../../../components/icons/SearchIcon';
import SecurityIcon from '../../../components/icons/SecurityIcon';
import ShareStackIcon from '../../../components/icons/ShareStackIcon';
import SettingsIcon from '../../../components/icons/SettingsIcon';
import SubtractIcon from '../../../components/icons/SubtractIcon';
import SupportIcon from '../../../components/icons/SupportIcon';
import SubmitTicketIcon from '../../../components/icons/SubmitTicketIcon';
import SingleUserIcon from '../../../components/icons/SingleUserIcon';
import SquareIcon from '../../../components/icons/SquareIcon';
import StarIcon from '../../../components/icons/StarIcon';
import TilesViewIcon from '../../../components/icons/TilesViewIcon';
import TransferOrderIcon from '../../../components/icons/TransferOrderIcon';
import ToggleMapIcon from '../../../components/icons/ToggleMapIcon';
import ToolsIcon from '../../../components/icons/ToolsIcon';
import TokensApiIcon from '../../../components/icons/TokensApiIcon';
import TransferIcon from '../../../components/icons/TransferIcon';
import TransferDownIcon from '../../../components/icons/TransferDownIcon';
import TransferUpIcon from '../../../components/icons/TransferUpIcon';
import TrashIcon from '../../../components/icons/TrashIcon';
import TransfersIcon from '../../../components/icons/TransfersIcon';
import TriangleIcon from '../../../components/icons/TriangleIcon';
import UnlockIcon from '../../../components/icons/UnlockIcon';
import UnlinkedIcon from '../../../components/icons/unLinkedIcon';
import UploadIcon from '../../../components/icons/UploadIcon';
import UnpublishedIcon from '../../../components/icons/UnpublishedIcon';
import UniversityIcon from '../../../components/icons/UniversityIcon';
import UnpinIntegrationIcon from '../../../components/icons/UnpinIntegrationIcon';
import ViewReferencesIcon from '../../../components/icons/ViewReferencesIcon';
import ViewResolvedHistoryIcon from '../../../components/icons/ViewResolvedHistoryIcon';
import ViewDetailsIcon from '../../../components/icons/ViewDetailsIcon';
import VerticalLayoutIcon from '../../../components/icons/VerticalLayoutIcon';
import WarningIcon from '../../../components/icons/WarningIcon';
import WhatsNewIcon from '../../../components/icons/WhatsNewIcon';

const icons = {
  AddIcon,
  AddEmptyStep,
  AutoRetryIcon,
  HardCodedIcon,
  LookupLetterIcon,
  MultiFieldIcon,
  ReplaceIcon,
  AdjustInventoryIcon,
  AdminIcon,
  AppBuilderIcon,
  ArrowLeftIcon,
  AgentsIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  AuditLogIcon,
  BackArrowIcon,
  BranchIcon,
  CalendarIcon,
  CancelIcon,
  CheckboxUnselectedIcon,
  CheckboxSelectedIcon,
  CheckmarkIcon,
  ConditionalIcon,
  CloseIcon,
  CopyIcon,
  ConnectorIcon,
  CollapseWindowIcon,
  CloudTransferIcon,
  CeligoMarkIcon,
  ConnectionsIcon,
  ConfigureSettingIcon,
  CommunityIcon,
  TransformIcon,
  DataLoaderIcon,
  DashboardIcon,
  DebugIcon,
  DownloadIcon,
  DownloadIntegrationIcon,
  DiamondIcon,
  EditIcon,
  EditScriptIcon,
  EditorsPlaygroundIcon,
  ErrorIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  ExitIcon,
  ExportsIcon,
  ExpandWindowIcon,
  FilterIcon,
  FileIcon,
  FlowBuilderIcon,
  FlowsIcon,
  FlowBuilderAppIcon,
  FullScreenOpenIcon,
  FullScreenCloseIcon,
  GettingStartedIcon,
  GroupOfUsersIcon,
  GraphIcon,
  GripperIcon,
  GeneralIcon,
  HelpIcon,
  HideContentIcon,
  HomeIcon,
  HookIcon,
  InfoIcon,
  InviteUsersIcon,
  InstallIcon,
  InstallationGuideIcon,
  InstallIntegrationIcon,
  IntegrationAppsIcon,
  ImportsIcon,
  IntegrationPinnedIcon,
  InputFilterIcon,
  KnowledgeBaseIcon,
  LayoutFourPanelIcon,
  LayoutTriVerticalIcon,
  LayoutLgLeftSmrightIcon,
  LayoutLgTopSmBottomIcon,
  ListenerIcon,
  LicensesIcon,
  ListViewIcon,
  LookUpIcon,
  LockIcon,
  MapDataIcon,
  MappingConnectorIcon,
  MarketplaceIcon,
  MergeIcon,
  MyAPIIcon,
  NotificationsIcon,
  OutputFilterIcon,
  OptionalIcon,
  PublishIcon,
  PublishedIcon,
  PermissionsManageIcon,
  PurgeIcon,
  PreferredIcon,
  PermissionsMonitorIcon,
  PermissionExplorerIcon,
  PentagonIcon,
  PinIntegrationIcon,
  PortalIcon,
  RadioBtnSelectedIcon,
  RadioBtnUnselectedIcon,
  ResourcesIcon,
  RegenerateTokenIcon,
  RegisterConnectionIcon,
  RefreshIcon,
  RestoreIcon,
  RevokeTokenIcon,
  ReactivateTokenIcon,
  ReactivateIcon,
  RenewIcon,
  RequiredIcon,
  RunIcon,
  RecycleBinIcon,
  StacksIcon,
  ShowContentIcon,
  SuccessIcon,
  ScriptsIcon,
  SearchIcon,
  SecurityIcon,
  ShareStackIcon,
  SettingsIcon,
  SubtractIcon,
  SupportIcon,
  SubmitTicketIcon,
  SingleUserIcon,
  SquareIcon,
  StarIcon,
  TilesViewIcon,
  TransferOrderIcon,
  ToggleMapIcon,
  ToolsIcon,
  TokensApiIcon,
  TransferIcon,
  TransferDownIcon,
  TransferUpIcon,
  TrashIcon,
  TransfersIcon,
  TriangleIcon,
  UnlockIcon,
  UnlinkedIcon,
  UploadIcon,
  UnpublishedIcon,
  UniversityIcon,
  UnpinIntegrationIcon,
  ViewReferencesIcon,
  VerticalLayoutIcon,
  ViewResolvedHistoryIcon,
  ViewDetailsIcon,
  WarningIcon,
  WhatsNewIcon,
};

export default {
  title: 'Branding/Icons/All Icons',
  argTypes: {
    fontSize: {
      control: {
        type: 'radio',
        options: ['default', 'small', 'large'],
      },
    },
    color: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'action', 'disabled', 'error'],
      },
    },
  },
};

const useStyles = makeStyles(theme => ({
  allIconContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  iconContainer: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    textAlign: 'center',
    position: 'relative',
    borderRadius: 4,
    cursor: 'pointer',
    '&:hover': {
      borderColor: theme.palette.primary.light,
    },
  },
}));

const IconTemplate = ({ Icon, iconName, args }) => {
  const classes = useStyles();
  const [enquesnackbar] = useEnqueueSnackbar();

  const handleCopy = copiedText => {
    enquesnackbar({ message: `${copiedText} copied!` });
  };

  return (
    <CopyToClipboard onCopy={handleCopy} text={`<${iconName}/>`} key={iconName}>
      <div className={classes.iconContainer}>
        <Icon {...args} />
        <Typography variant="body2">{iconName.replace('Icon', '')}</Typography>
      </div>
    </CopyToClipboard>
  );
};

export function All(args) {
  const classes = useStyles();

  return (
    <div className={classes.allIconContainer}>
      {Object.keys(icons).map(iconName => (
        <IconTemplate
          key={iconName}
          Icon={icons[iconName]}
          iconName={iconName}
          args={args}
        />
      ))}
    </div>
  );
}

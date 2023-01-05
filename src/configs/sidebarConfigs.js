import {
  FcConferenceCall,
  FcPositiveDynamic,
  FcServices,
  FcMindMap,
  FcGoodDecision,
  FcApproval,
  FcApprove,
} from 'react-icons/fc';
import { GiGamepadCross } from 'react-icons/gi';
import { MdSettingsSuggest } from 'react-icons/md';

import { TiMessages } from 'react-icons/ti';
import { getRandomHsl } from '../utils/functions/getRandomHsl';

export const aDashboardSidebarConfig = [
  {
    item: 'Home',
    icon: <FcPositiveDynamic className="sidebar__icon" />,
    path: '/',
  },
  {
    item: 'Manage Users',
    icon: <FcConferenceCall className="sidebar__icon" />,
    path: '/users',
  },
  {
    item: 'Round Management',
    icon: <GiGamepadCross className="sidebar__icon" />,
    path: '/round-management',
  },
  {
    item: 'Game Setup',
    icon: <FcServices className="sidebar__icon" />,
    path: '/game-setup',
  },
  {
    item: 'Messages',
    icon: <TiMessages className="sidebar__icon" color={getRandomHsl()} />,
    path: '/messages',
  },
];

export const mDashboardSidebarConfig = [
  {
    item: 'Performance Metric',
    icon: <FcMindMap className="sidebar__icon" />,
    path: '/',
  },
  {
    item: 'My Team',
    icon: <FcConferenceCall className="sidebar__icon" />,
    path: '/my-team',
    showBadge: true,
  },
  {
    item: 'Recruitment Room',
    icon: <FcGoodDecision className="sidebar__icon" />,
    path: '/recruitment-room',
  },
  {
    item: 'Messenger',
    icon: <TiMessages className="sidebar__icon" color={getRandomHsl()} />,
    path: '/messenger',
    showBadge: true,
  },
  {
    item: 'Operation Room',
    icon: <MdSettingsSuggest className="sidebar__icon" />,
    path: '/operationroom',
  },
  {
    item: 'About',
    icon: <FcApproval className="sidebar__icon" />,
    path: '/about',
  },
];

export const eDashboardSidebarConfig = [
  {
    item: 'Performance Metric',
    icon: <FcMindMap className="sidebar__icon" />,
    path: '/',
  },
  {
    item: 'My Team',
    icon: <FcConferenceCall className="sidebar__icon" />,
    path: '/my-team',
  },
  {
    item: 'Offers Acceptance',
    icon: <FcApprove className="sidebar__icon" />,
    path: '/offers',
    showBadge: true,
  },
  {
    item: 'Chat/Messenger',
    icon: <TiMessages className="sidebar__icon" color={getRandomHsl()} />,
    path: '/chat',
    showBadge: true,
  },
  {
    item: 'Operation Room',
    icon: <MdSettingsSuggest className="sidebar__icon" />,
    path: '/operation-room',
  },
  {
    item: 'About',
    icon: <FcApproval className="sidebar__icon" />,
    path: '/about',
  },
];

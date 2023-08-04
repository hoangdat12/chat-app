import {
  ChangePassword,
  ConfirmChangeEmail,
  LockAccount,
} from '../../components/setting/SettingSecurityChilrend';

export const listSecurity = [
  {
    title: 'Change Email',
    chilrend: ConfirmChangeEmail,
  },
  {
    title: 'Change Password',
    chilrend: ChangePassword,
  },
  {
    title: 'Lock Account',
    chilrend: LockAccount,
  },
];

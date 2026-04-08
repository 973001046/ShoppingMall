/**
 * 用户角色配置
 * 统一管理角色名称、颜色、Tag状态
 */

export interface RoleConfig {
  text: string;
  color: string;
  tagStatus?: 'Success' | 'Default' | 'Processing' | 'Error' | 'Warning';
}

export const ROLE_CONFIG: Record<string, RoleConfig> = {
  admin: {
    text: '超级管理员',
    color: 'red',
    tagStatus: 'Success',
  },
  user: {
    text: '管理员',
    color: 'blue',
    tagStatus: 'Default',
  },
  editor: {
    text: '编辑',
    color: 'green',
    tagStatus: 'Processing',
  },
};

/**
 * 获取角色配置
 */
export const getRoleConfig = (role: string): RoleConfig => {
  return ROLE_CONFIG[role] || { text: role, color: 'default' };
};

/**
 * 获取所有角色选项（用于 Select 组件）
 */
export const getRoleOptions = () => {
  return Object.entries(ROLE_CONFIG).map(([key, config]) => ({
    value: key,
    label: config.text,
    color: config.color,
  }));
};

/**
 * 获取 ProTable valueEnum 配置
 */
export const getRoleValueEnum = () => {
  const valueEnum: Record<string, { text: string; status: string }> = {};
  Object.entries(ROLE_CONFIG).forEach(([key, config]) => {
    valueEnum[key] = {
      text: config.text,
      status: config.tagStatus || 'Default',
    };
  });
  return valueEnum;
};

import { request } from '@umijs/max';

export interface UserItem {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: number; // 0: 禁用, 1: 启用
  createTime: string;
  lastLoginTime: string;
  avatar?: string;
}

export interface UserParams {
  current?: number;
  pageSize?: number;
  username?: string;
  email?: string;
  role?: string;
  status?: number;
  createTime?: [string, string];
}

export interface UserListResult {
  data: UserItem[];
  success: boolean;
  total: number;
}

export interface UpdateRoleParams {
  userId: string;
  role: string;
}

export interface ToggleStatusParams {
  userId: string;
  status: number;
}

export interface DeleteUserParams {
  userId: string;
}

/** 获取用户列表 */
export async function getUserList(
  params: UserParams,
  options?: { [key: string]: any },
) {
  return request<UserListResult>('/api/users', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 更新用户角色 */
export async function updateUserRole(
  params: UpdateRoleParams,
  options?: { [key: string]: any },
) {
  return request<{ success: boolean }>('/api/users/role', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 切换用户状态 */
export async function toggleUserStatus(
  params: ToggleStatusParams,
  options?: { [key: string]: any },
) {
  return request<{ success: boolean }>('/api/users/status', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 删除用户 */
export async function deleteUser(
  params: DeleteUserParams,
  options?: { [key: string]: any },
) {
  return request<{ success: boolean }>('/api/users', {
    method: 'DELETE',
    params,
    ...(options || {}),
  });
}

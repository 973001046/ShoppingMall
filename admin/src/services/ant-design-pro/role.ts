import { request } from '@umijs/max';

// 角色类型定义
export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: 1 | 0;
  permissions: string[];
  createTime?: string;
  updateTime?: string;
}

// 权限类型定义
export interface Permission {
  id: string;
  name: string;
  code: string;
  type: 'page' | 'button';
  description?: string;
  children?: Permission[];
}

// 创建角色参数
export interface CreateRoleParams {
  name: string;
  code: string;
  description?: string;
  status: 1 | 0;
}

// 更新角色参数
export interface UpdateRoleParams extends CreateRoleParams {
  id: string;
}

// 删除角色参数
export interface DeleteRoleParams {
  id: string;
}

// 配置权限参数
export interface ConfigPermissionParams {
  roleId: string;
  permissionIds: string[];
}

// 获取角色列表
export async function getRoleList(
  params?: {
    current?: number;
    pageSize?: number;
    name?: string;
    code?: string;
    status?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: Role[];
    total: number;
    success: boolean;
  }>('/api/roles', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

// 获取所有角色（用于下拉选择）
export async function getAllRoles(options?: { [key: string]: any }) {
  return request<Role[]>('/api/roles/all', {
    method: 'GET',
    ...(options || {}),
  });
}

// 创建角色
export async function createRole(
  params: CreateRoleParams,
  options?: { [key: string]: any },
) {
  return request<{ success: boolean; data: Role }>('/api/roles', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

// 更新角色
export async function updateRole(
  params: UpdateRoleParams,
  options?: { [key: string]: any },
) {
  return request<{ success: boolean }>(`/api/roles/${params.id}`, {
    method: 'PUT',
    data: params,
    ...(options || {}),
  });
}

// 删除角色
export async function deleteRole(
  params: DeleteRoleParams,
  options?: { [key: string]: any },
) {
  return request<{ success: boolean }>(`/api/roles/${params.id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 获取所有权限（权限树）
export async function getAllPermissions(options?: { [key: string]: any }) {
  return request<Permission[]>('/api/permissions/all', {
    method: 'GET',
    ...(options || {}),
  });
}

// 配置角色权限
export async function configRolePermissions(
  params: ConfigPermissionParams,
  options?: { [key: string]: any },
) {
  return request<{ success: boolean }>(`/api/roles/${params.roleId}/permissions`, {
    method: 'POST',
    data: { permissionIds: params.permissionIds },
    ...(options || {}),
  });
}

// 获取角色权限
export async function getRolePermissions(
  params: { roleId: string },
  options?: { [key: string]: any },
) {
  return request<{ data: string[] }>(`/api/roles/${params.roleId}/permissions`, {
    method: 'GET',
    ...(options || {}),
  });
}

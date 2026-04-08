import { request } from '@umijs/max';

// 权限类型定义
export interface Permission {
  id: string;
  name: string;
  code: string;
  type: 'page' | 'button' | 'api';
  description?: string;
  parentId?: string | null;
  sort?: number;
  status: 1 | 0;
  children?: Permission[];
  roles?: string[];
}

// 角色类型定义
export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: 1 | 0;
}

// 创建权限参数
export interface CreatePermissionParams {
  name: string;
  code: string;
  type: 'page' | 'button' | 'api';
  description?: string;
  parentId?: string | null;
  sort?: number;
  status: 1 | 0;
}

// 更新权限参数
export interface UpdatePermissionParams extends CreatePermissionParams {
  id: string;
}

// 删除权限参数
export interface DeletePermissionParams {
  id: string;
}

// 分配权限参数
export interface AssignPermissionParams {
  permissionId: string;
  roleIds: string[];
}

/** 获取权限树列表 */
export async function getPermissionList(options?: { [key: string]: any }) {
  return request<Permission[]>('/api/permissions', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建权限 */
export async function createPermission(
  params: CreatePermissionParams,
  options?: { [key: string]: any },
) {
  return request<{ success: boolean; data: Permission }>('/api/permissions', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 更新权限 */
export async function updatePermission(
  params: UpdatePermissionParams,
  options?: { [key: string]: any },
) {
  return request<{ success: boolean }>(`/api/permissions/${params.id}`, {
    method: 'PUT',
    data: params,
    ...(options || {}),
  });
}

/** 删除权限 */
export async function deletePermission(
  params: DeletePermissionParams,
  options?: { [key: string]: any },
) {
  return request<{ success: boolean }>(`/api/permissions/${params.id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 获取角色列表 */
export async function getRoleList(
  params?: {
    current?: number;
    pageSize?: number;
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

/** 分配权限给角色 */
export async function assignPermissionToRoles(
  params: AssignPermissionParams,
  options?: { [key: string]: any },
) {
  return request<{ success: boolean }>(`/api/permissions/${params.permissionId}/assign`, {
    method: 'POST',
    data: { roleIds: params.roleIds },
    ...(options || {}),
  });
}

/** 获取权限已分配的角色 */
export async function getPermissionRoles(
  params: { permissionId: string },
  options?: { [key: string]: any },
) {
  return request<{ data: string[] }>(`/api/permissions/${params.permissionId}/roles`, {
    method: 'GET',
    ...(options || {}),
  });
}

import dayjs from 'dayjs';
import type { Request, Response } from 'express';

// 权限树数据 - 完整的页面和按钮权限
let permissions = [
  {
    id: 'perm_1',
    name: '数据概览',
    code: 'page:dashboard',
    type: 'page' as const,
    description: '数据概览页面访问权限',
    parentId: null,
    sort: 1,
    status: 1 as const,
    roles: ['admin', 'user', 'editor', 'operator'],
    children: [
      { id: 'perm_1_1', name: '查看统计', code: 'dashboard:view', type: 'button' as const, description: '查看数据统计图表', parentId: 'perm_1', sort: 1, status: 1 as const, roles: ['admin', 'user', 'editor', 'operator'] },
      { id: 'perm_1_2', name: '导出报表', code: 'dashboard:export', type: 'button' as const, description: '导出统计报表', parentId: 'perm_1', sort: 2, status: 1 as const, roles: ['admin', 'user'] },
      { id: 'perm_1_3', name: '刷新数据', code: 'dashboard:refresh', type: 'api' as const, description: '刷新实时数据', parentId: 'perm_1', sort: 3, status: 1 as const, roles: ['admin', 'user', 'editor', 'operator'] },
    ],
  },
  {
    id: 'perm_2',
    name: '用户管理',
    code: 'page:user',
    type: 'page' as const,
    description: '用户管理页面访问权限',
    parentId: null,
    sort: 2,
    status: 1 as const,
    roles: ['admin', 'user'],
    children: [
      { id: 'perm_2_1', name: '查看用户', code: 'user:view', type: 'button' as const, description: '查看用户列表', parentId: 'perm_2', sort: 1, status: 1 as const, roles: ['admin', 'user'] },
      { id: 'perm_2_2', name: '新增用户', code: 'user:add', type: 'button' as const, description: '创建新用户', parentId: 'perm_2', sort: 2, status: 1 as const, roles: ['admin'] },
      { id: 'perm_2_3', name: '编辑用户', code: 'user:edit', type: 'button' as const, description: '编辑用户信息', parentId: 'perm_2', sort: 3, status: 1 as const, roles: ['admin', 'user'] },
      { id: 'perm_2_4', name: '删除用户', code: 'user:delete', type: 'button' as const, description: '删除用户账号', parentId: 'perm_2', sort: 4, status: 1 as const, roles: ['admin'] },
      { id: 'perm_2_5', name: '重置密码', code: 'user:reset', type: 'button' as const, description: '重置用户密码', parentId: 'perm_2', sort: 5, status: 1 as const, roles: ['admin'] },
      { id: 'perm_2_6', name: '导出用户', code: 'user:export', type: 'button' as const, description: '导出用户数据', parentId: 'perm_2', sort: 6, status: 1 as const, roles: ['admin', 'user'] },
    ],
  },
  {
    id: 'perm_3',
    name: '角色管理',
    code: 'page:role',
    type: 'page' as const,
    description: '角色管理页面访问权限',
    parentId: null,
    sort: 3,
    status: 1 as const,
    roles: ['admin'],
    children: [
      { id: 'perm_3_1', name: '查看角色', code: 'role:view', type: 'button' as const, description: '查看角色列表', parentId: 'perm_3', sort: 1, status: 1 as const, roles: ['admin'] },
      { id: 'perm_3_2', name: '新增角色', code: 'role:add', type: 'button' as const, description: '创建新角色', parentId: 'perm_3', sort: 2, status: 1 as const, roles: ['admin'] },
      { id: 'perm_3_3', name: '编辑角色', code: 'role:edit', type: 'button' as const, description: '编辑角色信息', parentId: 'perm_3', sort: 3, status: 1 as const, roles: ['admin'] },
      { id: 'perm_3_4', name: '删除角色', code: 'role:delete', type: 'button' as const, description: '删除角色', parentId: 'perm_3', sort: 4, status: 1 as const, roles: ['admin'] },
    ],
  },
  {
    id: 'perm_4',
    name: '权限管理',
    code: 'page:permission',
    type: 'page' as const,
    description: '权限管理页面访问权限',
    parentId: null,
    sort: 4,
    status: 1 as const,
    roles: ['admin'],
    children: [
      { id: 'perm_4_1', name: '查看权限', code: 'permission:view', type: 'button' as const, description: '查看权限列表', parentId: 'perm_4', sort: 1, status: 1 as const, roles: ['admin'] },
      { id: 'perm_4_2', name: '新增权限', code: 'permission:add', type: 'button' as const, description: '新增权限节点', parentId: 'perm_4', sort: 2, status: 1 as const, roles: ['admin'] },
      { id: 'perm_4_3', name: '编辑权限', code: 'permission:edit', type: 'button' as const, description: '编辑权限信息', parentId: 'perm_4', sort: 3, status: 1 as const, roles: ['admin'] },
      { id: 'perm_4_4', name: '删除权限', code: 'permission:delete', type: 'button' as const, description: '删除权限', parentId: 'perm_4', sort: 4, status: 1 as const, roles: ['admin'] },
      { id: 'perm_4_5', name: '分配角色', code: 'permission:assign', type: 'button' as const, description: '为权限分配角色', parentId: 'perm_4', sort: 5, status: 1 as const, roles: ['admin'] },
    ],
  },
  {
    id: 'perm_5',
    name: '订单管理',
    code: 'page:order',
    type: 'page' as const,
    description: '订单管理页面访问权限',
    parentId: null,
    sort: 5,
    status: 1 as const,
    roles: ['admin', 'user', 'operator'],
    children: [
      { id: 'perm_5_1', name: '查看订单', code: 'order:view', type: 'button' as const, description: '查看订单列表', parentId: 'perm_5', sort: 1, status: 1 as const, roles: ['admin', 'user', 'operator'] },
      { id: 'perm_5_2', name: '新增订单', code: 'order:add', type: 'button' as const, description: '创建新订单', parentId: 'perm_5', sort: 2, status: 1 as const, roles: ['admin', 'operator'] },
      { id: 'perm_5_3', name: '编辑订单', code: 'order:edit', type: 'button' as const, description: '编辑订单信息', parentId: 'perm_5', sort: 3, status: 1 as const, roles: ['admin', 'user', 'operator'] },
      { id: 'perm_5_4', name: '删除订单', code: 'order:delete', type: 'button' as const, description: '删除订单', parentId: 'perm_5', sort: 4, status: 1 as const, roles: ['admin'] },
      { id: 'perm_5_5', name: '订单审核', code: 'order:audit', type: 'button' as const, description: '审核订单', parentId: 'perm_5', sort: 5, status: 1 as const, roles: ['admin', 'user'] },
      { id: 'perm_5_6', name: '导出订单', code: 'order:export', type: 'button' as const, description: '导出订单数据', parentId: 'perm_5', sort: 6, status: 1 as const, roles: ['admin', 'user'] },
    ],
  },
  {
    id: 'perm_6',
    name: '商品管理',
    code: 'page:product',
    type: 'page' as const,
    description: '商品管理页面访问权限',
    parentId: null,
    sort: 6,
    status: 1 as const,
    roles: ['admin', 'user', 'editor'],
    children: [
      { id: 'perm_6_1', name: '查看商品', code: 'product:view', type: 'button' as const, description: '查看商品列表', parentId: 'perm_6', sort: 1, status: 1 as const, roles: ['admin', 'user', 'editor'] },
      { id: 'perm_6_2', name: '新增商品', code: 'product:add', type: 'button' as const, description: '添加新商品', parentId: 'perm_6', sort: 2, status: 1 as const, roles: ['admin', 'editor'] },
      { id: 'perm_6_3', name: '编辑商品', code: 'product:edit', type: 'button' as const, description: '编辑商品信息', parentId: 'perm_6', sort: 3, status: 1 as const, roles: ['admin', 'editor'] },
      { id: 'perm_6_4', name: '删除商品', code: 'product:delete', type: 'button' as const, description: '删除商品', parentId: 'perm_6', sort: 4, status: 1 as const, roles: ['admin'] },
      { id: 'perm_6_5', name: '上下架', code: 'product:status', type: 'button' as const, description: '商品上下架', parentId: 'perm_6', sort: 5, status: 1 as const, roles: ['admin', 'editor'] },
    ],
  },
];

// 生成唯一ID
let idCounter = 100;
const generateId = () => {
  idCounter += 1;
  return `perm_${idCounter}`;
};

// 递归查找权限
const findPermission = (items: any[], id: string): any => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findPermission(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

// 递归查找父节点并添加子节点
const addChildPermission = (items: any[], parentId: string, newItem: any): boolean => {
  for (const item of items) {
    if (item.id === parentId) {
      if (!item.children) item.children = [];
      item.children.push(newItem);
      return true;
    }
    if (item.children) {
      const added = addChildPermission(item.children, parentId, newItem);
      if (added) return true;
    }
  }
  return false;
};

// 递归更新权限
const updatePermissionItem = (items: any[], id: string, updates: any): boolean => {
  for (const item of items) {
    if (item.id === id) {
      Object.assign(item, updates);
      return true;
    }
    if (item.children) {
      const updated = updatePermissionItem(item.children, id, updates);
      if (updated) return true;
    }
  }
  return false;
};

// 递归删除权限
const deletePermissionItem = (items: any[], id: string): boolean => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      items.splice(i, 1);
      return true;
    }
    if (items[i].children) {
      const deleted = deletePermissionItem(items[i].children, id);
      if (deleted) return true;
    }
  }
  return false;
};

// 角色数据
const roles = [
  { id: '1', name: '超级管理员', code: 'admin', description: '拥有系统所有权限', status: 1 },
  { id: '2', name: '管理员', code: 'user', description: '日常运营管理权限', status: 1 },
  { id: '3', name: '运营专员', code: 'operator', description: '负责订单处理', status: 1 },
  { id: '4', name: '内容编辑', code: 'editor', description: '商品信息维护', status: 1 },
  { id: '5', name: '财务人员', code: 'finance', description: '查看财务报表', status: 0 },
];

export default {
  // 获取权限树列表
  'GET /api/permissions': (_req: Request, res: Response) => {
    res.json({
      data: permissions,
      success: true,
    });
  },

  // 创建权限
  'POST /api/permissions': (req: Request, res: Response) => {
    const { name, code, type, description, parentId, sort, status } = req.body;

    const newPermission = {
      id: generateId(),
      name,
      code,
      type,
      description,
      parentId: parentId || null,
      sort: sort || 0,
      status: status || 1,
      roles: [],
      children: [],
    };

    if (parentId) {
      const added = addChildPermission(permissions, parentId, newPermission);
      if (!added) {
        res.status(404).json({ success: false, message: '父权限不存在' });
        return;
      }
    } else {
      permissions.push(newPermission);
    }

    res.json({ success: true, data: newPermission });
  },

  // 更新权限
  'PUT /api/permissions/:id': (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updates = req.body;

    const updated = updatePermissionItem(permissions, id, updates);
    if (updated) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: '权限不存在' });
    }
  },

  // 删除权限
  'DELETE /api/permissions/:id': (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const deleted = deletePermissionItem(permissions, id);
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: '权限不存在' });
    }
  },

  // 获取角色列表
  'GET /api/roles': (req: Request, res: Response) => {
    const {
      current = 1,
      pageSize = 10,
      status,
    } = req.query;

    let data = [...roles];

    if (status !== undefined && status !== '') {
      data = data.filter((item) => item.status === Number(status));
    }

    const total = data.length;
    const startIndex = (Number(current) - 1) * Number(pageSize);
    const endIndex = startIndex + Number(pageSize);
    data = data.slice(startIndex, endIndex);

    res.json({
      success: true,
      data,
      total,
    });
  },

  // 分配权限给角色
  'POST /api/permissions/:id/assign': (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { roleIds } = req.body;

    const permission = findPermission(permissions, id);
    if (!permission) {
      res.status(404).json({ success: false, message: '权限不存在' });
      return;
    }

    permission.roles = roleIds || [];

    res.json({
      success: true,
      message: `已为权限「${permission.name}」分配 ${roleIds?.length || 0} 个角色`,
    });
  },

  // 获取权限已分配的角色
  'GET /api/permissions/:id/roles': (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const permission = findPermission(permissions, id);
    if (!permission) {
      res.status(404).json({ success: false, message: '权限不存在' });
      return;
    }

    res.json({
      success: true,
      data: permission.roles || [],
    });
  },
};

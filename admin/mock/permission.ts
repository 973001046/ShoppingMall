import type { Request, Response } from 'express';

// 在mock文件中直接定义类型，避免路径别名问题
type PermissionType = 'page' | 'button' | 'api';

interface Permission {
  id: string;
  name: string;
  code: string;
  type: PermissionType;
  description?: string;
  parentId?: string | null;
  sort?: number;
  status: 1 | 0;
  children?: Permission[];
  createTime?: string;
  updateTime?: string;
}

// 模拟权限数据
let permissions: Permission[] = [
  // 系统管理
  {
    id: '1',
    name: '系统管理',
    code: 'system',
    type: 'page',
    description: '系统管理模块',
    parentId: null,
    sort: 1,
    status: 1,
    children: [
      {
        id: '1-1',
        name: '用户管理',
        code: 'user:manage',
        type: 'page',
        description: '管理系统用户',
        parentId: '1',
        sort: 1,
        status: 1,
        children: [
          {
            id: '1-1-0',
            name: '用户详情',
            code: 'user:detail',
            type: 'page',
            description: '用户详情页面',
            parentId: '1-1',
            sort: 0,
            status: 1,
            children: [
              { id: '1-1-0-1', name: '查看详情', code: 'user:detail:view', type: 'button', description: '查看用户详情', parentId: '1-1-0', sort: 1, status: 1 },
              { id: '1-1-0-2', name: '编辑详情', code: 'user:detail:edit', type: 'button', description: '编辑用户详情', parentId: '1-1-0', sort: 2, status: 1 },
            ],
          },
          { id: '1-1-1', name: '新增用户', code: 'user:add', type: 'button', description: '新增用户按钮权限', parentId: '1-1', sort: 1, status: 1 },
          { id: '1-1-2', name: '编辑用户', code: 'user:edit', type: 'button', description: '编辑用户按钮权限', parentId: '1-1', sort: 2, status: 1 },
          { id: '1-1-3', name: '删除用户', code: 'user:delete', type: 'button', description: '删除用户按钮权限', parentId: '1-1', sort: 3, status: 1 },
          { id: '1-1-4', name: '重置密码', code: 'user:resetPwd', type: 'button', description: '重置用户密码', parentId: '1-1', sort: 4, status: 1 },
        ],
      },
      {
        id: '1-2',
        name: '角色管理',
        code: 'role:manage',
        type: 'page',
        description: '管理系统角色',
        parentId: '1',
        sort: 2,
        status: 1,
        children: [
          { id: '1-2-1', name: '新增角色', code: 'role:add', type: 'button', description: '新增角色按钮权限', parentId: '1-2', sort: 1, status: 1 },
          { id: '1-2-2', name: '编辑角色', code: 'role:edit', type: 'button', description: '编辑角色按钮权限', parentId: '1-2', sort: 2, status: 1 },
          { id: '1-2-3', name: '删除角色', code: 'role:delete', type: 'button', description: '删除角色按钮权限', parentId: '1-2', sort: 3, status: 1 },
          { id: '1-2-4', name: '分配权限', code: 'role:assign', type: 'button', description: '为角色分配权限', parentId: '1-2', sort: 4, status: 1 },
        ],
      },
      {
        id: '1-3',
        name: '权限管理',
        code: 'permission:manage',
        type: 'page',
        description: '管理系统权限',
        parentId: '1',
        sort: 3,
        status: 1,
        children: [
          { id: '1-3-1', name: '新增页面', code: 'permission:addPage', type: 'button', description: '新增页面权限', parentId: '1-3', sort: 1, status: 1 },
          { id: '1-3-2', name: '新增按钮', code: 'permission:addBtn', type: 'button', description: '新增按钮权限', parentId: '1-3', sort: 2, status: 1 },
          { id: '1-3-3', name: '编辑权限', code: 'permission:edit', type: 'button', description: '编辑权限按钮权限', parentId: '1-3', sort: 3, status: 1 },
          { id: '1-3-4', name: '删除权限', code: 'permission:delete', type: 'button', description: '删除权限按钮权限', parentId: '1-3', sort: 4, status: 1 },
        ],
      },
      {
        id: '1-4',
        name: '角色配置',
        code: 'role:config',
        type: 'page',
        description: '角色权限配置中心',
        parentId: '1',
        sort: 4,
        status: 1,
        children: [
          { id: '1-4-1', name: '新增角色配置', code: 'role:config:add', type: 'button', description: '新增角色配置', parentId: '1-4', sort: 1, status: 1 },
          { id: '1-4-2', name: '编辑角色配置', code: 'role:config:edit', type: 'button', description: '编辑角色配置', parentId: '1-4', sort: 2, status: 1 },
          { id: '1-4-3', name: '删除角色配置', code: 'role:config:delete', type: 'button', description: '删除角色配置', parentId: '1-4', sort: 3, status: 1 },
          { id: '1-4-4', name: '分配菜单权限', code: 'role:config:menu', type: 'button', description: '为角色配置菜单权限', parentId: '1-4', sort: 4, status: 1 },
          { id: '1-4-5', name: '分配数据权限', code: 'role:config:data', type: 'button', description: '为角色配置数据权限', parentId: '1-4', sort: 5, status: 1 },
        ],
      },
    ],
  },
  // 商品管理
  {
    id: '2',
    name: '商品管理',
    code: 'product',
    type: 'page',
    description: '商品管理模块',
    parentId: null,
    sort: 2,
    status: 1,
    children: [
      {
        id: '2-1',
        name: '商品列表',
        code: 'product:list',
        type: 'page',
        description: '查看商品列表',
        parentId: '2',
        sort: 1,
        status: 1,
        children: [
          { id: '2-1-1', name: '新增商品', code: 'product:add', type: 'button', description: '新增商品按钮权限', parentId: '2-1', sort: 1, status: 1 },
          { id: '2-1-2', name: '编辑商品', code: 'product:edit', type: 'button', description: '编辑商品按钮权限', parentId: '2-1', sort: 2, status: 1 },
          { id: '2-1-3', name: '删除商品', code: 'product:delete', type: 'button', description: '删除商品按钮权限', parentId: '2-1', sort: 3, status: 1 },
          { id: '2-1-4', name: '上架/下架', code: 'product:toggle', type: 'button', description: '商品上下架权限', parentId: '2-1', sort: 4, status: 1 },
          { id: '2-1-5', name: '批量操作', code: 'product:batch', type: 'button', description: '批量操作商品权限', parentId: '2-1', sort: 5, status: 1 },
        ],
      },
      {
        id: '2-2',
        name: '分类管理',
        code: 'product:category',
        type: 'page',
        description: '管理商品分类',
        parentId: '2',
        sort: 2,
        status: 1,
        children: [
          { id: '2-2-1', name: '新增分类', code: 'category:add', type: 'button', description: '新增商品分类', parentId: '2-2', sort: 1, status: 1 },
          { id: '2-2-2', name: '编辑分类', code: 'category:edit', type: 'button', description: '编辑商品分类', parentId: '2-2', sort: 2, status: 1 },
          { id: '2-2-3', name: '删除分类', code: 'category:delete', type: 'button', description: '删除商品分类', parentId: '2-2', sort: 3, status: 1 },
        ],
      },
      {
        id: '2-3',
        name: '品牌管理',
        code: 'product:brand',
        type: 'page',
        description: '管理商品品牌',
        parentId: '2',
        sort: 3,
        status: 1,
        children: [
          { id: '2-3-1', name: '新增品牌', code: 'brand:add', type: 'button', description: '新增商品品牌', parentId: '2-3', sort: 1, status: 1 },
          { id: '2-3-2', name: '编辑品牌', code: 'brand:edit', type: 'button', description: '编辑商品品牌', parentId: '2-3', sort: 2, status: 1 },
          { id: '2-3-3', name: '删除品牌', code: 'brand:delete', type: 'button', description: '删除商品品牌', parentId: '2-3', sort: 3, status: 1 },
        ],
      },
    ],
  },
  // 订单管理
  {
    id: '3',
    name: '订单管理',
    code: 'order',
    type: 'page',
    description: '订单管理模块',
    parentId: null,
    sort: 3,
    status: 1,
    children: [
      {
        id: '3-1',
        name: '订单列表',
        code: 'order:list',
        type: 'page',
        description: '查看订单列表',
        parentId: '3',
        sort: 1,
        status: 1,
        children: [
          { id: '3-1-1', name: '查看详情', code: 'order:detail', type: 'button', description: '查看订单详情', parentId: '3-1', sort: 1, status: 1 },
          { id: '3-1-2', name: '取消订单', code: 'order:cancel', type: 'button', description: '取消订单', parentId: '3-1', sort: 2, status: 1 },
          { id: '3-1-3', name: '确认发货', code: 'order:ship', type: 'button', description: '确认订单发货', parentId: '3-1', sort: 3, status: 1 },
          { id: '3-1-4', name: '退款处理', code: 'order:refund', type: 'button', description: '处理退款申请', parentId: '3-1', sort: 4, status: 1 },
        ],
      },
      {
        id: '3-2',
        name: '售后管理',
        code: 'order:aftersale',
        type: 'page',
        description: '售后问题处理',
        parentId: '3',
        sort: 2,
        status: 1,
        children: [
          { id: '3-2-1', name: '处理售后', code: 'aftersale:handle', type: 'button', description: '处理售后申请', parentId: '3-2', sort: 1, status: 1 },
          { id: '3-2-2', name: '同意退款', code: 'aftersale:approve', type: 'button', description: '同意退款申请', parentId: '3-2', sort: 2, status: 1 },
          { id: '3-2-3', name: '拒绝退款', code: 'aftersale:reject', type: 'button', description: '拒绝退款申请', parentId: '3-2', sort: 3, status: 1 },
        ],
      },
    ],
  },
];

// 扁平化权限列表
const flattenPermissions = (perms: Permission[]): Permission[] => {
  const result: Permission[] = [];
  perms.forEach((perm) => {
    result.push(perm);
    if (perm.children && perm.children!.length > 0) {
      result.push(...flattenPermissions(perm.children!));
    }
  });
  return result;
};

// 获取权限列表
function getPermissionList(req: Request, res: Response) {
  return res.json(permissions);
}

// 创建权限
function createPermission(req: Request, res: Response) {
  const body = req.body;
  const newPermission: Permission = {
    ...body,
    id: `${Date.now()}`,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
  };

  if (body.parentId) {
    const flatPerms = flattenPermissions(permissions);
    const parent = flatPerms.find((p) => p.id === body.parentId);
    if (parent) {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(newPermission);
    }
  } else {
    permissions.push(newPermission);
  }

  return res.json({
    success: true,
    data: newPermission,
  });
}

// 更新权限
function updatePermission(req: Request, res: Response) {
  const { id } = req.params;
  const body = req.body;

  const flatPerms = flattenPermissions(permissions);
  const permIndex = flatPerms.findIndex((p) => p.id === id);

  if (permIndex === -1) {
    return res.status(404).json({
      success: false,
      errorMessage: '权限不存在',
    });
  }

  const updatedPermission = {
    ...flatPerms[permIndex],
    ...body,
    updateTime: new Date().toISOString(),
  };

  const updateInTree = (perms: Permission[]): boolean => {
    for (let i = 0; i < perms.length; i++) {
      if (perms[i].id === id) {
        perms[i] = updatedPermission;
        return true;
      }
      if (perms[i].children && perms[i].children!.length > 0) {
        if (updateInTree(perms[i].children!)) {
          return true;
        }
      }
    }
    return false;
  };

  updateInTree(permissions);

  return res.json({
    success: true,
    data: updatedPermission,
  });
}

// 删除权限
function deletePermission(req: Request, res: Response) {
  const { id } = req.params;

  const deleteFromTree = (perms: Permission[]): boolean => {
    for (let i = 0; i < perms.length; i++) {
      if (perms[i].id === id) {
        perms.splice(i, 1);
        return true;
      }
      if (perms[i].children && perms[i].children!.length > 0) {
        if (deleteFromTree(perms[i].children!)) {
          return true;
        }
      }
    }
    return false;
  };

  const deleted = deleteFromTree(permissions);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      errorMessage: '权限不存在',
    });
  }

  return res.json({
    success: true,
  });
}

export default {
  'GET /api/permissions': getPermissionList,
  'POST /api/permissions': createPermission,
  'PUT /api/permissions/:id': updatePermission,
  'DELETE /api/permissions/:id': deletePermission,
};

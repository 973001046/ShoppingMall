import dayjs from 'dayjs';
import type { Request, Response } from 'express';

// 权限树数据 - 完整的页面和按钮权限
const permissionTree = [
  {
    id: 'perm_1',
    name: '数据概览',
    code: 'page:dashboard',
    type: 'page' as const,
    description: '数据概览页面访问权限',
    children: [
      { id: 'perm_1_1', name: '查看统计', code: 'dashboard:view', type: 'button' as const, description: '查看数据统计图表' },
      { id: 'perm_1_2', name: '导出报表', code: 'dashboard:export', type: 'button' as const, description: '导出统计报表' },
      { id: 'perm_1_3', name: '刷新数据', code: 'dashboard:refresh', type: 'button' as const, description: '刷新实时数据' },
    ],
  },
  {
    id: 'perm_2',
    name: '用户管理',
    code: 'page:user',
    type: 'page' as const,
    description: '用户管理页面访问权限',
    children: [
      { id: 'perm_2_1', name: '查看用户', code: 'user:view', type: 'button' as const, description: '查看用户列表' },
      { id: 'perm_2_2', name: '新增用户', code: 'user:add', type: 'button' as const, description: '创建新用户' },
      { id: 'perm_2_3', name: '编辑用户', code: 'user:edit', type: 'button' as const, description: '编辑用户信息' },
      { id: 'perm_2_4', name: '删除用户', code: 'user:delete', type: 'button' as const, description: '删除用户账号' },
      { id: 'perm_2_5', name: '重置密码', code: 'user:reset', type: 'button' as const, description: '重置用户密码' },
      { id: 'perm_2_6', name: '导出用户', code: 'user:export', type: 'button' as const, description: '导出用户数据' },
    ],
  },
  {
    id: 'perm_3',
    name: '角色管理',
    code: 'page:role',
    type: 'page' as const,
    description: '角色管理页面访问权限',
    children: [
      { id: 'perm_3_1', name: '查看角色', code: 'role:view', type: 'button' as const, description: '查看角色列表' },
      { id: 'perm_3_2', name: '新增角色', code: 'role:add', type: 'button' as const, description: '创建新角色' },
      { id: 'perm_3_3', name: '编辑角色', code: 'role:edit', type: 'button' as const, description: '编辑角色信息' },
      { id: 'perm_3_4', name: '删除角色', code: 'role:delete', type: 'button' as const, description: '删除角色' },
      { id: 'perm_3_5', name: '配置权限', code: 'role:permission', type: 'button' as const, description: '配置角色权限' },
    ],
  },
  {
    id: 'perm_4',
    name: '订单管理',
    code: 'page:order',
    type: 'page' as const,
    description: '订单管理页面访问权限',
    children: [
      { id: 'perm_4_1', name: '查看订单', code: 'order:view', type: 'button' as const, description: '查看订单列表' },
      { id: 'perm_4_2', name: '新增订单', code: 'order:add', type: 'button' as const, description: '创建新订单' },
      { id: 'perm_4_3', name: '编辑订单', code: 'order:edit', type: 'button' as const, description: '编辑订单信息' },
      { id: 'perm_4_4', name: '删除订单', code: 'order:delete', type: 'button' as const, description: '删除订单' },
      { id: 'perm_4_5', name: '订单审核', code: 'order:audit', type: 'button' as const, description: '审核订单' },
      { id: 'perm_4_6', name: '导出订单', code: 'order:export', type: 'button' as const, description: '导出订单数据' },
    ],
  },
  {
    id: 'perm_5',
    name: '商品管理',
    code: 'page:product',
    type: 'page' as const,
    description: '商品管理页面访问权限',
    children: [
      { id: 'perm_5_1', name: '查看商品', code: 'product:view', type: 'button' as const, description: '查看商品列表' },
      { id: 'perm_5_2', name: '新增商品', code: 'product:add', type: 'button' as const, description: '添加新商品' },
      { id: 'perm_5_3', name: '编辑商品', code: 'product:edit', type: 'button' as const, description: '编辑商品信息' },
      { id: 'perm_5_4', name: '删除商品', code: 'product:delete', type: 'button' as const, description: '删除商品' },
      { id: 'perm_5_5', name: '上下架', code: 'product:status', type: 'button' as const, description: '商品上下架' },
    ],
  },
  {
    id: 'perm_6',
    name: '日志管理',
    code: 'page:log',
    type: 'page' as const,
    description: '日志管理页面访问权限',
    children: [
      { id: 'perm_6_1', name: '查看日志', code: 'log:view', type: 'button' as const, description: '查看操作日志' },
      { id: 'perm_6_2', name: '导出日志', code: 'log:export', type: 'button' as const, description: '导出日志文件' },
      { id: 'perm_6_3', name: '清理日志', code: 'log:clear', type: 'button' as const, description: '清理历史日志' },
    ],
  },
];

// 初始角色数据
let roles = [
  {
    id: '1',
    name: '超级管理员',
    code: 'admin',
    description: '拥有系统所有权限，可进行所有操作',
    status: 1,
    permissions: permissionTree.flatMap((p) => [p.id, ...p.children.map((c) => c.id)]),
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00',
  },
  {
    id: '2',
    name: '管理员',
    code: 'user',
    description: '日常运营管理权限，可管理用户、订单、商品',
    status: 1,
    permissions: [
      'perm_1', 'perm_1_1', 'perm_1_2', 'perm_1_3',
      'perm_2', 'perm_2_1', 'perm_2_2', 'perm_2_3', 'perm_2_6',
      'perm_4', 'perm_4_1', 'perm_4_2', 'perm_4_3', 'perm_4_6',
      'perm_5', 'perm_5_1', 'perm_5_2', 'perm_5_3',
    ],
    createTime: '2024-01-02 00:00:00',
    updateTime: '2024-01-02 00:00:00',
  },
  {
    id: '3',
    name: '运营专员',
    code: 'operator',
    description: '负责订单处理和客户管理',
    status: 1,
    permissions: [
      'perm_1', 'perm_1_1',
      'perm_2', 'perm_2_1',
      'perm_4', 'perm_4_1', 'perm_4_2', 'perm_4_3', 'perm_4_5',
    ],
    createTime: '2024-01-03 00:00:00',
    updateTime: '2024-01-03 00:00:00',
  },
  {
    id: '4',
    name: '内容编辑',
    code: 'editor',
    description: '负责商品信息维护和编辑',
    status: 1,
    permissions: [
      'perm_1', 'perm_1_1',
      'perm_5', 'perm_5_1', 'perm_5_2', 'perm_5_3', 'perm_5_5',
    ],
    createTime: '2024-01-04 00:00:00',
    updateTime: '2024-01-04 00:00:00',
  },
  {
    id: '5',
    name: '财务人员',
    code: 'finance',
    description: '查看财务报表和订单数据，仅查看权限',
    status: 0,
    permissions: [
      'perm_1', 'perm_1_1',
      'perm_4', 'perm_4_1',
    ],
    createTime: '2024-01-05 00:00:00',
    updateTime: '2024-01-05 00:00:00',
  },
];

// 生成唯一ID
let idCounter = 5;
const generateId = () => {
  idCounter += 1;
  return String(idCounter);
};

export default {
  // 获取角色列表
  'GET /api/roles': (req: Request, res: Response) => {
    const {
      current = 1,
      pageSize = 10,
      name,
      code,
      status,
    } = req.query;

    let data = [...roles];

    // 搜索过滤
    if (name) {
      data = data.filter((item) => item.name.includes(name as string));
    }
    if (code) {
      data = data.filter((item) => item.code.includes(code as string));
    }
    if (status !== undefined && status !== '') {
      data = data.filter((item) => item.status === Number(status));
    }

    // 分页
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

  // 获取所有角色（不分页）
  'GET /api/roles/all': (_req: Request, res: Response) => {
    res.json({
      data: roles.map((role) => ({
        id: role.id,
        name: role.name,
        code: role.code,
        status: role.status,
      })),
    });
  },

  // 创建角色
  'POST /api/roles': (req: Request, res: Response) => {
    const { name, code, description, status } = req.body;

    // 检查 code 是否已存在
    if (roles.some((r) => r.code === code)) {
      res.status(400).json({
        success: false,
        message: '角色标识已存在',
      });
      return;
    }

    const newRole = {
      id: generateId(),
      name,
      code,
      description,
      status: status || 1,
      permissions: [],
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    roles.push(newRole);

    res.json({
      success: true,
      data: newRole,
    });
  },

  // 更新角色
  'PUT /api/roles/:id': (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { name, code, description, status } = req.body;

    const roleIndex = roles.findIndex((r) => r.id === id);
    if (roleIndex === -1) {
      res.status(404).json({
        success: false,
        message: '角色不存在',
      });
      return;
    }

    // 检查 code 是否与其他角色冲突
    if (code && code !== roles[roleIndex].code && roles.some((r) => r.code === code)) {
      res.status(400).json({
        success: false,
        message: '角色标识已存在',
      });
      return;
    }

    roles[roleIndex] = {
      ...roles[roleIndex],
      name: name || roles[roleIndex].name,
      code: code || roles[roleIndex].code,
      description: description !== undefined ? description : roles[roleIndex].description,
      status: status !== undefined ? status : roles[roleIndex].status,
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    res.json({
      success: true,
    });
  },

  // 删除角色
  'DELETE /api/roles/:id': (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const roleIndex = roles.findIndex((r) => r.id === id);
    if (roleIndex === -1) {
      res.status(404).json({
        success: false,
        message: '角色不存在',
      });
      return;
    }

    // 检查是否系统预设角色（不能删除）
    if (['1', '2'].includes(id)) {
      res.status(400).json({
        success: false,
        message: '系统预设角色不能删除',
      });
      return;
    }

    roles.splice(roleIndex, 1);

    res.json({
      success: true,
    });
  },

  // 获取所有权限（权限树）
  'GET /api/permissions/all': (_req: Request, res: Response) => {
    res.json(permissionTree);
  },

  // 获取角色权限
  'GET /api/roles/:id/permissions': (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const role = roles.find((r) => r.id === id);
    if (!role) {
      res.status(404).json({
        success: false,
        message: '角色不存在',
      });
      return;
    }

    res.json({
      success: true,
      data: role.permissions || [],
    });
  },

  // 配置角色权限
  'POST /api/roles/:id/permissions': (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { permissionIds } = req.body;

    const roleIndex = roles.findIndex((r) => r.id === id);
    if (roleIndex === -1) {
      res.status(404).json({
        success: false,
        message: '角色不存在',
      });
      return;
    }

    roles[roleIndex].permissions = permissionIds || [];
    roles[roleIndex].updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');

    res.json({
      success: true,
      message: `已为角色「${roles[roleIndex].name}」配置 ${permissionIds?.length || 0} 项权限`,
    });
  },
};

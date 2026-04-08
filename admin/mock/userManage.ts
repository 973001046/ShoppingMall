import dayjs from 'dayjs';
import type { Request, Response } from 'express';

// 生成随机手机号
const randomPhone = (): string => {
  const prefix = ['138', '139', '150', '151', '152', '157', '158', '159', '186', '187', '188'];
  const pre = prefix[Math.floor(Math.random() * prefix.length)];
  const suffix = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, '0');
  return pre + suffix;
};

// 生成随机邮箱
const randomEmail = (username: string): string => {
  const domains = ['gmail.com', 'qq.com', '163.com', 'outlook.com', 'aliyun.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
};

// 生成用户数据
const generateUsers = (count: number = 50): any[] => {
  const roles = ['admin', 'user', 'editor'];
  const users: any[] = [];

  for (let i = 1; i <= count; i++) {
    const username = `user_${String(i).padStart(4, '0')}`;
    const createTime = dayjs()
      .subtract(Math.floor(Math.random() * 365), 'days')
      .format('YYYY-MM-DD HH:mm:ss');
    const lastLoginTime = dayjs()
      .subtract(Math.floor(Math.random() * 30), 'days')
      .format('YYYY-MM-DD HH:mm:ss');

    users.push({
      id: String(i),
      username,
      email: randomEmail(username),
      phone: randomPhone(),
      role: roles[Math.floor(Math.random() * roles.length)],
      status: Math.random() > 0.2 ? 1 : 0, // 80%启用
      createTime,
      lastLoginTime,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    });
  }

  return users;
};

let users = generateUsers(50);

export default {
  // 获取用户列表
  'GET /api/users': (req: Request, res: Response) => {
    const {
      current = 1,
      pageSize = 10,
      username,
      email,
      role,
      status,
      createTime,
      ...rest
    } = req.query;

    let data = [...users];

    // 搜索过滤
    if (username) {
      data = data.filter((item) => item.username.includes(username as string));
    }
    if (email) {
      data = data.filter((item) => item.email.includes(email as string));
    }
    if (role) {
      data = data.filter((item) => item.role === role);
    }
    if (status !== undefined && status !== '') {
      data = data.filter((item) => item.status === Number(status));
    }

    // 时间范围过滤
    if (createTime && Array.isArray(createTime) && createTime.length === 2) {
      const [start, end] = createTime;
      data = data.filter((item) => {
        const time = dayjs(item.createTime);
        return time.isAfter(start as string) && time.isBefore(end as string);
      });
    }

    // 排序
    if (rest.sortField && rest.sortOrder) {
      data.sort((a, b) => {
        const field = rest.sortField as string;
        const order = rest.sortOrder as string;
        if (a[field] < b[field]) return order === 'ascend' ? -1 : 1;
        if (a[field] > b[field]) return order === 'ascend' ? 1 : -1;
        return 0;
      });
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

  // 更新用户角色
  'POST /api/users/role': (req: Request, res: Response) => {
    const { userId, role } = req.body;
    const user = users.find((item) => item.id === userId);
    if (user) {
      user.role = role;
      res.json({
        success: true,
        message: '角色更新成功',
      });
    } else {
      res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }
  },

  // 切换用户状态
  'POST /api/users/status': (req: Request, res: Response) => {
    const { userId, status } = req.body;
    const user = users.find((item) => item.id === userId);
    if (user) {
      user.status = status;
      res.json({
        success: true,
        message: status === 1 ? '用户已启用' : '用户已禁用',
      });
    } else {
      res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }
  },

  // 删除用户
  'DELETE /api/users': (req: Request, res: Response) => {
    const { userId } = req.query;
    const index = users.findIndex((item) => item.id === userId);
    if (index > -1) {
      users.splice(index, 1);
      res.json({
        success: true,
        message: '用户删除成功',
      });
    } else {
      res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }
  },
};

import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Tag,
  Space,
  Popconfirm,
  message,
  Tree,
  Row,
  Col,
  Typography,
} from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyOutlined,
  SettingOutlined,
  AppstoreOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { useState, useRef } from 'react';
import { useRequest } from '@umijs/max';
import type { ActionType } from '@ant-design/pro-components';
import type { DataNode } from 'antd/es/tree';
import {
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
  configRolePermissions,
  getRolePermissions,
} from '@/services/ant-design-pro/role';
import { getPermissionList, type Permission } from '@/services/ant-design-pro/permission';

const { Text } = Typography;

// 角色类型
interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: 1 | 0;
  permissions?: string[];
  createTime?: string;
  updateTime?: string;
}

// 树节点数据类型
interface TreeNode extends DataNode {
  key: string;
  permission: Permission;
  children?: TreeNode[];
}

// 状态选项
const statusOptions = [
  { value: 1, label: '启用', color: 'success' },
  { value: 0, label: '禁用', color: 'error' },
];

// 本地默认权限数据
const defaultPermissions: Permission[] = [
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

const RoleManage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType | undefined>(undefined);

  // 权限配置弹窗状态
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [permissionTreeData, setPermissionTreeData] = useState<TreeNode[]>([]);
  // 默认选中的权限（可选：配置一些基础权限作为默认值）
  // const defaultCheckedKeys: React.Key[] = ['1', '1-1', '1-1-1', '1-1-2', '1-2', '1-2-1'];
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const prevCheckedKeysRef = useRef<React.Key[]>([]);
  const [selectedRoleForPermission, setSelectedRoleForPermission] = useState<Role | null>(null);

  // 创建角色
  const { run: saveRole, loading: saving } = useRequest(
    isEdit ? updateRole : createRole,
    {
      manual: true,
      onSuccess: () => {
        message.success(isEdit ? '编辑成功' : '创建成功');
        setModalVisible(false);
        form.resetFields();
        actionRef.current?.reload();
      },
      onError: () => {
        message.error(isEdit ? '编辑失败' : '创建失败');
      },
    },
  );

  // 删除角色
  const { run: removeRole, loading: deleting } = useRequest(deleteRole, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      actionRef.current?.reload();
    },
  });

  // 获取权限列表
  const { run: fetchPermissionList, loading: permissionLoading } = useRequest(getPermissionList, {
    manual: true,
    onSuccess: (data: any) => {
      const list = (data?.length > 0 ? data : defaultPermissions) as Permission[];
      const tree = buildPermissionTree(list);
      setPermissionTreeData(tree);
    },
    onError: () => {
      const tree = buildPermissionTree(defaultPermissions);
      setPermissionTreeData(tree);
    },
  });

  // 获取角色权限
  const { run: fetchRolePermissions, loading: rolePermissionLoading } = useRequest(getRolePermissions, {
    manual: true,
    onSuccess: (result: any) => {
      const permissions = result || [];
      setCheckedKeys(permissions);
    },
  });

  // 分配权限给角色
  const { run: assignPermissions, loading: assigning } = useRequest(configRolePermissions, {
    manual: true,
    onSuccess: () => {
      message.success('权限配置成功');
      setPermissionModalVisible(false);
      setSelectedRoleForPermission(null);
      setCheckedKeys([]);
      actionRef.current?.reload();
    },
    onError: () => {
      message.error('权限配置失败');
    },
  });

  // 打开权限配置弹窗
  const handleOpenPermissionModal = (role: Role) => {
    setSelectedRoleForPermission(role);
    setPermissionModalVisible(true);
    setCheckedKeys([]);

    // 获取权限列表
    fetchPermissionList();

    // 获取该角色已有的权限
    fetchRolePermissions({ roleId: role.id });
  };

  // 保存权限配置
  const handleSavePermissions = () => {
    if (!selectedRoleForPermission) return;

    // 过滤掉页面，只保留按钮权限（可选：根据需求决定）
    const selectedPermissionIds = checkedKeys.filter((key) => {
      // 查找是否为按钮类型
      const findPermission = (nodes: TreeNode[], targetKey: string): Permission | null => {
        for (const node of nodes) {
          if (node.key === targetKey) {
            return node.permission;
          }
          if (node.children) {
            const found = findPermission(node.children as TreeNode[], targetKey);
            if (found) return found;
          }
        }
        return null;
      };

      const perm = findPermission(permissionTreeData, String(key));
      return perm?.type === 'button' || perm?.type === 'page';
    });

    assignPermissions({
      roleId: selectedRoleForPermission.id,
      permissionIds: selectedPermissionIds as string[],
    });
  };

  // 构建权限树
  const buildPermissionTree = (permissions: Permission[]): TreeNode[] => {
    const map: Record<string, TreeNode> = {};

    // 扁平化所有权限
    const flattenPermissions = (perms: Permission[]): Permission[] => {
      const result: Permission[] = [];
      perms.forEach((perm) => {
        result.push(perm);
        if (perm.children && perm.children.length > 0) {
          result.push(...flattenPermissions(perm.children as Permission[]));
        }
      });
      return result;
    };

    const allPermissions = flattenPermissions(permissions);

    // 创建节点映射
    allPermissions.forEach((permission) => {
      const isPage = permission.type === 'page';
      const isButton = permission.type === 'button';

      map[permission.id] = {
        key: permission.id,
        title: (
          <Space size="small">
            {isPage ? (
              <FolderOutlined style={{ color: '#1890ff' }} />
            ) : (
              <AppstoreOutlined style={{ color: '#52c41a' }} />
            )}
            <span>{permission.name}</span>
            <Tag color={isPage ? 'blue' : 'green'}>{isPage ? '页面' : '按钮'}</Tag>
            {permission.status === 0 && <Tag color="error">禁用</Tag>}
          </Space>
        ),
        permission,
      };
    });

    // 建立父子关系
    const roots: TreeNode[] = [];
    allPermissions.forEach((permission) => {
      const node = map[permission.id];
      if (permission.parentId && map[permission.parentId]) {
        if (!map[permission.parentId].children) {
          map[permission.parentId].children = [];
        }
        map[permission.parentId].children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  // 将权限树扁平化为数组
  const flattenTree = (nodes: TreeNode[]): TreeNode[] => {
    const result: TreeNode[] = [];
    nodes.forEach((node) => {
      result.push(node);
      if (node.children && node.children.length > 0) {
        result.push(...flattenTree(node.children as TreeNode[]));
      }
    });
    return result;
  };

  // 处理勾选变化 - 勾选按钮/页面时自动勾选所有父页面，取消父页面时取消所有子节点
  const onCheck = (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
    // 获取当前勾选的 keys
    let checkedKeysValue: React.Key[];
    if (Array.isArray(checked)) {
      checkedKeysValue = checked;
    } else {
      checkedKeysValue = checked.checked;
    }

    // 创建新的选中列表副本
    let newCheckedKeys = [...checkedKeysValue];

    // 扁平化权限树数据（使用当前渲染的树数据）
    const allTreeNodes = flattenTree(permissionTreeData);

    // 构建父子映射表：子节点ID -> 父节点ID
    const parentMap = new Map<string, string>();
    // 构建子节点映射表：父节点ID -> 所有子孙节点ID列表
    const childrenMap = new Map<string, string[]>();

    const buildMapsFromTree = (nodes: TreeNode[], parentId?: string) => {
      nodes.forEach((node) => {
        const nodeKey = String(node.key);
        if (parentId) {
          parentMap.set(nodeKey, parentId);
          // 为该节点的父节点添加子节点记录
          if (!childrenMap.has(parentId)) {
            childrenMap.set(parentId, []);
          }
          childrenMap.get(parentId)!.push(nodeKey);
        }
        if (node.children && node.children.length > 0) {
          buildMapsFromTree(node.children as TreeNode[], nodeKey);
        }
      });
    };
    buildMapsFromTree(permissionTreeData);

    // 获取一个节点的所有子孙节点（递归）
    const getAllDescendants = (nodeId: string): string[] => {
      const result: string[] = [];
      const children = childrenMap.get(nodeId) || [];
      for (const child of children) {
        result.push(child);
        result.push(...getAllDescendants(child));
      }
      return result;
    };

    // 找出被取消选中的节点（在旧的 checkedKeys 中但不在新的中）
    const uncheckedKeys = prevCheckedKeysRef.current.filter(
      (key) => !newCheckedKeys.some((k) => String(k) === String(key))
    );

    // 对于每个被取消选中的节点，移除其所有子孙节点
    const keysToRemove = new Set<string>();
    for (const key of uncheckedKeys) {
      const node = allTreeNodes.find((n) => String(n.key) === String(key));
      // 如果是页面类型，取消其所有子节点
      if (node?.permission?.type === 'page') {
        const descendants = getAllDescendants(String(key));
        descendants.forEach((descendant) => keysToRemove.add(descendant));
      }
    }

    // 从选中列表中移除被取消的子孙节点
    newCheckedKeys = newCheckedKeys.filter((key) => !keysToRemove.has(String(key)));

    // 对于每个新选中的节点（按钮或页面），向上追溯并添加所有父页面
    const keysToAdd = new Set<string>();

    for (const key of newCheckedKeys) {
      const node = allTreeNodes.find((n) => String(n.key) === String(key));
      // 如果是按钮或页面类型，向上追溯所有父页面
      if (node?.permission?.type === 'button' || node?.permission?.type === 'page') {
        let currentId: string | undefined = String(key);
        while (currentId) {
          const parentId = parentMap.get(currentId);
          if (parentId) {
            // 如果父节点还没有被选中，添加到待添加列表
            if (!newCheckedKeys.some((k) => String(k) === parentId)) {
              keysToAdd.add(parentId);
            }
            currentId = parentId;
          } else {
            break;
          }
        }
      }
    }

    // 将需要添加的父页面合并到选中列表
    keysToAdd.forEach((key) => {
      if (!newCheckedKeys.includes(key)) {
        newCheckedKeys.push(key);
      }
    });

    // 更新之前的选中状态引用
    prevCheckedKeysRef.current = newCheckedKeys;
    setCheckedKeys(newCheckedKeys);
  };

  // 打开新增弹窗
  const handleAdd = () => {
    setIsEdit(false);
    setCurrentRole(null);
    form.resetFields();
    form.setFieldsValue({ status: 1 });
    setModalVisible(true);
  };

  // 打开编辑弹窗
  const handleEdit = (role: Role) => {
    setIsEdit(true);
    setCurrentRole(role);
    form.setFieldsValue({
      id: role.id,
      name: role.name,
      code: role.code,
      description: role.description,
      status: role.status,
    });
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    const values = await form.validateFields();
    saveRole(values);
  };

  // 删除确认
  const handleDelete = (role: Role) => {
    Modal.confirm({
      title: '确定删除该角色吗？',
      content: `删除角色「${role.name}」后，该角色下的用户将失去相关权限。`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        removeRole({ id: role.id });
      },
    });
  };

  // 表格列配置
  const columns: ProColumns<Role>[] = [
    {
      title: '角色ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: Role) => (
        <Space>
          <SafetyOutlined style={{ color: record.status === 1 ? '#1890ff' : '#999' }} />
          <span style={{ fontWeight: 500 }}>{record.name}</span>
          {record.status === 0 && <Tag color="error">已禁用</Tag>}
        </Space>
      ),
    },
    {
      title: '角色标识',
      dataIndex: 'code',
      key: 'code',
      render: (_: any, record: Role) => <Tag color="blue">{record.code}</Tag>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, record: Role) => {
        const option = statusOptions.find((opt) => opt.value === record.status);
        return <Tag color={option?.color}>{option?.label}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      search: false,
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      render: (_: any, record: Role) => (
        <Space>
          <Button type="link" size="small" icon={<SettingOutlined />} onClick={() => handleOpenPermissionModal(record)}>
            权限配置
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(record)} okText="确定" cancelText="取消">
            <Button type="link" danger size="small" icon={<DeleteOutlined />} loading={deleting}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: <FormattedMessage id="pages.roleManage.title" defaultMessage="角色管理" />,
      }}
    >
      <Card bordered={false}>
        <ProTable<Role>
          headerTitle="角色列表"
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增角色
            </Button>,
          ]}
          request={async (params) => {
            const result = await getRoleList(params);
            return {
              data: result.data || [],
              success: true,
              total: result.total || 0,
            };
          }}
          columns={columns}
          pagination={{
            pageSize: 10,
          }}
        />
      </Card>

      {/* 新增/编辑角色弹窗 */}
      <Modal
        title={isEdit ? '编辑角色' : '新增角色'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={saving}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          {isEdit && (
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}

          <Form.Item name="name" label="角色名称" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input placeholder="如：运营专员" />
          </Form.Item>

          <Form.Item
            name="code"
            label="角色标识"
            rules={[
              { required: true, message: '请输入角色标识' },
              { pattern: /^[a-z_]+$/, message: '只能使用小写字母和下划线' },
            ]}
          >
            <Input placeholder="如：operator、content_editor" />
          </Form.Item>

          <Form.Item name="status" label="状态" rules={[{ required: true }]} initialValue={1}>
            <Select placeholder="选择状态">
              {statusOptions.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  <Tag color={opt.color}>{opt.label}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入角色描述和职责说明" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限配置弹窗 */}
      <Modal
        title={selectedRoleForPermission ? `配置权限 - ${selectedRoleForPermission.name}` : '配置权限'}
        open={permissionModalVisible}
        onOk={handleSavePermissions}
        onCancel={() => {
          setPermissionModalVisible(false);
          setSelectedRoleForPermission(null);
          setCheckedKeys([]);
        }}
        confirmLoading={assigning || rolePermissionLoading}
        width={800}
        destroyOnClose
      >
        <Row gutter={24}>
          <Col span={24}>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">
                请勾选该角色拥有的权限。勾选按钮时会自动勾选其父页面，可单独勾选页面而不勾选按钮。
              </Text>
            </div>
            {permissionLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>加载中...</div>
            ) : permissionTreeData.length > 0 ? (
              <Tree
                checkable
                checkStrictly
                defaultExpandAll
                checkedKeys={checkedKeys}
                onCheck={onCheck}
                treeData={permissionTreeData}
                blockNode
                style={{ padding: '8px 0', maxHeight: 500, overflow: 'auto' }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>暂无权限数据</div>
            )}
          </Col>
        </Row>
      </Modal>
    </PageContainer>
  );
};

export default RoleManage;

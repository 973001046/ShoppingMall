import { PageContainer, ProTable } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Tag,
  Space,
  Tree,
  InputNumber,
  Radio,
  Empty,
  Tooltip,
  message,
  Row,
  Col,
  Typography,
  Popconfirm,
  Badge,
} from 'antd';
import type { DataNode } from 'antd/es/tree';
import type { ProColumns } from '@ant-design/pro-components';
import { useState, useCallback, useRef } from 'react';
import { useRequest } from '@umijs/max';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileOutlined,
  AppstoreOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import {
  getPermissionList,
  createPermission,
  updatePermission,
  deletePermission,
  type Permission,
} from '@/services/ant-design-pro/permission';

const { Title, Text } = Typography;

// 树节点数据类型
interface TreeNode extends DataNode {
  key: string;
  permission: Permission;
  children?: TreeNode[];
}

// 本地默认数据 - 包含子页面结构
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

const PermissionManage: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);

  // 弹窗状态
  const [pageModalVisible, setPageModalVisible] = useState(false);
  const [buttonModalVisible, setButtonModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(null);
  const [pageForm] = Form.useForm();
  const [buttonForm] = Form.useForm();

  // 状态选项
  const statusOptions = [
    { value: 1, label: '启用', color: 'success' as const },
    { value: 0, label: '禁用', color: 'error' as const },
  ];

  // 获取权限列表
  const { loading: listLoading } = useRequest(getPermissionList, {
    manual: false,
    onSuccess: (data: any) => {
      const list = (data?.length > 0 ? data : defaultPermissions) as Permission[];
      setAllPermissions(list);
      const tree = buildTree(list);
      console.log('tree', tree);
      setTreeData(tree);
    },
    onError: () => {
      setAllPermissions(defaultPermissions);
      const tree = buildTree(defaultPermissions);
      setTreeData(tree);
      message.info('使用本地演示数据');
    },
  });

  // 构建树形结构 - 只展示page类型，按钮在右侧表格展示
  const buildTree = (permissions: Permission[]): TreeNode[] => {
    const map: Record<string, TreeNode> = {};
    const roots: TreeNode[] = [];

    // 只筛选出page类型的权限
    const pagePermissions = permissions.filter((p) => p.type === 'page');

    // 首先创建所有页面节点的映射
    pagePermissions.forEach((permission) => {
      const hasChildren = permission.children?.some((c) => c.type === 'page');
      map[permission.id] = {
        key: permission.id,
        title: (
          <Space size="small">
            {hasChildren ? <FolderOutlined style={{ color: '#1890ff' }} /> : <FileOutlined style={{ color: '#1890ff' }} />}
            <span>{permission.name}</span>
            {permission.status === 0 && <Badge status="error" text="禁用" />}
          </Space>
        ),
        permission,
        children: hasChildren ? buildTree(permission.children as Permission[]) : [],
      };
    });

    // 然后建立父子关系
    pagePermissions.forEach((permission) => {
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

  // 根据ID查找权限
  const findPermissionById = useCallback(
    (id: string, permissions: Permission[] = allPermissions): Permission | null => {
      for (const perm of permissions) {
        if (perm.id === id) {
          return perm;
        }
        if (perm.children && perm.children.length > 0) {
          const found = findPermissionById(id, perm.children as Permission[]);
          if (found) return found;
        }
      }
      return null;
    },
    [allPermissions],
  );

  // 获取选中页面的按钮列表
  const getButtonList = useCallback((): Permission[] => {
    if (!selectedPermission) return [];
    return (selectedPermission.children || []).filter(
      (child: Permission) => child.type === 'button',
    ) as Permission[];
  }, [selectedPermission]);

  // 树节点选择
  const onSelect = (keys: React.Key[], info: any) => {
    setSelectedKeys(keys);
    if (info.selected && info.node.permission) {
      setSelectedPermission(info.node.permission);
    } else {
      setSelectedPermission(null);
    }
  };

  // 刷新数据
  const refreshData = () => {
    getPermissionList().then((data: any) => {
      const list = (data?.length > 0 ? data : defaultPermissions) as Permission[];
      setAllPermissions(list);
      const tree = buildTree(list);
      setTreeData(tree);
    });
  };

  // 创建权限
  const { run: savePermission, loading: saving } = useRequest(
    isEdit ? updatePermission : createPermission,
    {
      manual: true,
      onSuccess: () => {
        message.success(isEdit ? '更新成功' : '创建成功');
        closeModal();
        refreshData();
      },
      onError: () => {
        message.error(isEdit ? '更新失败' : '创建失败');
      },
    },
  );

  // 删除权限
  const { run: removePermission, loading: deleting } = useRequest(deletePermission, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      refreshData();
      if (currentPermission?.id === selectedPermission?.id) {
        setSelectedPermission(null);
        setSelectedKeys([]);
      }
    },
  });

  // 打开新增页面弹窗
  const handleAddPage = () => {
    setIsEdit(false);
    setCurrentPermission(null);
    pageForm.resetFields();
    pageForm.setFieldsValue({
      type: 'page',
      status: 1,
      parentId: selectedPermission?.type === 'page' ? selectedPermission.id : null,
    });
    setPageModalVisible(true);
  };

  // 打开新增按钮弹窗
  const handleAddButton = () => {
    if (!selectedPermission || selectedPermission.type !== 'page') {
      message.warning('请先选择一个页面');
      return;
    }
    setIsEdit(false);
    setCurrentPermission(null);
    buttonForm.resetFields();
    buttonForm.setFieldsValue({
      type: 'button',
      status: 1,
      parentId: selectedPermission.id,
    });
    setButtonModalVisible(true);
  };

  // 打开编辑页面弹窗
  const handleEditPage = (permission: Permission) => {
    setIsEdit(true);
    setCurrentPermission(permission);
    pageForm.setFieldsValue({
      id: permission.id,
      name: permission.name,
      code: permission.code,
      type: permission.type,
      description: permission.description,
      parentId: permission.parentId,
      sort: permission.sort,
      status: permission.status,
    });
    setPageModalVisible(true);
  };

  // 打开编辑按钮弹窗
  const handleEditButton = (permission: Permission) => {
    setIsEdit(true);
    setCurrentPermission(permission);
    buttonForm.setFieldsValue({
      id: permission.id,
      name: permission.name,
      code: permission.code,
      type: permission.type,
      description: permission.description,
      parentId: permission.parentId,
      sort: permission.sort,
      status: permission.status,
    });
    setButtonModalVisible(true);
  };

  // 关闭弹窗
  const closeModal = () => {
    setPageModalVisible(false);
    setButtonModalVisible(false);
    pageForm.resetFields();
    buttonForm.resetFields();
    setCurrentPermission(null);
  };

  // 提交页面表单
  const handleSubmitPage = async () => {
    const values = await pageForm.validateFields();
    savePermission(values);
  };

  // 提交按钮表单
  const handleSubmitButton = async () => {
    const values = await buttonForm.validateFields();
    savePermission(values);
  };

  // 删除确认
  const handleDelete = (permission: Permission) => {
    Modal.confirm({
      title: '确定删除该权限吗？',
      content:
        permission.type === 'page'
          ? `删除页面「${permission.name}」后，其下的所有子页面和按钮也会被一并删除。`
          : `删除按钮「${permission.name}」。`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        removePermission({ id: permission.id });
      },
    });
  };

  // 按钮表格列配置
  const buttonColumns: ProColumns<Permission>[] = [
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '权限标识',
      dataIndex: 'code',
      key: 'code',
      render: (_, record) => <Tag color="green">{record.code}</Tag>,
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
      width: 100,
      render: (_, record) => {
        const option = statusOptions.find((opt) => opt.value === record.status);
        return <Tag color={option?.color}>{option?.label}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 230,
      render: (_, record) => (
        <Space>
          <Tooltip title="复制权限标识">
            <Button
              type="link"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => {
                navigator.clipboard.writeText(record.code);
                message.success(`已复制: ${record.code}`);
              }}
            >
              复制
            </Button>
          </Tooltip>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditButton(record)}>
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
        title: '权限管理',
        subTitle: '配置系统页面路由和按钮权限',
      }}
    >
      <Row gutter={24}>
        {/* 左侧树形结构 - 展示所有页面层级关系 */}
        <Col span={8}>
          <Card
            title={
              <Space>
                <span>权限树</span>
                <Tooltip title="展示页面层级关系">
                  <Badge count="page" style={{ backgroundColor: '#1890ff', fontSize: 10 }} />
                </Tooltip>
              </Space>
            }
            bordered={false}
            extra={
              <Space>
                <Tooltip title="新增一级页面">
                  <Button type="primary" icon={<PlusOutlined />} size="small" onClick={handleAddPage}>
                    页面
                  </Button>
                </Tooltip>
              </Space>
            }
          >
            {listLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>加载中...</div>
            ) : treeData.length > 0 ? (
              <Tree
                showLine={{ showLeafIcon: false }}
                showIcon={false}
                defaultExpandAll
                selectedKeys={selectedKeys}
                onSelect={onSelect}
                treeData={treeData}
                blockNode
                style={{ padding: '8px 0' }}
              />
            ) : (
              <Empty description="暂无权限数据" />
            )}
          </Card>
        </Col>

        {/* 右侧详情面板 */}
        <Col span={16}>
          {selectedPermission ? (
            <>
              {/* 页面信息卡片 */}
              <Card
                bordered={false}
                title={
                  <Space>
                    {selectedPermission.children?.some((c) => c.type === 'page') ? (
                      <FolderOpenOutlined style={{ color: '#1890ff', fontSize: 18 }} />
                    ) : (
                      <FileOutlined style={{ color: '#1890ff', fontSize: 18 }} />
                    )}
                    {selectedPermission.parentId && <Tag color="blue">子页面</Tag>}
                  </Space>
                }
                extra={
                  <Space>
                    <Button icon={<PlusOutlined />} onClick={handleAddPage}>
                      新增{selectedPermission.parentId ? '同级' : '子'}页面
                    </Button>
                    <Button icon={<EditOutlined />} onClick={() => handleEditPage(selectedPermission)}>
                      编辑
                    </Button>
                    <Popconfirm
                      title="确定删除该页面吗？"
                      description="删除后其下的所有子页面和权限配置也会被删除"
                      onConfirm={() => handleDelete(selectedPermission)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button danger icon={<DeleteOutlined />} loading={deleting}>
                        删除
                      </Button>
                    </Popconfirm>
                  </Space>
                }
              >
                <Row gutter={24} style={{ marginBottom: 24 }}>
                  <Col span={8}>
                    <Text type="secondary">页面名称</Text>
                    <div style={{ marginTop: 4, fontSize: 16, fontWeight: 500 }}>
                      {selectedPermission.name}
                    </div>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary">状态</Text>
                    <div style={{ marginTop: 4 }}>
                      <Tag color={selectedPermission.status === 1 ? 'success' : 'error'}>
                        {selectedPermission.status === 1 ? '启用' : '禁用'}
                      </Tag>
                    </div>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary">排序</Text>
                    <div style={{ marginTop: 4, fontSize: 16 }}>{selectedPermission.sort || 0}</div>
                  </Col>
                </Row>
                <Row gutter={24} style={{ marginBottom: 24 }}>
                  <Col span={8}>
                    <Text type="secondary">权限标识</Text>
                    <div style={{ marginTop: 4 }}>
                      <Tag color="blue">{selectedPermission.code}</Tag>
                    </div>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary">层级</Text>
                    <div style={{ marginTop: 4, fontSize: 14 }}>
                      {selectedPermission.parentId ? (
                        <Tag color="blue">子页面</Tag>
                      ) : (
                        <Tag color="purple">一级页面</Tag>
                      )}
                    </div>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary">页面ID</Text>
                    <div style={{ marginTop: 4, fontSize: 14, color: '#999' }}>
                      {selectedPermission.id}
                    </div>
                  </Col>
                </Row>
                <div>
                  <Text type="secondary">描述</Text>
                  <div style={{ marginTop: 4, fontSize: 14 }}>
                    {selectedPermission.description || '暂无描述'}
                  </div>
                </div>
              </Card>

              {/* 按钮权限表格 */}
              <Card bordered={false} style={{ marginTop: 24 }}>
                <ProTable<Permission>
                  headerTitle={
                    <Space>
                      <span>权限列表</span>
                      <Tag color="blue">{getButtonList().length}</Tag>
                    </Space>
                  }
                  toolBarRender={() => [
                    <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAddButton}>
                      新增权限
                    </Button>,
                  ]}
                  actionRef={actionRef}
                  rowKey="id"
                  search={false}
                  options={false}
                  pagination={false}
                  dataSource={getButtonList()}
                  columns={buttonColumns}
                  locale={{
                    emptyText: (
                      <Empty description="暂无权限" image={Empty.PRESENTED_IMAGE_SIMPLE}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddButton}>
                          新增权限
                        </Button>
                      </Empty>
                    ),
                  }}
                />
              </Card>
            </>
          ) : (
            <Card bordered={false}>
              <Empty description="请选择左侧权限树中的页面查看详情" image={Empty.PRESENTED_IMAGE_DEFAULT} />
            </Card>
          )}
        </Col>
      </Row>

      {/* 新增/编辑页面弹窗 */}
      <Modal
        title={isEdit ? '编辑页面' : '新增页面'}
        open={pageModalVisible}
        onOk={handleSubmitPage}
        onCancel={closeModal}
        confirmLoading={saving}
        width={600}
        destroyOnClose
      >
        <Form form={pageForm} layout="vertical" preserve={false}>
          {isEdit && (
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item name="type" initialValue="page" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="parentId" hidden>
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="页面名称" rules={[{ required: true, message: '请输入页面名称' }]}>
                <Input placeholder="如：用户管理" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="路由标识"
                rules={[
                  { required: true, message: '请输入路由标识' },
                  { pattern: /^[a-z0-9_-]+$/, message: '只能使用小写字母、数字、下划线和横线' },
                ]}
              >
                <Input placeholder="如：user-manage" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入页面描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="sort" label="排序" initialValue={0}>
                <InputNumber min={0} max={999} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" initialValue={1}>
                <Radio.Group>
                  <Radio.Button value={1}>启用</Radio.Button>
                  <Radio.Button value={0}>禁用</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 新增/编辑按钮弹窗 */}
      <Modal
        title={isEdit ? '编辑按钮' : '新增按钮'}
        open={buttonModalVisible}
        onOk={handleSubmitButton}
        onCancel={closeModal}
        confirmLoading={saving}
        width={600}
        destroyOnClose
      >
        <Form form={buttonForm} layout="vertical" preserve={false}>
          {isEdit && (
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item name="type" initialValue="button" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="parentId" hidden>
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="按钮名称" rules={[{ required: true, message: '请输入按钮名称' }]}>
                <Input placeholder="如：新增按钮" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="权限标识"
                rules={[
                  { required: true, message: '请输入权限标识' },
                  { pattern: /^[a-z0-9_:]+$/, message: '只能使用小写字母、数字、下划线和冒号' },
                ]}
              >
                <Input placeholder="如：user:add" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入按钮描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="sort" label="排序" initialValue={0}>
                <InputNumber min={0} max={999} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" initialValue={1}>
                <Radio.Group>
                  <Radio.Button value={1}>启用</Radio.Button>
                  <Radio.Button value={0}>禁用</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default PermissionManage;

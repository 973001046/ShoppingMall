import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRequest, FormattedMessage, history } from '@umijs/max';
import { Button, Input, Select, Space, Tag, message, Popconfirm } from 'antd';
import { useRef, useState, useEffect } from 'react';
import type { Dayjs } from 'dayjs';
import { DatePicker } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import {
  getUserList,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} from '@/services/ant-design-pro/userManage';
import type { UserItem, UserParams } from '@/services/ant-design-pro/userManage';
import { getAllRoles, type Role } from '@/services/ant-design-pro/role';
import EditUserModal from './components/EditUserModal';
import { getRoleConfig, getRoleValueEnum } from './config/roles';

const { RangePicker } = DatePicker;

const UserManage: React.FC = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRows, setSelectedRows] = useState<UserItem[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserItem | null>(null);
  const [roleList, setRoleList] = useState<Role[]>([]);

  // 获取角色列表
  const { loading: loadingRoles } = useRequest(getAllRoles, {
    onSuccess: (data: unknown) => {
      setRoleList((data as Role[]) || []);
    },
  });

  const { run: updateRole, loading: updateRoleLoading } = useRequest(updateUserRole, {
    manual: true,
    onSuccess: () => {
      messageApi.success('角色更新成功');
      setEditModalVisible(false);
      actionRef.current?.reload();
    },
    onError: () => {
      messageApi.error('角色更新失败');
    },
  });

  const { run: toggleStatus, loading: toggleStatusLoading } = useRequest(toggleUserStatus, {
    manual: true,
    onSuccess: () => {
      messageApi.success('状态更新成功');
      setEditModalVisible(false);
      actionRef.current?.reload();
    },
    onError: () => {
      messageApi.error('状态更新失败');
    },
  });

  const { run: removeUser } = useRequest(deleteUser, {
    manual: true,
    onSuccess: () => {
      messageApi.success('删除成功');
      actionRef.current?.reload();
    },
    onError: () => {
      messageApi.error('删除失败');
    },
  });

  const handleEdit = (user: UserItem) => {
    setCurrentUser(user);
    setEditModalVisible(true);
  };

  const handleModalOk = async (values: { role: string; status: number }) => {
    if (!currentUser) return;

    // 如果角色变化，更新角色
    if (values.role !== currentUser.role) {
      await updateRole({ userId: currentUser.id, role: values.role });
    }

    // 如果状态变化，更新状态
    if (values.status !== currentUser.status) {
      await toggleStatus({ userId: currentUser.id, status: values.status });
    }

    // 如果都没变化，直接关闭弹窗
    if (values.role === currentUser.role && values.status === currentUser.status) {
      setEditModalVisible(false);
    }
  };

  const handleModalCancel = () => {
    setEditModalVisible(false);
    setCurrentUser(null);
  };

  const columns: ProColumns<UserItem>[] = [
    {
      title: <FormattedMessage id="pages.userManage.userId" defaultMessage="用户ID" />,
      dataIndex: 'id',
      search: false,
      width: 100,
    },
    {
      title: <FormattedMessage id="pages.userManage.username" defaultMessage="用户名" />,
      dataIndex: 'username',
      render: (dom, entity) => (
        <Space>
          {dom}
          {entity.status === 0 && (
            <Tag color="red">
              <FormattedMessage id="pages.userManage.disabled" defaultMessage="已禁用" />
            </Tag>
          )}
        </Space>
      ),
    },
    // {
    //   title: <FormattedMessage id="pages.userManage.email" defaultMessage="邮箱" />,
    //   dataIndex: 'email',
    //   search: false,
    // },
    {
      title: <FormattedMessage id="pages.userManage.phone" defaultMessage="手机号" />,
      dataIndex: 'phone',
      search: false,
    },
    {
      title: <FormattedMessage id="pages.userManage.role" defaultMessage="角色" />,
      dataIndex: 'role',
      valueType: 'select',
      valueEnum: roleList.reduce((acc, role) => {
        acc[role.code] = { text: role.name, status: role.status === 1 ? 'Success' : 'Error' };
        return acc;
      }, {} as Record<string, { text: string; status: string }>),
      render: (_, record) => {
        const role = roleList.find((r) => r.code === record.role);
        if (role) {
          return <Tag color={role.status === 1 ? 'blue' : 'default'}>{role.name}</Tag>;
        }
        // 如果找不到角色配置，使用本地默认配置
        const config = getRoleConfig(record.role);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: <FormattedMessage id="pages.userManage.createTime" defaultMessage="创建时间" />,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
      sorter: true,
    },
    {
      title: <FormattedMessage id="pages.userManage.lastLoginTime" defaultMessage="最后登录" />,
      dataIndex: 'lastLoginTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: <FormattedMessage id="pages.userManage.action" defaultMessage="操作" />,
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="edit"
          type="primary"
          size="small"
          onClick={() => handleEdit(record)}
        >
          <FormattedMessage id="pages.userManage.edit" defaultMessage="编辑" />
        </Button>,
        <Popconfirm
          key="delete"
          title={<FormattedMessage id="pages.userManage.deleteConfirm" defaultMessage="确定要删除该用户吗？" />}
          onConfirm={() => removeUser({ userId: record.id })}
        >
          <Button type="link" danger size="small">
            <FormattedMessage id="pages.userManage.delete" defaultMessage="删除" />
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<UserItem, UserParams>
        headerTitle={<FormattedMessage id="pages.userManage.title" defaultMessage="用户管理" />}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="role-manage"
            icon={<SettingOutlined />}
            onClick={() => history.push('/role-manage')}
          >
            <FormattedMessage id="pages.userManage.roleConfig" defaultMessage="权限配置" />
          </Button>,
          <Button key="export" type="primary">
            <FormattedMessage id="pages.userManage.export" defaultMessage="导出用户" />
          </Button>,
        ]}
        request={async (params) => {
          const res = await getUserList(params);
          return {
            data: res.data,
            success: res.success,
            total: res.total,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
      />

      <EditUserModal
        visible={editModalVisible}
        user={currentUser}
        roleList={roleList}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        loading={updateRoleLoading || toggleStatusLoading}
      />
    </PageContainer>
  );
};

export default UserManage;

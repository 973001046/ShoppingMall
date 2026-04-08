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
} from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { useState, useRef } from 'react';
import { useRequest } from '@umijs/max';
import type { ActionType } from '@ant-design/pro-components';
import {
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
} from '@/services/ant-design-pro/role';

// 角色类型
interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: 1 | 0;
  permissions: string[];
  createTime?: string;
  updateTime?: string;
}

// 状态选项
const statusOptions = [
  { value: 1, label: '启用', color: 'success' },
  { value: 0, label: '禁用', color: 'error' },
];

const RoleManage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType | undefined>(undefined);

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
      width: 180,
      render: (_: any, record: Role) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
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

          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
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

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true }]}
            initialValue={1}
          >
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
    </PageContainer>
  );
};

export default RoleManage;

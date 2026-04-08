import { FormattedMessage } from '@umijs/max';
import { Modal, Form, Select, Radio, Space, Tag } from 'antd';
import type { UserItem } from '@/services/ant-design-pro/userManage';
import { getRoleConfig, getRoleOptions } from '../config/roles';

const { Option } = Select;

interface EditUserModalProps {
  visible: boolean;
  user: UserItem | null;
  onCancel: () => void;
  onOk: (values: { role: string; status: number }) => void;
  loading?: boolean;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  visible,
  user,
  onCancel,
  onOk,
  loading,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    onOk(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // 当 user 变化时，重置表单值
  if (user && visible) {
    form.setFieldsValue({
      role: user.role,
      status: user.status,
    });
  }

  const roleOptions = getRoleOptions();

  return (
    <Modal
      title={<FormattedMessage id="pages.userManage.editUser" defaultMessage="编辑用户" />}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={500}
    >
      {user && (
        <div style={{ marginBottom: 24 }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div>
              <strong>用户名：</strong>
              {user.username}
              <Tag color={getRoleConfig(user.role).color} style={{ marginLeft: 8 }}>
                {getRoleConfig(user.role).text}
              </Tag>
              {user.status === 0 && (
                <Tag color="red">
                  <FormattedMessage id="pages.userManage.disabled" defaultMessage="已禁用" />
                </Tag>
              )}
            </div>
            <div>
              <strong>用户ID：</strong>
              {user.id}
            </div>
            <div>
              <strong>邮箱：</strong>
              {user.email}
            </div>
            <div>
              <strong>手机号：</strong>
              {user.phone}
            </div>
          </Space>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          role: user?.role,
          status: user?.status,
        }}
      >
        <Form.Item
          label={<FormattedMessage id="pages.userManage.role" defaultMessage="角色" />}
          name="role"
          rules={[{ required: true, message: '请选择角色' }]}
        >
          <Select placeholder="请选择角色">
            {roleOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                <Tag color={option.color}>{option.label}</Tag>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={<FormattedMessage id="pages.userManage.status" defaultMessage="状态" />}
          name="status"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Radio.Group>
            <Radio.Button value={1}>
              <FormattedMessage id="pages.userManage.enabled" defaultMessage="启用" />
            </Radio.Button>
            <Radio.Button value={0}>
              <FormattedMessage id="pages.userManage.disabled" defaultMessage="禁用" />
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;

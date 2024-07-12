import React from 'react';
import { Form, Input, Button, Select } from 'antd';

const { Option } = Select;

const OrderForm = ({ initialValues, onSubmit }) => {
  return (
    <Form
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item
        name="orderNumber"
        label="Order Number"
        rules={[{ required: true, message: 'Please input the order number!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="customerFirstName"
        label="Customer First Name"
        rules={[{ required: true, message: 'Please input the customer first name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="customerLastName"
        label="Customer Last Name"
        rules={[{ required: true, message: 'Please input the customer last name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="totalPrice"
        label="Total Price"
        rules={[{ required: true, message: 'Please input the total price!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select the order status!' }]}
      >
        <Select>
          <Option value="Yeni">Yeni</Option>
          <Option value="Hazırlanıyor">Hazırlanıyor</Option>
          <Option value="Kargoda">Kargoda</Option>
          <Option value="Teslim Edildi">Teslim Edildi</Option>
          <Option value="Teslim Problemi">Teslim Problemi</Option>
          <Option value="İptal">İptal</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? 'Update Order' : 'Add Order'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OrderForm;

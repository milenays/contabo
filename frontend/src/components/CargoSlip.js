import React, { useEffect, useRef } from 'react';
import { Typography, Divider, Row, Col, Table } from 'antd';
import JsBarcode from 'jsbarcode';
import { GiftOutlined, TruckOutlined } from '@ant-design/icons';
import '../styles/CargoSlip.css';

const { Title, Text } = Typography;

const CargoSlip = React.forwardRef(({ order }, ref) => {
  const barcodeRef = useRef();

  useEffect(() => {
    if (order && order.cargoBarcode && barcodeRef.current) {
      JsBarcode(barcodeRef.current, order.cargoBarcode, {
        format: 'CODE128',
        width: 2,
        height: 100,
        displayValue: false,
        fontSize: 20,
      });
    }
  }, [order]);

  const columns = [
    {
      title: 'Ürün Adı',
      dataIndex: 'productName',
      key: 'productName',
      width: '60%',
    },
    {
      title: 'Adet',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '20%',
      render: (quantity) => <Text strong>{quantity}</Text>,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: '20%',
    },
  ];

  return (
    <div ref={ref} className="cargo-slip">
      <div className="header">
        <div className="logo">Stockie</div>
        <div className="order-info">
          <Text strong>Sipariş No: {order.orderNumber}</Text>
          <Text>{order.platformName}</Text>
        </div>
      </div>
      
      <Divider style={{ margin: '10px 0' }} />
      
      <Row gutter={16}>
        <Col span={12}>
          <div className="info-section customer-info">
            <Title level={5}><GiftOutlined /> Alıcı Bilgileri</Title>
            <Text strong>{`${order.customerFirstName} ${order.customerLastName}`}</Text>
            <Text>{order.shipmentAddress}</Text>
            <Text>{`${order.shipmentDistrict}, ${order.shipmentCity}`}</Text>
            <Text>{order.phoneNumber}</Text>
          </div>
        </Col>
        <Col span={12}>
          <div className="info-section sender-info">
            <Title level={5}><TruckOutlined /> Gönderici Bilgileri</Title>
            <Text strong>Stockie Lojistik Merkezi</Text>
            <Text>123 Depo Sokak, Sanayi Mahallesi</Text>
            <Text>34000, İstanbul</Text>
            <Text>0212 123 4567</Text>
          </div>
        </Col>
      </Row>

      <div className="barcode-section">
        <svg ref={barcodeRef} />
        <Text strong>{order.cargoBarcode}</Text>
      </div>

      <div className="product-section">
        <Title level={5}>Ürün Listesi</Title>
        <Table 
          dataSource={order.lines} 
          columns={columns} 
          pagination={false}
          rowKey="id"
          size="small"
          bordered
        />
      </div>

      <div className="footer">
        <Text strong>Kargo Firması: {order.cargoCompany}</Text>
        <Text>Toplam Paket Sayısı: 1</Text>
      </div>
      
      <div className="fun-message">
        <Text italic>Bu pakette mutluluk var! Lütfen dikkatli taşıyın 😊</Text>
      </div>
    </div>
  );
});

export default CargoSlip;
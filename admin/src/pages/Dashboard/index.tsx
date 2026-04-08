import { PageContainer, StatisticCard } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Col, Row, Card, DatePicker, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import {
  getUserRegistrationStats,
  getOrderAmountStats,
  getOrderCountStats,
  getTopSellingProducts,
} from '@/services/ant-design-pro/dashboard';
import type { ECharts } from 'echarts';
import type {
  UserRegistrationStats,
  OrderAmountStats,
  OrderCountStats,
  ProductSalesStats,
} from '@/services/ant-design-pro/dashboard';

const { RangePicker } = DatePicker;

const Dashboard: React.FC = () => {
  const userChartRef = useRef<HTMLDivElement>(null);
  const orderAmountChartRef = useRef<HTMLDivElement>(null);
  const orderCountChartRef = useRef<HTMLDivElement>(null);
  const productChartRef = useRef<HTMLDivElement>(null);

  const userChartInstance = useRef<ECharts | null>(null);
  const orderAmountChartInstance = useRef<ECharts | null>(null);
  const orderCountChartInstance = useRef<ECharts | null>(null);
  const productChartInstance = useRef<ECharts | null>(null);

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);

  const { data: userStatsRes } = useRequest(async () => {
    return getUserRegistrationStats({
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
    });
  }, { refreshDeps: [dateRange] });

  const { data: orderAmountRes } = useRequest(async () => {
    return getOrderAmountStats({
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
    });
  }, { refreshDeps: [dateRange] });

  const { data: orderCountRes } = useRequest(async () => {
    return getOrderCountStats({
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
    });
  }, { refreshDeps: [dateRange] });

  const { data: productStatsRes } = useRequest(async () => {
    return getTopSellingProducts({
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
      limit: 10,
    });
  }, { refreshDeps: [dateRange] });

  const userStats: UserRegistrationStats[] = (userStatsRes as any) || [];
  const orderAmountStats: OrderAmountStats[] = (orderAmountRes as any) || [];
  const orderCountStats: OrderCountStats[] = (orderCountRes as any) || [];
  const productStats: ProductSalesStats[] = (productStatsRes as any) || [];

  // 初始化图表
  useEffect(() => {
    if (userChartRef.current && !userChartInstance.current) {
      userChartInstance.current = echarts.init(userChartRef.current);
    }
    if (orderAmountChartRef.current && !orderAmountChartInstance.current) {
      orderAmountChartInstance.current = echarts.init(orderAmountChartRef.current);
    }
    if (orderCountChartRef.current && !orderCountChartInstance.current) {
      orderCountChartInstance.current = echarts.init(orderCountChartRef.current);
    }
    if (productChartRef.current && !productChartInstance.current) {
      productChartInstance.current = echarts.init(productChartRef.current);
    }

    return () => {
      userChartInstance.current?.dispose();
      orderAmountChartInstance.current?.dispose();
      orderCountChartInstance.current?.dispose();
      productChartInstance.current?.dispose();
      userChartInstance.current = null;
      orderAmountChartInstance.current = null;
      orderCountChartInstance.current = null;
      productChartInstance.current = null;
    };
  }, []);

  // 更新用户注册趋势图
  useEffect(() => {
    if (userChartInstance.current && userStats.length > 0) {
      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: userStats.map((item) => item.date),
          axisLabel: {
            rotate: 45,
            formatter: (value: string) => value.slice(5),
          },
        },
        yAxis: {
          type: 'value',
          name: '注册用户数',
        },
        series: [
          {
            name: '新注册用户',
            type: 'line',
            smooth: true,
            data: userStats.map((item) => item.count),
            itemStyle: { color: '#1890ff' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(24,144,255,0.3)' },
                { offset: 1, color: 'rgba(24,144,255,0.05)' },
              ]),
            },
          },
        ],
      };
      userChartInstance.current.setOption(option);
    }
  }, [userStats]);

  // 更新订单金额趋势图
  useEffect(() => {
    if (orderAmountChartInstance.current && orderAmountStats.length > 0) {
      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: any) => {
            const data = params[0];
            return `${data.name}<br/>订单金额: ¥${data.value.toLocaleString()}`;
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: orderAmountStats.map((item) => item.date),
          axisLabel: {
            rotate: 45,
            formatter: (value: string) => value.slice(5),
          },
        },
        yAxis: {
          type: 'value',
          name: '订单金额(元)',
          axisLabel: {
            formatter: (value: number) => `¥${value.toLocaleString()}`,
          },
        },
        series: [
          {
            name: '订单金额',
            type: 'line',
            smooth: true,
            data: orderAmountStats.map((item) => item.amount),
            itemStyle: { color: '#52c41a' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(82,196,26,0.3)' },
                { offset: 1, color: 'rgba(82,196,26,0.05)' },
              ]),
            },
          },
        ],
      };
      orderAmountChartInstance.current.setOption(option);
    }
  }, [orderAmountStats]);

  // 更新订单数量趋势图
  useEffect(() => {
    if (orderCountChartInstance.current && orderCountStats.length > 0) {
      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: orderCountStats.map((item) => item.date),
          axisLabel: {
            rotate: 45,
            formatter: (value: string) => value.slice(5),
          },
        },
        yAxis: {
          type: 'value',
          name: '订单数量',
        },
        series: [
          {
            name: '订单数量',
            type: 'line',
            smooth: true,
            data: orderCountStats.map((item) => item.count),
            itemStyle: { color: '#faad14' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(250,173,20,0.3)' },
                { offset: 1, color: 'rgba(250,173,20,0.05)' },
              ]),
            },
          },
        ],
      };
      orderCountChartInstance.current.setOption(option);
    }
  }, [orderCountStats]);

  // 更新商品销量图
  useEffect(() => {
    if (productChartInstance.current && productStats.length > 0) {
      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: productStats.map((item) => item.name),
          axisLabel: {
            rotate: 30,
            interval: 0,
            fontSize: 10,
          },
        },
        yAxis: {
          type: 'value',
          name: '销售数量',
        },
        series: [
          {
            name: '销售数量',
            type: 'bar',
            data: productStats.map((item) => item.count),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#722ed1' },
                { offset: 1, color: '#b37feb' },
              ]),
              borderRadius: [4, 4, 0, 0],
            },
          },
        ],
      };
      productChartInstance.current.setOption(option);
    }
  }, [productStats]);

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      userChartInstance.current?.resize();
      orderAmountChartInstance.current?.resize();
      orderCountChartInstance.current?.resize();
      productChartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalUsers = userStats.reduce((sum, item) => sum + item.count, 0);
  const totalAmount = orderAmountStats.reduce((sum, item) => sum + item.amount, 0);
  const totalOrders = orderCountStats.reduce((sum, item) => sum + item.count, 0);

  return (
    <PageContainer
      header={{
        title: '数据概览',
        extra: (
          <Space>
            <span>时间范围：</span>
            <RangePicker
              value={dateRange}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([dates[0], dates[1]]);
                }
              }}
              disabledDate={(current) => current && current > dayjs().endOf('day')}
            />
          </Space>
        ),
      }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <StatisticCard
            statistic={{
              title: '新增用户',
              value: totalUsers,
              suffix: '人',
            }}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatisticCard
            statistic={{
              title: '订单总额',
              value: totalAmount.toFixed(2),
              suffix: '元',
            }}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatisticCard
            statistic={{
              title: '订单总数',
              value: totalOrders,
              suffix: '单',
            }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="用户注册趋势" bordered={false}>
            <div ref={userChartRef} style={{ width: '100%', height: 350 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="订单金额趋势" bordered={false}>
            <div ref={orderAmountChartRef} style={{ width: '100%', height: 350 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="订单数量趋势" bordered={false}>
            <div ref={orderCountChartRef} style={{ width: '100%', height: 350 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="热销商品 TOP10" bordered={false}>
            <div ref={productChartRef} style={{ width: '100%', height: 350 }} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Dashboard;

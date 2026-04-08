import { request } from '@umijs/max';

export interface UserRegistrationStats {
  date: string;
  count: number;
}

export interface OrderAmountStats {
  date: string;
  amount: number;
}

export interface OrderCountStats {
  date: string;
  count: number;
}

export interface ProductSalesStats {
  id: string;
  name: string;
  count: number;
}

export interface StatsParams {
  startDate: string;
  endDate: string;
  limit?: number;
}

/** 获取用户注册统计数据 */
export async function getUserRegistrationStats(
  params: Omit<StatsParams, 'limit'>,
  options?: { [key: string]: any },
) {
  return request<{ data: UserRegistrationStats[] }>('/api/dashboard/user-registration', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 获取订单金额统计数据 */
export async function getOrderAmountStats(
  params: Omit<StatsParams, 'limit'>,
  options?: { [key: string]: any },
) {
  return request<{ data: OrderAmountStats[] }>('/api/dashboard/order-amount', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 获取订单数量统计数据 */
export async function getOrderCountStats(
  params: Omit<StatsParams, 'limit'>,
  options?: { [key: string]: any },
) {
  return request<{ data: OrderCountStats[] }>('/api/dashboard/order-count', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 获取热销商品TOP10 */
export async function getTopSellingProducts(
  params: StatsParams,
  options?: { [key: string]: any },
) {
  return request<{ data: ProductSalesStats[] }>('/api/dashboard/top-products', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

import { request } from '@umijs/max';

export interface UserRegistrationStats {
  date: string;
  count: number;
}

export interface OrderStats {
  date: string;
  amount: number;
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
  return request<UserRegistrationStats[]>('/api/dashboard/user-registration', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 获取订单统计数据 */
export async function getOrderStats(
  params: Omit<StatsParams, 'limit'>,
  options?: { [key: string]: any },
) {
  return request<OrderStats[]>('/api/dashboard/order-stats', {
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
  return request<ProductSalesStats[]>('/api/dashboard/top-products', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

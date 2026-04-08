import dayjs from 'dayjs';

// 生成最近30天的日期
const generateDates = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  let current = dayjs(startDate);
  const end = dayjs(endDate);

  while (current.isBefore(end) || current.isSame(end, 'day')) {
    dates.push(current.format('YYYY-MM-DD'));
    current = current.add(1, 'day');
  }

  return dates;
};

// 生成随机数
const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 模拟商品名称
const productNames = [
  'iPhone 15 Pro',
  'MacBook Air M3',
  'AirPods Pro 2',
  'iPad Air',
  '华为 Mate 60',
  '小米14',
  '索尼 WH-1000XM5',
  'Switch 游戏机',
  '罗技 MX Master 3',
  'Kindle Paperwhite',
  '戴森吹风机',
  '小米空气净化器',
  '美的电饭煲',
  '飞利浦电动牙刷',
  'SK-II 神仙水',
];

export default {
  'GET /api/dashboard/user-registration': (req: any, res: any) => {
    const { startDate, endDate } = req.query || {};
    const dates = generateDates(startDate || dayjs().subtract(30, 'day').format('YYYY-MM-DD'), endDate || dayjs().format('YYYY-MM-DD'));

    const data = dates.map((date) => ({
      date,
      count: random(50, 500),
    }));

    res.json({ data });
  },

  // 订单金额统计（独立接口）
  'GET /api/dashboard/order-amount': (req: any, res: any) => {
    const { startDate, endDate } = req.query || {};
    const dates = generateDates(startDate || dayjs().subtract(30, 'day').format('YYYY-MM-DD'), endDate || dayjs().format('YYYY-MM-DD'));

    const data = dates.map((date) => ({
      date,
      amount: random(5000, 50000),
    }));

    res.json({ data });
  },

  // 订单数量统计（独立接口）
  'GET /api/dashboard/order-count': (req: any, res: any) => {
    const { startDate, endDate } = req.query || {};
    const dates = generateDates(startDate || dayjs().subtract(30, 'day').format('YYYY-MM-DD'), endDate || dayjs().format('YYYY-MM-DD'));

    const data = dates.map((date) => ({
      date,
      count: random(100, 800),
    }));

    res.json({ data });
  },

  'GET /api/dashboard/top-products': (req: any, res: any) => {
    const { limit = 10 } = req.query || {};
    const count = parseInt(limit, 10) || 10;

    // 随机选择商品并生成销量
    const shuffled = [...productNames].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    const data = selected.map((name, index) => ({
      id: `prod_${index + 1}`,
      name,
      count: random(100, 1000),
    }));

    // 按销量排序
    data.sort((a, b) => b.count - a.count);

    res.json({ data });
  },
};

#!/usr/bin/env node

/**
 * DDL 命令行工具
 * 提供数据库迁移、种子数据、同步等功能
 */

const { Command } = require('commander');
const chalk = require('chalk');
const migrationManager = require('./lib/migration');
const creator = require('./lib/creator');
const connectionManager = require('./lib/connection');

const program = new Command();

program
  .name('ddl')
  .description('数据库DDL管理工具')
  .version('1.0.0');

// 创建数据库
program
  .command('create')
  .description('创建数据库')
  .action(async () => {
    try {
      console.log(chalk.blue('正在创建数据库...'));
      const result = await creator.createDatabase();

      if (result.success) {
        console.log(chalk.green('✓'), result.message);
      } else {
        console.log(chalk.red('✗'), result.message);
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('错误:'), error.message);
      process.exit(1);
    } finally {
      await connectionManager.close();
    }
  });

// 执行迁移
program
  .command('migrate')
  .description('执行所有待处理的迁移')
  .action(async () => {
    try {
      console.log(chalk.blue('正在执行迁移...'));
      const result = await migrationManager.migrate();
      console.log(chalk.green('✓'), result.message);

      if (result.executed.length > 0) {
        console.log(chalk.gray('已执行:'));
        result.executed.forEach(m => console.log(chalk.gray('  -'), m));
      }
    } catch (error) {
      console.error(chalk.red('错误:'), error.message);
      process.exit(1);
    } finally {
      await connectionManager.close();
    }
  });

// 回滚迁移
program
  .command('migrate:undo')
  .description('回滚最后一次批次的迁移')
  .action(async () => {
    try {
      console.log(chalk.blue('正在回滚迁移...'));
      const result = await migrationManager.rollback();
      console.log(chalk.green('✓'), result.message);

      if (result.rolledBack.length > 0) {
        console.log(chalk.gray('已回滚:'));
        result.rolledBack.forEach(m => console.log(chalk.gray('  -'), m));
      }
    } catch (error) {
      console.error(chalk.red('错误:'), error.message);
      process.exit(1);
    } finally {
      await connectionManager.close();
    }
  });

// 执行种子
program
  .command('seed')
  .description('执行所有待处理的种子')
  .action(async () => {
    try {
      console.log(chalk.blue('正在执行种子...'));
      const result = await migrationManager.seed();
      console.log(chalk.green('✓'), result.message);

      if (result.executed.length > 0) {
        console.log(chalk.gray('已执行:'));
        result.executed.forEach(s => console.log(chalk.gray('  -'), s));
      }
    } catch (error) {
      console.error(chalk.red('错误:'), error.message);
      process.exit(1);
    } finally {
      await connectionManager.close();
    }
  });

// 回滚种子
program
  .command('seed:undo')
  .description('标记所有种子为未执行状态')
  .action(async () => {
    try {
      console.log(chalk.blue('正在回滚种子...'));
      const result = await migrationManager.seedUndo();
      console.log(chalk.green('✓'), result.message);

      if (result.rolledBack.length > 0) {
        console.log(chalk.gray('已回滚:'));
        result.rolledBack.forEach(s => console.log(chalk.gray('  -'), s));
      }
    } catch (error) {
      console.error(chalk.red('错误:'), error.message);
      process.exit(1);
    } finally {
      await connectionManager.close();
    }
  });

// 重置数据库
program
  .command('reset')
  .description('重置数据库（回滚所有迁移并重新执行）')
  .action(async () => {
    try {
      console.log(chalk.yellow('警告: 这将重置整个数据库！'));
      console.log(chalk.blue('正在重置数据库...'));

      const result = await migrationManager.reset();
      console.log(chalk.green('✓'), result.message);

      if (result.rolledBack.length > 0) {
        console.log(chalk.gray('已回滚:'));
        result.rolledBack.forEach(m => console.log(chalk.gray('  -'), m));
      }
      if (result.migrations.length > 0) {
        console.log(chalk.gray('已重新执行迁移:'));
        result.migrations.forEach(m => console.log(chalk.gray('  -'), m));
      }
      if (result.seeds.length > 0) {
        console.log(chalk.gray('已执行种子:'));
        result.seeds.forEach(s => console.log(chalk.gray('  -'), s));
      }
    } catch (error) {
      console.error(chalk.red('错误:'), error.message);
      process.exit(1);
    } finally {
      await connectionManager.close();
    }
  });

// 查看状态
program
  .command('status')
  .description('查看迁移和种子的状态')
  .action(async () => {
    try {
      const status = await migrationManager.status();

      console.log(chalk.blue('迁移状态:'));
      console.log(`  总数: ${status.migrations.total}`);
      console.log(`  已执行: ${chalk.green(status.migrations.executed)}`);
      console.log(`  待执行: ${chalk.yellow(status.migrations.pending.length)}`);

      if (status.migrations.pending.length > 0) {
        console.log(chalk.gray('  待执行列表:'));
        status.migrations.pending.forEach(m =>
          console.log(chalk.gray('    -'), m)
        );
      }

      console.log(chalk.blue('\n种子状态:'));
      console.log(`  总数: ${status.seeds.total}`);
      console.log(`  已执行: ${chalk.green(status.seeds.executed)}`);
      console.log(`  待执行: ${chalk.yellow(status.seeds.pending.length)}`);

      if (status.seeds.pending.length > 0) {
        console.log(chalk.gray('  待执行列表:'));
        status.seeds.pending.forEach(s =>
          console.log(chalk.gray('    -'), s)
        );
      }
    } catch (error) {
      console.error(chalk.red('错误:'), error.message);
      process.exit(1);
    } finally {
      await connectionManager.close();
    }
  });

// 同步模型
program
  .command('sync')
  .description('从Sequelize模型同步表结构')
  .action(async () => {
    try {
      console.log(chalk.blue('正在从模型同步...'));
      const result = await creator.syncFromModels();

      if (result.success) {
        console.log(chalk.green('✓'), result.message);
      } else {
        console.log(chalk.yellow('!'), result.message);
      }
    } catch (error) {
      console.error(chalk.red('错误:'), error.message);
      process.exit(1);
    } finally {
      await connectionManager.close();
    }
  });

// 创建迁移文件
program
  .command('migration:create <name>')
  .description('创建新的迁移文件')
  .action(async (name) => {
    try {
      console.log(chalk.blue(`正在创建迁移文件: ${name}...`));
      const result = await creator.createMigration(name);

      console.log(chalk.green('✓'), '迁移文件创建成功:');
      console.log(chalk.gray('  迁移:'), result.filename);
      console.log(chalk.gray('  回滚:'), result.rollbackFilename);
    } catch (error) {
      console.error(chalk.red('错误:'), error.message);
      process.exit(1);
    }
  });

// 创建种子文件
program
  .command('seed:create <name>')
  .description('创建新的种子文件')
  .action(async (name) => {
    try {
      console.log(chalk.blue(`正在创建种子文件: ${name}...`));
      const result = await creator.createSeed(name);

      console.log(chalk.green('✓'), '种子文件创建成功:');
      console.log(chalk.gray('  文件:'), result.filename);
    } catch (error) {
      console.error(chalk.red('错误:'), error.message);
      process.exit(1);
    }
  });

// 解析命令行参数
program.parse();

// 如果没有参数，显示帮助
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

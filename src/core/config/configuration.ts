import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

// 区分环境
const YAML_CONFIG_FILENAME =
  process.env.NODE_ENV === 'production'
    ? 'config.prod.yaml'
    : 'config.dev.yaml';
// 读取配置文件
export default () => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
};

#!/usr/bin/env node

import colors from 'colors';
import { getConfig } from '../libs/getConfig';
// import { fetchXml } from 'iconfont-parser';
import { parseString } from 'xml2js';
import { generateComponent } from '../libs/generateComponent';

const config = getConfig();
// 从url里获取svg信息，改为从本地iconfont.json配置文件里获取
interface XmlData {
  svg: {
    symbol: Array<{
      $: {
        viewBox: string;
        id: string;
      };
      path: Array<{
        $: {
          d: string;
          fill?: string;
        };
      }>;
    }>;
  }
}

export const fetchXml = async (str): Promise<XmlData> => {

  try {
    if (str) {
      return new Promise<XmlData>((resolve, reject) => {
        parseString(`<svg>${str}</svg>`, { rootName: 'svg' },  (err: Error, result: XmlData) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }

    throw new Error('You provide a wrong symbol url');
  } catch (e) {
    console.error(colors.red(e.message || 'Unknown Error'));
    process.exit(1);
    throw e;
  }
};

fetchXml(config.symbol_url).then((result) => {
  generateComponent(result, config);
}).catch((e) => {
  console.error(colors.red(e.message || 'Unknown Error'));
  process.exit(1);
});

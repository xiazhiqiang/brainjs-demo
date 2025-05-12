import * as brain from 'brain.js';
import { workerResponse } from '@/utils';

const net = new brain.recurrent.LSTM();
let preTrainingStatus = '';

function hello(data) {
  return 'hello world' + JSON.stringify(data);
}

async function preTrainingWithLSTM() {
  try {
    // 示例训练数据（规则 -> 生成的用户名）
    const trainingData = [
      { input: '6位数字+字母组合', output: 'Tom623451' },
      { input: '4位小写字母+2位大写字母', output: 'johnDO' },
      { input: '全数字', output: '123456' },
      { input: '全字母', output: 'johndoe' },
      // { input: '全数字', output: '1234567890' },
      // { input: '全小写字母', output: 'abcdefghijklmnopqrstuvwxyz' },
      // { input: '全大写字母', output: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
      // { input: '下划线', output: '_' },
      // { input: '中划线或横杠', output: '-' },
      // { input: '6位数字+大小写字母组合', output: 'Tom123' },
      // { input: '4位大小写字母+首字符大写字母+末尾字符数字', output: 'AlhnD6' },
    ];

    // 训练模型
    net.train(trainingData, {
      iterations: 10000,
      errorThresh: 0.005,
      learningRate: 0,
      log: true,
    });

    preTrainingStatus = 'ready';
    console.log('训练完成!');

    return { success: true, msg: '训练完成！' };
  } catch (err) {
    return { success: false, msg: err?.message, err };
  }
}

async function predictCode(data) {
  return new Promise((resolve, reject) => {
    let fn = () => {
      if (preTrainingStatus === 'error') {
        resolve({ success: false, msg: '训练异常！' });
      } else if (preTrainingStatus === 'ready') {
        try {
          const predictResult = net.run(data);
          resolve({ success: true, msg: predictResult });
        } catch (err) {
          resolve({ success: false, msg: err?.message, err });
        }
      } else {
        setTimeout(() => {
          fn();
        }, 1000);
      }
    };

    fn();
  });
}

const eventHandlers = { hello, preTrainingWithLSTM, predictCode };

(async function main(argv) {
  try {
    const { eventHandlers } = argv || {};

    // worker响应
    workerResponse(self, eventHandlers, 'brain');
  } catch (err) {}
})({ eventHandlers });

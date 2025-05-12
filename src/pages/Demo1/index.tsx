import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { Input, Button } from '@alifd/next';
// @ts-ignore
import brainWorker from './brain?worker';
import { workerRequest } from '@/utils';

export default function Demo1() {
  const [value, setValue] = useState<string | number>('');
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new brainWorker();
    // console.log('worker', workerRef.current);
    // testFun();

    workerRequest(workerRef.current, { action: 'preTrainingWithLSTM' }, 'brain');

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // // 生成用户名函数
  // const generateUsername = () => {
  //   const rule = document.getElementById('ruleInput').value;
  //   if (!rule) return;

  //   const predicted = net.run(rule);
  //   document.getElementById('result').innerText = '预测用户名：' + predicted;
  // };

  return (
    <div>
      Demo1
      <Input
        innerAfter={
          <Button
            type="primary"
            text
            onClick={async () => {
              const ret = await workerRequest(
                workerRef.current,
                { action: 'predictCode', data: '例如：6位数字+字母组合' },
                'brain',
              );
              console.log('ret', ret);
            }}
          >
            预测
          </Button>
        }
      />
    </div>
  );
}

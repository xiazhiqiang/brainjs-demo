import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import brainWorker from './brain2?worker';
import { workerRequest } from '@/utils';

export default function Demo2() {
  const workerRef = useRef<Worker | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // // 生成并导出数据集
    // const trainingData = generateDataset(datasetCOnfig);
    // console.log(JSON.stringify(trainingData, null, 2));
  }, []);

  useEffect(() => {
    workerRef.current = new brainWorker();
    console.log('worker', workerRef.current);

    (async () => {
      // 训练完成
      const res = await workerRequest(workerRef.current, 'preTraining', {}, { targetOrigin: 'demo2' });
      if (!res?.success || !res.data) {
        return;
      }

      //     // 获取输入值
      // const modelType = document.getElementById('modelType').value;
      // const usage = document.getElementById('usage').value;
      // const vendor = document.getElementById('vendor').value;

      // // 生成输入向量
      // const input = [
      //   ...encoder.modelType[modelType],
      //   ...encoder.usage[usage],
      //   ...encoder.vendor[vendor]
      // ];

      // 开始推理
      const res2 = await workerRequest(workerRef.current, 'inference', [0, 0, 1, 0, 0, 1, 1, 0, 0], {
        targetOrigin: 'demo2',
      });
      console.log('res2', res2);
    })();

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Demo2</h1>
    </div>
  );
}

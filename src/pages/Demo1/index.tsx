import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import brainWorker from './brain?worker';
import { workerRequest } from '@/utils';

// 测试worker的响应封装
export default function Demo1() {
  const workerRef = useRef<Worker | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    workerRef.current = new brainWorker();
    console.log('worker', workerRef.current);

    workerRequest(workerRef.current, 'hello', { name: 111 }, { targetOrigin: 'demo1' })
      .then((res) => {
        console.log('res', res);
        setResult(res?.data);
      })
      .catch((err) => {
        console.log('err', err);
      });

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Demo1</h1>
      <p>{result}</p>
    </div>
  );
}

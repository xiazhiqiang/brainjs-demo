import React, { useState, useEffect, useRef } from 'react';
import { Button, Icon, Select, Form, Field, Message } from '@alifd/next';
// @ts-ignore
import brainWorker from './brain2?worker';
import { workerRequest } from '@/utils';
import {
  generateTrainData,
  trainDataEncoder,
  trainDataDecoder,
  modelCapacity,
  modelFactory,
  modelType,
} from './dataset';

export default function Demo2() {
  const workerRef = useRef<Worker | null>(null);
  const [trainingStatus, setTrainingStatus] = useState<any>({});
  const [result, setResult] = useState<any>(null);
  const field = Field.useField({});

  useEffect(() => {
    // // 生成并导出数据集
    // let trainData = generateTrainData(10);
    // let trainDataEncode = trainDataEncoder(trainData);
    // console.log(trainData, trainDataEncode);
  }, []);

  useEffect(() => {
    workerRef.current = new brainWorker();
    console.log('worker', workerRef.current);

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Demo2</h1>

      <Button
        onClick={async () => {
          // 训练完成
          const res = await workerRequest(
            workerRef.current,
            'preTraining2',
            { total: 10000 },
            { targetOrigin: 'demo2', processFn: setTrainingStatus },
          );
          console.log('preTraining', res);
        }}
      >
        训练 {trainingStatus?.status === 'ready' && <Icon type="success" style={{ color: 'green' }} />}
      </Button>
      <h2>用户选择</h2>

      <Form field={field}>
        <Form.Item label="模型类型" name="modelType" required requiredMessage="请选择模型类型">
          <Select style={{ width: 500 }} dataSource={modelType} />
        </Form.Item>
        <Form.Item label="模型用途" name="modelCapacity" required requiredMessage="请选择模型用途">
          <Select style={{ width: 500 }} mode="multiple" dataSource={modelCapacity} />
        </Form.Item>
        <Form.Item label="模型厂商" name="modelFactory">
          <Select style={{ width: 500 }} dataSource={modelFactory.map((i) => ({ label: i, value: i }))} />
        </Form.Item>
      </Form>

      <Button
        type="primary"
        onClick={async () => {
          if (trainingStatus?.status !== 'ready') {
            Message.warning(`请先点击训练，待训练完成后进行推理`);
            return;
          }

          field.validate(async (errors, values) => {
            if (errors) {
              // Message.warning(`请填写完整表单`);
              return;
            }

            const userInput = [
              {
                input: {
                  type: values.modelType || 'llm',
                  capacity: values.modelCapacity || ['DEEP_THINK', 'T_GEN', 'dke'],
                  // factory: values.modelFactory || 'Others', // 'Deepseek',
                },
              },
            ];

            // 开始推理
            const res2 = await workerRequest(workerRef.current, 'inference2', trainDataEncoder(userInput)[0].input, {
              targetOrigin: 'demo2',
            });

            if (res2.success && res2.data) {
              const result = trainDataDecoder(res2.data, userInput[0].input);
              console.log('result', res2.data, result);
              setResult(result);
            } else {
              setResult(res2);
            }
          });

          return;
        }}
      >
        推理
      </Button>
      <h2>模型特性：</h2>
      {result?.model_name ? (
        <ul>
          <li>
            <strong>模型名称：</strong>
            {result?.model_name}
          </li>
          <li>
            <strong>基础模型名称：</strong>
            {result?.base_model_name}
          </li>
          <li>
            <strong>输入限制：</strong>
            {result?.input_limit}
          </li>
          <li>
            <strong>输出限制：</strong>
            {result?.output_limit}
          </li>
          <li>
            <strong>输入输出模式：</strong>
            {result?.input_output_mode}
          </li>
          <li>
            <strong>行业应用：</strong>
            {result?.industries}
          </li>
          <li>
            <strong>应用场景：</strong>
            {result?.applications}
          </li>
          <li>
            <strong>模型优势：</strong>
            {result?.model_advantages}
          </li>
          <li>
            <strong>是否开源：</strong>
            {result?.is_open_source}
          </li>
        </ul>
      ) : null}
      {/* <pre>{JSON.stringify(result, null, 2)}</pre> */}
    </div>
  );
}

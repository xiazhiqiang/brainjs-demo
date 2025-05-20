import React, { useState, useEffect, useRef } from 'react';
import { Button, Icon, Select, Form, Field, Message, Table, Input, NumberPicker } from '@alifd/next';
// @ts-ignore
import brainWorker from './brain2?worker';
import { workerRequest, downloadJSON, loadJSON } from '@/utils';
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
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const [trainNum, setTrainNum] = useState<number>(10000);
  const [trainingStatus, setTrainingStatus] = useState<any>({});

  const field = Field.useField({
    onChange: async (name, value) => {
      // console.log('onChange', name, value);
    },
  });

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

  const modelFeatures = field.getValue('modelFeatures') || {
    model_name: '',
    base_model_name: '',
    input_limit: '',
    output_limit: '',
    input_output_mode: '',
    industries: '',
    applications: '',
    model_advantages: '',
    is_open_source: '',
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Demo2</h1>
      <div style={{ margin: '10px 0' }}>
        <Button
          style={{ margin: '0 5px 0 0' }}
          onClick={async () => {
            await inputFileRef.current?.click();
          }}
        >
          导入模型
          <input
            type="file"
            accept="*.json"
            ref={inputFileRef}
            style={{ display: 'none' }}
            onChange={async (e: any) => {
              const file = e.target.files[0]; // 获取选中的文件
              if (!file) {
                Message.warning(`未加载到 JSON 文件`);
                return;
              }

              try {
                const data = await loadJSON(file);
                // console.log('load json data: ', data);
                const ret = await workerRequest(workerRef.current, 'importTrainModel2', data, {
                  targetOrigin: 'demo2',
                  processFn: setTrainingStatus,
                });
                console.log('ret', ret);
              } catch (err) {
                console.log('load file error: ', err);
              }
            }}
          />
        </Button>
        <label>预训练数据集：</label>
        <NumberPicker min={1} defaultValue={trainNum} onChange={setTrainNum} />
        <span style={{ margin: '0 4px' }}>条数据</span>
        <Button
          style={{ margin: '0 5px 0 0' }}
          type="primary"
          loading={trainingStatus?.status === 'preTraining'}
          onClick={async () => {
            // 预训练
            setTrainingStatus({ status: 'preTraining' });
            const res = await workerRequest(
              workerRef.current,
              'preTraining2',
              { total: trainNum },
              { targetOrigin: 'demo2', processFn: setTrainingStatus },
            );
            console.log('preTraining', res);
          }}
        >
          {trainingStatus?.status === 'ready' ? (
            <>
              <Icon type="success" style={{ color: 'white' }} />
            </>
          ) : null}
          训练
        </Button>

        <Button
          style={{ margin: '0 5px 0 0' }}
          disabled={trainingStatus?.status !== 'ready'}
          onClick={async () => {
            const res = await workerRequest(workerRef.current, 'exportTrainModel2', {}, { targetOrigin: 'demo2' });
            // console.log('res', res);
            if (res?.success && res.data) {
              downloadJSON(res.data);
            }
          }}
        >
          导出模型
        </Button>
      </div>

      <Form field={field}>
        <Form.Item label="模型类型" name="modelType" required requiredMessage="请选择模型类型">
          <Select style={{ width: 800 }} hasClear dataSource={modelType} />
        </Form.Item>
        <Form.Item label="模型用途" name="modelCapacity" required requiredMessage="请选择模型用途">
          <Select style={{ width: 800 }} hasClear mode="multiple" dataSource={modelCapacity} />
        </Form.Item>
        <Form.Item label="模型厂商" name="modelFactory">
          <Select style={{ width: 800 }} hasClear dataSource={modelFactory.map((i) => ({ label: i, value: i }))} />
        </Form.Item>
        <Form.Item
          style={{ width: 800 }}
          label={
            <>
              模型特性
              {field.getValue('modelType') &&
              field.getValue('modelCapacity')?.length > 0 &&
              trainingStatus?.status === 'ready' ? (
                <Button
                  text
                  type="primary"
                  style={{ margin: '0 0 0 10px' }}
                  onClick={async () => {
                    const values = field.getValues();
                    // 模型类型和用途都选择时才进行推理
                    if (values.modelType && values.modelCapacity) {
                      const userInput: any = [
                        {
                          input: {
                            type: values.modelType || 'llm',
                            capacity: values.modelCapacity || ['DEEP_THINK', 'T_GEN', 'dke'],
                            // factory: values.modelFactory || 'Others', // 'Deepseek',
                          },
                        },
                      ];
                      // 非必填
                      if (values.modelFactory) {
                        userInput[0].input.factory = values.modelFactory;
                      }

                      // 开始推理
                      const res2 = await workerRequest(
                        workerRef.current,
                        'inference2',
                        trainDataEncoder(userInput)[0].input,
                        {
                          targetOrigin: 'demo2',
                        },
                      );

                      // console.log('inference2 result: ', res2);
                      if (res2.success && res2.data) {
                        const result = trainDataDecoder(res2.data, userInput[0].input);
                        // console.log('result', res2.data, result);
                        field.setValue('modelFeatures', result);
                      } else {
                        console.log('inference2 error: ', res2);
                        // field.setValue('modelFeatures', res2);
                      }
                    }
                  }}
                >
                  AI帮您填充
                </Button>
              ) : null}
            </>
          }
          name="modelFeatures"
        >
          <Table
            dataSource={Object.keys(modelFeatures || {})
              .map((k) => {
                const id = +new Date() + '' + Math.random() * 100000000; // 增加表格唯一值，便于表格更新
                const content = modelFeatures[k];
                switch (k) {
                  // case 'model_name':
                  //   return { title: '模型名称', content };
                  case 'base_model_name':
                    return { id, title: '基础模型名称', content };
                  case 'input_limit':
                    return { id, title: '输入限制', content };
                  case 'output_limit':
                    return { id, title: '输出限制', content };
                  case 'input_output_mode':
                    return { id, title: '输入输出模式', content };
                  case 'industries':
                    return { id, title: '行业应用', content };
                  case 'applications':
                    return { id, title: '应用场景', content };
                  case 'model_advantages':
                    return { id, title: '模型优势', content };
                  case 'is_open_source':
                    return { id, title: '是否开源', content };

                  default:
                    return null;
                }
              })
              .filter((i) => i)}
          >
            <Table.Column
              title="标题"
              dataIndex="title"
              width={30}
              cell={(value, index, record) => {
                return <Input style={{ width: '100%' }} trim defaultValue={value} placeholder="请输入" />;
              }}
            />
            <Table.Column
              title="内容"
              dataIndex="content"
              width={70}
              cell={(value, index, record) => {
                return <Input.TextArea style={{ width: '100%' }} trim defaultValue={value} placeholder="请输入" />;
              }}
            />
          </Table>
        </Form.Item>
      </Form>
    </div>
  );
}

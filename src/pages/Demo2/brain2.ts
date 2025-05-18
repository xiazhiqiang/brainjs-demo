import * as brain from 'brain.js';
import { workerResponse } from '@/utils';
import { generateDataset, config as datasetCOnfig, decoder } from './dataset';

// const net = new brain.recurrent.LSTM();

// 创建神经网络（输入层9节点 = 3个字段各3个特征）
let net = new brain.NeuralNetwork({
  hiddenLayers: [6], // 6个隐藏节点
  activation: 'sigmoid',
});

let preTrainingStatus = '';

async function preTraining() {
  // 生成并导出数据集
  const trainingData = generateDataset(datasetCOnfig);
  console.log('trainingData', trainingData);

  // 训练模型
  net.train(trainingData, {
    iterations: 10000,
    errorThresh: 0.005,
    // learningRate: 0.001,
    logPeriod: 1000, // 每隔多少轮打印一次日志
    log: true,
  });

  preTrainingStatus = 'ready';
  console.log('训练完成!');

  return true;
}

async function inference(data) {
  const ret: any = net.run(data);
  console.log('inference', data, ret);

  // modelType: {
  //     LLM: [1, 0, 0],
  //     MultimodalVector: [0, 1, 0],
  //     MultimodalGen: [0, 0, 1],
  //   },
  //   usage: {
  //     TextGen: [1, 0, 0],
  //     SpeechRec: [0, 1, 0],
  //     VisualSeg: [0, 0, 1],
  //   },
  //   vendor: {
  //     Qwen: [1, 0, 0],
  //     Deepseek: [0, 1, 0],
  //     LLAMA: [0, 0, 1],
  //   },

  // 解码预测结果
  const basePrediction =
    decoder.baseModel.find((d) => ret.base >= d.threshold && d.type === 'MultimodalGen')?.text || '通用架构';

  const scenarioPrediction =
    decoder.scenario.find((d) => ret.scenario >= d.threshold && d.usage === 'VisualSeg')?.text || '多用途场景';

  const advantagePrediction =
    decoder.advantage.find((d) => ret.advantage >= d.threshold && d.vendor === 'Qwen')?.text || '平衡性能';

  return {
    basePrediction,
    scenarioPrediction,
    advantagePrediction,
  };
}

const eventHandlers = { preTraining, inference };

(async function main(argv) {
  const { eventHandlers } = argv || {};

  // worker响应
  workerResponse(self, eventHandlers, 'demo2');
})({ eventHandlers });

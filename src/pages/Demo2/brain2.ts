import * as brain from 'brain.js';
import { workerResponse } from '@/utils';
import { generateDataset, config as datasetCOnfig, decoder, trainDataEncoder, generateTrainData } from './dataset';

// 创建神经网络（输入层9节点 = 3个字段各3个特征）
let net = new brain.NeuralNetwork({
  hiddenLayers: [6], // 6个隐藏节点
  activation: 'sigmoid',
});

// Brain.js的输入层神经元数量由训练数据的特征维度自动推断，无需手动指定。例如，若特征数组为 [x1, x2, x3]，输入层将自动设置为3个神经元。
// const net = new brain.NeuralNetwork({
//   hiddenLayers: [特征数 * 2, 特征数] // 示例：输入层由特征数推断，隐藏层为两层
// });
// 经验法则：隐藏层神经元数可设为输入特征数的1-3倍，或使用交叉验证调整。
// 避免过拟合：若数据量较小，建议减少层数或神经元数量。
// 动态调整：通过训练误差和验证误差对比，逐步优化结构2。
let net2 = new brain.NeuralNetwork({
  activation: 'sigmoid',
});

let preTrainingStatus = '';

async function preTraining() {
  // 生成并导出数据集
  const trainingData = generateDataset(datasetCOnfig);

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

async function preTraining2(data, processFn) {
  let trainData = generateTrainData(data?.total || 10);
  let trainDataEncode = trainDataEncoder(trainData);
  // console.log('trainData', trainData, trainDataEncode);

  typeof processFn === 'function' && processFn({ status: 'preTraining', msg: '正在训练模型...' });

  // 训练模型
  net2.train(trainDataEncode, {
    iterations: 10000,
    errorThresh: 0.005,
    // learningRate: 0.001,
    logPeriod: 1000, // 每隔多少轮打印一次日志
    log: true,
  });

  typeof processFn === 'function' && processFn({ status: 'ready', msg: '训练完成！' });
  preTrainingStatus = 'ready';
  console.log('训练完成!');
  return { preTrainingStatus, trainData, trainDataEncode };
}
async function inference2(data) {
  // console.log('inference2 input data', data);
  const ret: any = net2.run(data);
  return ret;
}

// 导出模型
async function exportTrainModel2() {
  const ret = net2.toJSON();
  return ret;
}

// 导入模型
async function importTrainModel2(data, processFn) {
  if (data && data?.type === 'NeuralNetwork') {
    net2 = new brain.NeuralNetwork();
    net2.fromJSON(data);
    preTrainingStatus = 'ready';
    typeof processFn === 'function' && processFn({ status: 'ready', msg: '模型导入成功' });
  }
}

const eventHandlers = { preTraining, inference, preTraining2, inference2, exportTrainModel2, importTrainModel2 };

(async function main(argv) {
  const { eventHandlers } = argv || {};

  // worker响应
  workerResponse(self, eventHandlers, 'demo2');
})({ eventHandlers });

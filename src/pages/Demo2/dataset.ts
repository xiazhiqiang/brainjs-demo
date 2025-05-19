// 根据模型类型、模型用途、模型厂商信息，构造数据集训练，从而达到推理匹配模型特性。

// 模型特性，由大模型搜索总结生成
export const modelFeatures = [
  {
    model_name: 'Qwen',
    base_model_name: '通义千问',
    input_limit: '32768 token',
    output_limit: '8192 token',
    input_output_mode: '文本生成、对话式交互',
    industries: '电商，金融，教育，医疗',
    applications: '客服对话，内容创作，数据分析',
    model_advantages: '多语言支持、高效推理、代码生成能力',
    is_open_source: '是',
  },
  {
    model_name: 'Deepseek',
    base_model_name: 'DeepSeek',
    input_limit: '32768 token',
    output_limit: '8192 token',
    input_output_mode: '文本生成、逻辑推理',
    industries: '金融，法律，科研，企业服务',
    applications: '数据分析，智能助手，复杂任务处理',
    model_advantages: '参数量大（最高1300亿）、多模态能力、高精度逻辑推理',
    is_open_source: '是',
  },
  {
    model_name: 'GLM',
    base_model_name: 'GLM（如GLM-130B）',
    input_limit: '30720 token',
    output_limit: '2048 token',
    input_output_mode: '文本生成、多任务处理',
    industries: '法律，教育，制造业，医疗',
    applications: '文档处理，问答系统，技术文档生成',
    model_advantages: '长文本处理能力强、多任务学习、低资源语言支持',
    is_open_source: '是（部分）',
  },
  {
    model_name: 'Llama',
    base_model_name: 'Llama（如Llama 3）',
    input_limit: '32768 token',
    output_limit: '8192 token',
    input_output_mode: '文本生成、代码生成',
    industries: '科技，教育，游戏，开发',
    applications: '研究，开发工具，AI助手',
    model_advantages: '开源社区支持强、性能优异、多语言覆盖',
    is_open_source: '是',
  },
  {
    model_name: 'faster-whisper',
    base_model_name: 'Whisper（优化版）',
    input_limit: '音频时长（最长5h）',
    output_limit: '文本（转录结果）',
    input_output_mode: '音频转文本',
    industries: '媒体，教育，会议记录',
    applications: '语音转文字，字幕生成，语音分析',
    model_advantages: '高效推理速度（比Whisper快3-5倍）、低资源消耗、支持多语言',
    is_open_source: '是',
  },
  {
    model_name: 'MyShell',
    base_model_name: 'MyShell-Base',
    input_limit: '20480 token',
    output_limit: '4096 token',
    input_output_mode: '文本生成、对话式交互',
    industries: '电商，客服，营销',
    applications: '自动化客服，营销文案生成',
    model_advantages: '轻量化设计、低延迟响应、针对电商场景优化',
    is_open_source: '否',
  },
  {
    model_name: 'Others',
    base_model_name: '其他',
    input_limit: '示例：1024 token',
    output_limit: '示例：2K token',
    input_output_mode: '示例：文本生成、对话式交互',
    industries: '电商，客服，营销等',
    applications: '自动化客服，营销文案生成等',
    model_advantages: '轻量化设计、低延迟响应、针对电商场景优化',
    is_open_source: '否',
  },
];

// 模型类型
export const modelType = [
  { label: '大语言模型', value: 'llm' },
  { label: '其他', value: 'profession' },
  { label: 'CV (计算机视觉)', value: 'CV' },
  { label: 'TTS (文本转语音)', value: 'TTS' },
  { label: '多模态理解', value: 'vlm' },
  { label: '文本精排', value: 'RERANK' },
  { label: 'ASR (自动语音识别)', value: 'ASR' },
  { label: '文本向量化', value: 'EMBEDDING' },
  { label: '多模态向量', value: 'MM_EMBEDDING' },
  { label: '多模态生成', value: 'MM_GEN' },
  { label: '多模态精排', value: 'MM_RERANK' },
  { label: '富文本解析', value: 'layout' },
];

// 模型用途
export const modelCapacity = [
  { label: '文本生成', value: 'T_GEN' },
  { label: '多模态理解', value: 'VLM' },
  { label: '深度思考', value: 'DEEP_THINK' },
  { label: '文本精排', value: 'RERANK' },
  { label: '语音识别', value: 'ASR' },
  { label: '语音合成', value: 'TTS' },
  { label: '视觉分割', value: 'CV_PROCESS' },
  { label: '知识加工', value: 'dke' },
  { label: '文本向量', value: 'embedding' },
  { label: '三方模型', value: 'custommodel' },
  { label: '多模态向量化', value: 'MM_EMBEDDING' },
  { label: '文生图/视频', value: 'MM_GEN' },
  { label: '多模态精排', value: 'MM_RERANK' },
  { label: '评测裁判', value: 'evaluate' },
];

// 模型厂商
export const modelFactory = ['Qwen', 'Deepseek', 'GLM', 'Llama', 'faster-whisper', 'MyShell', 'Others']; // modelFeatures.map((i) => i.model_name);

// 数据集需要根据场景设计
export const exampleTrainingData = [
  { input: { type: 'llm', capacity: ['T_GEN', 'embedding', 'RERANK'], factory: 'Qwen' }, output: {} },
];

// 生成训练数据集
export function generateTrainData(count) {
  const trainData: any = [];
  for (let i = 0; i < count; i++) {
    let type = modelType[getRandomInt(0, modelType.length - 1)].value; // 随机取一个type
    let capacitySpan: string[] = [];
    let factorySpan: string[] = [];
    switch (type) {
      case 'llm': // 大语言模型
        capacitySpan = ['T_GEN', 'DEEP_THINK', 'RERANK', 'dke', 'embedding', 'evaluate'];
        factorySpan = ['Qwen', 'Deepseek', 'GLM', 'Llama'];
        break;
      case 'profession': // 其他
        capacitySpan = ['MM_EMBEDDING', 'MM_GEN', 'MM_RERANK', 'dke', 'evaluate'];
        factorySpan = ['Qwen', 'Deepseek', 'GLM', 'Llama', 'Others'];
        break;
      case 'CV': // CV (计算机视觉)
        capacitySpan = ['CV_PROCESS', 'Others'];
        factorySpan = ['Others'];
        break;
      case 'TTS': // TTS (文本转语音)
        capacitySpan = ['ASR', 'TTS', 'embedding'];
        factorySpan = ['Qwen', 'faster-whisper', 'Others'];
        break;
      case 'vlm': // 多模态理解
        capacitySpan = ['VLM', 'RERANK', 'embedding', 'MM_EMBEDDING', 'MM_GEN', 'MM_RERANK'];
        factorySpan = ['Qwen', 'Others'];
        break;
      case 'RERANK': // 文本精排
        capacitySpan = ['RERANK', 'MM_RERANK'];
        factorySpan = ['Qwen', 'Deepseek', 'Others'];
        break;
      case 'ASR': // ASR (自动语音识别)
        capacitySpan = ['ASR', 'embedding'];
        factorySpan = ['Qwen', 'faster-whisper', 'Others'];
        break;
      case 'EMBEDDING': // 文本向量化
        capacitySpan = ['embedding', 'MM_EMBEDDING', 'T_GEN', 'MM_GEN', 'dke'];
        factorySpan = ['Qwen', 'Deepseek', 'GLM', 'Llama', 'Others'];
        break;
      case 'MM_EMBEDDING': // 多模态向量
        capacitySpan = ['MM_EMBEDDING', 'T_GEN', 'MM_GEN', 'dke', 'custommodel'];
        factorySpan = ['Llama', 'Others'];
        break;
      case 'MM_GEN': // 多模态生成
        capacitySpan = ['MM_GEN', 'dke', 'custommodel'];
        factorySpan = ['Llama', 'Others'];
        break;
      case 'MM_RERANK': // 多模态精排
        capacitySpan = ['MM_RERANK', 'dke', 'evaluate', 'custommodel'];
        factorySpan = ['Llama', 'Others'];
        break;
      case 'layout': // 富文本解析
        capacitySpan = ['DEEP_THINK', 'T_GEN', 'RERANK', 'dke', 'embedding', 'evaluate'];
        factorySpan = ['Qwen', 'Deepseek', 'GLM', 'Llama', 'MyShell', 'Others'];
        break;

      default:
        capacitySpan = ['T_GEN', 'DEEP_THINK', 'RERANK'];
        factorySpan = ['Qwen', 'Deepseek', 'GLM', 'Llama', 'Others'];
    }

    // 构造input
    let input = {
      type,
      capacity: getRandomArray(0, capacitySpan.length - 1).map((idx) => capacitySpan[idx]), // 不定长选取模型用途数组
      factory: factorySpan[getRandomInt(0, factorySpan.length - 1)], // 随机选取一个模型厂商
    };

    // 构造output
    let output = modelFeatures.find((i) => i.model_name === input.factory);

    trainData.push({ input, output });
  }
  return trainData;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomArray(min, max) {
  const count = getRandomInt(min, max) || 1;
  const arr: number[] = [];
  for (let i = 0; i < count; i++) {
    arr.push(getRandomInt(min, max));
  }
  return arr;
}

// 输入编码器，数据0/1化
export function trainDataEncoder(data) {
  return data.map((item) => {
    let input = {};
    let output = {};

    let type: any = {};
    modelType.forEach((m) => {
      type[`type_${m.value}`] = item.input.type === m.value ? 1 : 0;
    });

    let capacity = {};
    modelCapacity.forEach((m) => {
      capacity[`capacity_${m.value}`] = item.input.capacity.includes(m.value) ? 1 : 0;
    });

    let factory = {};
    modelFactory.forEach((m) => {
      factory[`factory_${m}`] = item.input.factory === m ? 1 : 0;

      // 输出归一化
      output[m] = item.input.factory === m ? 1 : 0;
    });

    // 输入归一化
    input = { ...type, ...capacity, ...factory };

    return { input, output };
  });
}

// 解码器
export function trainDataDecoder(predictData, inputData) {
  // 根据推理返回的概率值，取最大的一个预测结果
  let p = { probability: 0, predict: '' };
  Object.keys(predictData).forEach((k) => {
    if (predictData[k] > p.probability) {
      p.probability = predictData[k];
      p.predict = k;
    }
  });

  const feature = modelFeatures.find((i) => i?.model_name === p.predict);

  let predictOutput = {
    model_name: feature?.model_name,
    base_model_name: feature?.base_model_name || '其他',
    input_limit: feature?.input_limit,
    output_limit: feature?.output_limit,
    input_output_mode: feature?.input_output_mode,
    industries: feature?.industries,
    applications: inputData.capacity.map((m) => modelCapacity.find((n) => n?.value === m)?.label).join('，'), // 根据输入用途拼接
    model_advantages: feature?.model_advantages,
    is_open_source: feature?.is_open_source,
  };

  return predictOutput;
}

// --------------------------------------------

// 数据生成配置
export const config = {
  modelTypes: ['LLM', 'MultimodalVector', 'MultimodalGen'],
  usages: ['TextGen', 'SpeechRec', 'VisualSeg'],
  vendors: ['Qwen', 'Deepseek', 'LLAMA'],
  outputRanges: {
    base: { min: 0.6, max: 0.95 }, // 基础架构置信度
    scenario: { min: 0.5, max: 0.9 }, // 场景匹配度
    advantage: { min: 0.7, max: 0.99 }, // 优势评分
  },
  samplesPerCombination: 5, // 每个组合生成5个样本
};

// 特征生成规则库
const ruleEngine = {
  // 基础架构规则
  baseRules: {
    LLM: {
      Qwen: { base: 0.85, delta: 0.1 },
      Deepseek: { base: 0.82, delta: 0.08 },
      LLAMA: { base: 0.78, delta: 0.12 },
    },
    MultimodalVector: {
      Qwen: { base: 0.76, delta: 0.15 },
      // 其他厂商规则...
    },
  },

  // 应用场景规则
  scenarioRules: {
    TextGen: {
      LLM: { scenario: 0.88, delta: 0.07 },
      MultimodalGen: { scenario: 0.65, delta: 0.1 },
    },
    // 其他用途规则...
  },

  // 厂商优势规则
  vendorAdvantage: {
    Qwen: { advantage: 0.9, delta: 0.05 },
    Deepseek: { advantage: 0.87, delta: 0.08 },
    LLAMA: { advantage: 0.83, delta: 0.1 },
  },
};

// 数据生成器核心函数
export function generateDataset(config) {
  const dataset = [];

  // 遍历所有组合
  for (const modelType of config.modelTypes) {
    for (const usage of config.usages) {
      for (const vendor of config.vendors) {
        // 每个组合生成多个样本
        for (let i = 0; i < config.samplesPerCombination; i++) {
          const input = encodeInput(modelType, usage, vendor);
          const output = calculateOutput(modelType, usage, vendor);
          dataset.push({ input, output });
        }
      }
    }
  }
  return dataset;
}

// 输入编码（独热编码）
function encodeInput(modelType, usage, vendor) {
  const oneHot = {
    modelType: { LLM: [1, 0, 0], MultimodalVector: [0, 1, 0], MultimodalGen: [0, 0, 1] },
    usage: { TextGen: [1, 0, 0], SpeechRec: [0, 1, 0], VisualSeg: [0, 0, 1] },
    vendor: { Qwen: [1, 0, 0], Deepseek: [0, 1, 0], LLAMA: [0, 0, 1] },
  };

  return [...oneHot.modelType[modelType], ...oneHot.usage[usage], ...oneHot.vendor[vendor]];
}

// 输出值计算（基于规则和随机扰动）
function calculateOutput(modelType, usage, vendor) {
  // 基础架构得分
  const baseRule = ruleEngine.baseRules[modelType]?.[vendor] || { base: 0.7, delta: 0.1 };
  const base = baseRule.base + (Math.random() * 2 - 1) * baseRule.delta;

  // 场景匹配度
  const scenarioRule = ruleEngine.scenarioRules[usage]?.[modelType] || { scenario: 0.7, delta: 0.1 };
  const scenario = scenarioRule.scenario + (Math.random() * 2 - 1) * scenarioRule.delta;

  // 厂商优势
  const vendorRule = ruleEngine.vendorAdvantage[vendor] || { advantage: 0.8, delta: 0.1 };
  const advantage = vendorRule.advantage + (Math.random() * 2 - 1) * vendorRule.delta;

  // 限制输出范围
  return {
    base: clamp(base, config.outputRanges.base),
    scenario: clamp(scenario, config.outputRanges.scenario),
    advantage: clamp(advantage, config.outputRanges.advantage),
  };
}

// 数值范围约束函数
function clamp(value, { min, max }) {
  return Math.min(Math.max(value, min), max);
}

// // 数据编码器（将文本转换为数值）
// export const encoder = {
//   modelType: { LLM: [1, 0, 0], MultimodalVector: [0, 1, 0], MultimodalGen: [0, 0, 1] },
//   usage: { TextGen: [1, 0, 0], SpeechRec: [0, 1, 0], VisualSeg: [0, 0, 1] },
//   vendor: { Qwen: [1, 0, 0], Deepseek: [0, 1, 0], LLAMA: [0, 0, 1] },
// };

// 特征解码器（将网络输出转换为可读文本）
export const decoder = {
  baseModel: [
    { threshold: 0.8, text: 'Transformer架构（12层）', type: 'LLM' },
    { threshold: 0.6, text: '双塔向量编码器', type: 'MultimodalVector' },
    { threshold: 0.7, text: '扩散生成模型', type: 'MultimodalGen' },
  ],
  scenario: [
    { threshold: 0.75, text: '长文本生成', usage: 'TextGen' },
    { threshold: 0.65, text: '语音指令识别', usage: 'SpeechRec' },
    { threshold: 0.7, text: '图像实例分割', usage: 'VisualSeg' },
  ],
  advantage: [
    { threshold: 0.85, text: '低推理延迟', vendor: 'Deepseek' },
    { threshold: 0.8, text: '多语言支持', vendor: 'LLAMA' },
    { threshold: 0.75, text: '高生成质量', vendor: 'Qwen' },
  ],
};

// --------------------------------------------

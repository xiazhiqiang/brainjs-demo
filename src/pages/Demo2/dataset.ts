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
    modelType: {
      LLM: [1, 0, 0],
      MultimodalVector: [0, 1, 0],
      MultimodalGen: [0, 0, 1],
    },
    usage: {
      TextGen: [1, 0, 0],
      SpeechRec: [0, 1, 0],
      VisualSeg: [0, 0, 1],
    },
    vendor: {
      Qwen: [1, 0, 0],
      Deepseek: [0, 1, 0],
      LLAMA: [0, 0, 1],
    },
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

// --------------------------------------------

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

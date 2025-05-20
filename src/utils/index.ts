// 客户端请求
export async function workerRequest(
  targetWorker,
  action: string,
  data?: any,
  opts?:
    | any
    | undefined
    | {
        processFn?: (data?: any) => any | null;
        targetOrigin?: string | undefined | '*';
      },
): Promise<{
  success: boolean;
  data?: any | null;
  error?: any | null;
}> {
  return new Promise((resolve, reject) => {
    const id = Date.now(); // 为每个消息生成一个唯一ID
    const { targetOrigin = '*', processFn } = opts || {};

    if (!action) {
      reject(new Error('Action is required'));
    }

    const messageHandler = function (event) {
      const { actionId, origin, response, responseType } = event.data || {};
      if (origin === targetOrigin && id === actionId) {
        if (responseType === 'needProcess') {
          // 响应过程回调
          typeof processFn === 'function' && processFn(response);
        } else {
          // 默认响应返回结果
          targetWorker.removeEventListener('message', messageHandler);
          resolve(response);
        }
      }
    };
    // 监听回调
    targetWorker.addEventListener('message', messageHandler);

    // 发送数据
    targetWorker.postMessage({
      actionId: id,
      actionType: typeof processFn === 'function' ? 'needProcess' : '',
      action,
      data,
      origin: targetOrigin,
    });
  });
}

// 服务端响应调用
export function workerResponse(target, handlers = {}, targetOrigin = '*') {
  target.addEventListener('message', async function (event) {
    const { actionId, origin = '', action = '', actionType = '', data } = event?.data || {};
    if (origin === targetOrigin && action && typeof handlers[action] === 'function') {
      const result: any = { actionId, origin, response: { success: true, data: null, error: null } };
      try {
        // 需要中间回调
        if (actionType === 'needProcess') {
          result.response.data = await handlers[action](data, (processData) => {
            target.postMessage({ actionId, origin, responseType: actionType, response: processData });
          });
        } else {
          // 默认直接调用
          result.response.data = await handlers[action](data);
        }
      } catch (error) {
        result.response.success = false;
        result.response.error = error;
      }
      target.postMessage(result);
    }
  });
}

// 下载JSON文件
export function downloadJSON(data, filename = 'data.json') {
  // 1. 将 JSON 转换为格式化字符串
  const jsonString = JSON.stringify(data, null, 2);

  // 2. 创建 Blob 对象（二进制大对象）
  const blob = new Blob([jsonString], { type: 'application/json' });

  // 3. 生成临时下载链接
  const url = URL.createObjectURL(blob);

  // 4. 创建虚拟 <a> 标签并触发点击
  const a = document.createElement('a');
  a.href = url;
  a.download = filename; // 设置下载文件名

  document.body.appendChild(a); // 临时添加到DOM
  a.click(); // 模拟点击下载

  // 5. 清理资源
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // 释放内存
}

// 读取文件JSON文件为对象
export async function loadJSON(file) {
  return new Promise((resolve, reject) => {
    // 1. 创建文件阅读器
    const reader = new FileReader();

    // 2. 定义读取完成回调
    reader.onload = function (event: any) {
      // console.log('reader event', event);
      try {
        // 3. 解析 JSON 数据
        const jsonData = JSON.parse(event?.target?.result || '{}');
        // console.log('解析成功:', jsonData);
        resolve(jsonData);
      } catch (error) {
        // console.error('JSON 解析失败:', error);
        reject(error);
      }
    };

    // 4. 定义错误处理
    reader.onerror = function (error) {
      // console.error('文件读取错误:', error);
      reject(error);
    };

    // 5. 开始读取文件（UTF-8编码）
    reader.readAsText(file, 'UTF-8');
  });
}

export async function workerRequest(targetWorker, message: { action?: string; data?: any } = {}, targetOrigin = '*') {
  return new Promise((resolve, reject) => {
    const messageId = Date.now(); // 为每个消息生成一个唯一ID

    const messageHandler = function (event) {
      const { id, origin, response } = event.data || {};
      if (origin === targetOrigin && id === messageId) {
        targetWorker.removeEventListener('message', messageHandler);
        resolve(response);
      }
    };
    // 监听回调
    targetWorker.addEventListener('message', messageHandler);

    // 发送数据
    targetWorker.postMessage({
      id: messageId,
      action: message?.action || '',
      data: message?.data,
      origin: targetOrigin || '',
    });
  });
}

export function workerResponse(target, handlers = {}, targetOrigin = '*') {
  target.addEventListener('message', async function (event) {
    const { id, origin = '', action = '', data } = event?.data || {};
    if (origin === targetOrigin && action) {
      const responseMessage: any = { id, origin, response: undefined };
      if (typeof handlers[action] === 'function') {
        responseMessage.response = await handlers[action](data);
      }
      target.postMessage(responseMessage);
    }
  });
}

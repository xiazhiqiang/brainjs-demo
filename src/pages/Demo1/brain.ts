import { workerResponse } from '@/utils';

function hello(data) {
  return 'hello world' + JSON.stringify(data);
}

const eventHandlers = { hello };

(async function main(argv) {
  const { eventHandlers } = argv || {};

  // worker响应
  workerResponse(self, eventHandlers, 'demo1');
})({ eventHandlers });

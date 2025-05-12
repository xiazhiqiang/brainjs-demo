declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// 在项目中添加一个 global.d.ts 或在当前目录下添加 brain.d.ts
declare module '*.worker.*' {
  class BrainWorker extends Worker {
    constructor();
  }
  export default BrainWorker;
}

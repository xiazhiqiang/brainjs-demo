import React from 'react';

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Directory</h1>
      <ul>
        <li>
          <a href="/demo1">Demo1：测试 webworker 的响应封装</a>
        </li>
        <li>
          <a href="/demo2">Demo2：测试 brain.js 模型训练、推理、导入/导出</a>
        </li>
      </ul>
    </div>
  );
}

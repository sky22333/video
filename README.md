## 简洁美观的视频在线解析网站

### 部署

安装依赖
```
npm i
```
运行
```
npm run dev
```
打包
```
npm run build
```

### API接口配置

编辑 `src/config/apiConfig.json` 文件来管理解析接口：

```json
{
  "apis": [
    {
      "id": "api1",
      "name": "解析接口一", 
      "url": "https://example.com/?url="
    },
    {
      "id": "api2",
      "name": "解析接口二",
      "url": "https://example.com/?url="
    }
  ]
}
```

### 免责声明
- 本项目仅用于技术学习与交流，不提供任何实际资源。所有内容均来自互联网公开接口。
- 所有资源的版权归原著作权人所有，用户使用本项目产生的任何版权纠纷由用户自行承担。
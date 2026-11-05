# HistoriA · 历史推理局（案件001）

这是一个可直接部署到 GitHub Pages 的静态网页原型。无需安装依赖、无需后端。

## 本地预览
由于浏览器对本地 `fetch()` 的限制，建议用 VS Code 的 Live Server，或在项目目录运行：
```bash
python -m http.server 8000
```
然后打开 `http://localhost:8000`。

## GitHub Pages 部署
1. 将本项目文件上传到 GitHub 仓库根目录。
2. 进入仓库 Settings → Pages。
3. 在 Build and deployment 中选择 Deploy from a branch。
4. 选择 `main` 分支和 `/ (root)`，保存。
5. 等待 GitHub Pages 发布完成后访问页面地址。

## 当前功能
- 案件档案与调查任务
- 8份史料/研究资料卡片，可搜索、筛选、查看详情
- 自由选择材料并加入/移出证据板
- 初步假设、证据推理、反证记录
- 本地规则式“调查助手”演示
- 结案报告填写、带入工作台内容、导出 TXT

## 史料使用原则
- 卡片明确区分原始史料、后来的机构说明、现代研究数据、档案集合入口和复原模型。
- “可以支持”和“不能证明”是教学设计提示，不是材料原文。
- 档案集合入口、检索指南不是具体原始史料；需进一步定位具体文献后才能作直接证据。
- 对于无法确认公开全文或版权状态的材料，网页只提供原站链接，不复制图像或全文。

## 重要说明
当前调查助手为本地规则式演示，并未接入真实AI模型；它不会把模拟反馈伪装成模型生成结果。若后续要接入大模型，建议通过独立后端或云函数代理API请求，切勿把API Key写入 `app.js` 或公开GitHub仓库。GitHub Pages只能托管静态前端，不能直接运行Node/Express后端。

## 史料来源（首版）
- Powerhouse Museum, James Watt's separate condenser patent specification (1769): https://collection.powerhouse.com.au/object/119115
- The National Archives, Factory Inspectors' Report extract (1836): https://www.nationalarchives.gov.uk/education/resources/1833-factory-act/source-1/
- UK Parliament, The 1833 Factory Act: https://www.parliament.uk/about/living-heritage/transformingsociety/livinglearning/19thcentury/overview/factoryact/
- University of Cambridge, Economies Past: https://www.economiespast.org/
- The National Archives, Enclosure awards and maps research guide: https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/enclosure-awards/
- Science Museum Group, Reconstruction of Hargreaves's Spinning Jenny: https://collection.sciencemuseumgroup.org.uk/objects/co44855
- Revolutionary Players: https://www.revolutionaryplayers.org.uk/
- Adam Matthew, East India Company: https://www.eastindiacompany.amdigital.co.uk/

## 下一轮建议
1. 补充可直接阅读的棉纺织贸易账簿、煤炭/能源资料和圈地地区个案。
2. 为每一份新增原始材料增加逐字转录、出处页码/档号、中文译文和版权说明。
3. 让AI反馈基于选入的具体史料及其证据边界，而不是泛泛评价答案。

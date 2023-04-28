
// ==UserScript==
// @name         哔哩哔哩首页推荐内容限制脚本
// @namespace    bili-homepage-limit
// @version      1
// @description  限制哔哩哔哩首页推荐内容数量在前10条以内，并只保留指定类型的内容，如视频类型。
// @author       OpenAI Sage
// @match        https://app.bilibili.com/x/v2/feed/index
// @grant        none
// ==/UserScript==

if ($response.body) {
  let bodyJson = JSON.parse($response.body);
  let feed = bodyJson.data || {};
  let items = feed.items || [];

  // 设置需要显示的视频数目
  const MAX_VIDEO_COUNT = 2;
  if (items.length > MAX_VIDEO_COUNT) {
    // 仅保留前10个视频
    items = items.slice(0, MAX_VIDEO_COUNT);
    feed.items = items;

    // 更新响应数据
    $done({ body: JSON.stringify(bodyJson) });
  }
} else {
  $done({});
}

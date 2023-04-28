
// ==UserScript==
// @name         哔哩哔哩首页推荐内容限制脚本
// @namespace    bili-homepage-limit
// @version      1
// @description  限制哔哩哔哩首页推荐内容数量在前10条以内，并只保留指定类型的内容，如视频类型。
// @author       OpenAI Sage
// @match        https://app.bilibili.com/x/v2/feed/index
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const MAX_LIMIT = 4; // 最大限制条数
    const ALLOWED_TYPE = [2]; // 允许的内容类型，如视频类型为2

    const data = $response.bodyResult.data;
    const filteredData = data.filter(item => ALLOWED_TYPE.includes(item.type)).slice(0, MAX_LIMIT);

    $done({
        body: JSON.stringify({
            code: 0,
            message: "OK",
            ttl: 1,
            data: filteredData
        })
    });
})();

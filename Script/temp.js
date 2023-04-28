
const url = $request.url;
const notifyTitle = "bilibili-json";

if (!$response.body) {
    console.log(`$response.body为undefined:${url}`);
    $done({});
}

let body = JSON.parse($response.body);

if (!body.data) {
    console.log(`body:${$response.body}`);
    $notification.post(notifyTitle, url, "data字段错误");
} else {
    if (url.includes("x/v2/splash")) {
        console.log('开屏页' + (url.includes("splash/show") ? 'show' : 'list'));
        if (!body.data.show) {
            console.log('数据无show字段');
        } else {
            delete body.data.show;
            console.log('成功');
        }
    } else if (url.includes("x/v2/feed/index")) {
        console.log('推荐页');
        // 设置需要显示的视频数目
        const MAX_VIDEO_COUNT = 10;
        if (!body.data.items?.length) {
            console.log(`body:${$response.body}`);
            $notification.post(notifyTitle, '推荐页', "items字段错误");
        } else {
            body.data.items = body.data.items.filter(i => {
                const {card_type: cardType, card_goto: cardGoto} = i;
                if (cardType && cardGoto) {
                    if (cardType === 'banner_v8' && cardGoto === 'banner') {
                        if (!i.banner_item) {
                            console.log(`body:${$response.body}`);
                            $notification.post(notifyTitle, '推荐页', "banner_item错误");
                        } else {
                            for (const v of i.banner_item) {
                                if (!v.type) {
                                    console.log(`body:${$response.body}`);
                                    $notification.post(notifyTitle, '推荐页', "type错误");
                                } else {
                                    if (v.type === 'ad') {
                                        console.log('banner广告');
                                        return false;
                                    }
                                }
                            }
                        }
                    } else if (cardType === 'small_cover_v5' && cardGoto === 'av') {
                        if (i.goto_impress?.length) {
                            i.goto_impress = i.goto_impress.filter(g => !g?.includes('ad'));
                        }
                        if (i.goto?.length) {
                            i.goto = i.goto.filter(g => !g?.includes('ad'));
                        }
                        return true;
                    }
                }
                return false;
            });
            // 仅保留前10个视频
            body.data.items = body.data.items.slice(0, MAX_VIDEO_COUNT);
        }
    }
}

$done({ body: JSON.stringify(body) });

'use strict';
importScripts('/static/sw/lib/sw-toolbox.js');


toolbox.router.get('/(.*)', function (request, values, options) {
    var url = request.url;
    // 图片,字体等静态文件用 cacheFirst 的方式
    var imgReg = /(\.(png|jpg|jpeg|mp3|mp4|mpg|jpeg|eot|svg|ttf|woff|gif|woff2)$)/i;
    // html 文件用 networkOnly 的方式
    var htmlReg = /(\.(html|htm)$)||\//i;
    if (imgReg.test(url)) {
      return toolbox.cacheFirst(request, values, options);
    } else if (htmlReg.test(url)) {
      return toolbox.networkFirst(request, values, options);
    } else {
      return self.toolbox.fastest(request, values, options);
    }
  },
  {
    cache: {
      name: 'farmer-zheng-blog',
      maxEntries: 200
    }
  }
);

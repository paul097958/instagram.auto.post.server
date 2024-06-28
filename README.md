# 自動匿名系統(後端)

<span style="font-size: 30px; color: red;">請注意：請先看前端部署內容至<strong> 部署網站 </strong>部分，再來看此說明</span>

> 前端網址：<https://github.com/paul097958/instagram.auto.post>

## 部署系統步驟

這裡*不包含*前端部署步驟，步驟中會闡述如和連接

1. 申請instagram帳號
1. 申請github帳號
1. 配置檔案
1. 部署伺服器
1. 設定cronjob
1. 進階系統設定

### 申請instagram帳號

這個大家應該都會，但建議大家去使用商用帳號。記好帳號跟密碼。

### 申請github帳號

去到github網站，去申請帳號，如果已經登入的人，按下面的連結，頁面就會是你的個人主頁

> 連結：<https://github.com>

![github 1](https://i.imgur.com/ReoFBRI.png)

---

登入好之後，去到本匿名的頁面

> 連結：<https://github.com/paul097958/instagram.auto.post.server>

然後按按下右上角的`Fork`

![github 2](https://i.imgur.com/vRZBSFl.png)

下一步按`Create Fork`

![github 3](https://i.imgur.com/Rd43mDd.png)

接下來按一下`config.js`這一個文件

![github 4](https://i.imgur.com/gDWccSh.png)

按進去之後，按右上角的那個筆的圖案，進入編輯模式

![github 5](https://i.imgur.com/4cGpSHA.png)

接下來你有沒有發現，跟之前前端部署的一個環節非常類似，沒錯，是差不多的步驟，只差在不需要填入`Imgur`的Token而已。只需要更改`firebaseConfig`(就是我用紅色框起來的地方)，換成你之前的那一段Firebase程式碼。更改完之後按下`Commit changes...`

![github 6](https://i.imgur.com/0ycmk3Q.png)

直接按下`Commit changes...`就好

![github 7](https://i.imgur.com/36qUgkh.png)

接下來是要更改`.env`這個檔案

![github 8](https://i.imgur.com/lJkiF2q.png)

* 把IG_USERNAME改成你的帳號名稱
* 把IG_PASSWORD改成你的密碼

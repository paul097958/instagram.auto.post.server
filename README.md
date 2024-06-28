# 自動匿名系統(後端)

> 版本號：0.1.0 可適用前端最舊版本：0.1.0

<span style="font-size: 30px; color: red;">請注意：請先看前端部署內容至<strong> 部署網站 </strong>部分，再來看此說明</span>

> 前端網址：<https://github.com/paul097958/instagram.auto.post>

## 技術支持

本自動匿名伺服器系統使用nodejs, firebase所開發，使用GNU條款。

## 部署系統步驟

這裡*不包含*前端部署步驟，步驟中會闡述如和連接

1. 申請instagram帳號
1. 取得Line notify Token
1. 申請github帳號和配置檔案
1. 部署伺服器
1. 設定cronjob
1. 進階系統設定

### 申請instagram帳號

這個大家應該都會，但建議大家去使用商用帳號。記好帳號跟密碼。

### 取得Line notify Token

> line notify是為了要做伺服器通知使用，所以請先建立一個群組，把所有管理匿名帳號的人都加進來。並且把line notify加入群組，line id是 @linenotify

去到下面的網站並先登入Line

> 連結：<https://notify-bot.line.me/my/>

進到這個網頁之後，登入後滑到最下面會有這一個東西，然後按下Generate token

![line 1](https://i.imgur.com/fTj0Uge.png)

之後選取你要加入的群組，然後按Generate Token

![line 2](https://i.imgur.com/YmDmsp4.png)

之後就會出現你的Token了喔，記得記下來

![line 3](https://i.imgur.com/kjo82Xt.png)

### 申請github帳號和配置檔案

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

![github 5](https://i.imgur.com/748DHzN.png)

接下來你有沒有發現，跟之前前端部署的一個環節非常類似，沒錯，是差不多的步驟。需要更改的地方如下。

1. firebaseConfig：這個跟剛剛的前端更改方式一模一樣
1. Line_NOTIFY_TOKEN：這裡填剛剛的Line notify Token
1. IG_USERNAME：你的ig帳號名稱
1. IG_PASSWORD：你的ig密碼

更改完之後按下`Commit changes...`

![github 6](https://i.imgur.com/LuA5q6x.png)

直接按下`Commit changes...`就好

![github 7](https://i.imgur.com/36qUgkh.png)

### 部署伺服器

> 我建議大家使用onrender這個免費的伺服器服務商，而我們的系統也是為量身打造的，但是當然，你也是可以使用其他伺服器服務商，只是你必須對程式的架構有一定的了解

![render 1](https://i.imgur.com/oAMuhCp.jpeg)

---

第一步當然是登入

> 連結：https://dashboard.render.com/

選擇以Github登入，因為剛剛已經有創建帳號了所以可以直接登入進去

![render 2](https://i.imgur.com/tk3bak0.png)

確認Email是否正確，通常直接按Create Account就可以了

![render 3](https://i.imgur.com/Upskqpi.png)

接下來創建服務，按一下New > Web Server

![render 4](https://i.imgur.com/dbWzW1z.png)

選擇第一個選項Build and deply from a Git repository，選好之後按Next，如下圖

![render 5](https://i.imgur.com/MH0uIGI.png)

綁定GitHub帳號

![render 6](https://i.imgur.com/W5Ozoah.png)

選擇專案，YOUR_NAME/instagram.auto.post.server，按下Connect

![render 7](https://i.imgur.com/xhCP9hk.png)

接著到裡面之後，要填入下面資料，只有我用紅色框框用起來的需要更改，其餘他會自動填寫，但還是建議可以檢查一下是否跟我上面的資料相同(只有Name不一樣)

1. Region：填入離你最近的位置
1. Root Directory：填入`.`就只要填一個半形英文字母的點就好
1. Build Command：填入`npm i`
1. Start Command：填入`node main.js`

![render 8](https://i.imgur.com/PrbyGdX.png)

接下來選擇方案，我們選擇Free就好了

![render 9](https://i.imgur.com/Zv0T0YC.png)

最後就可以按下Deploy Web Service了喔

![render 10](https://i.imgur.com/1YB2uY3.png)

---

大約等待三至五分鐘之後，在顯示成功之後，到專案的目錄，記下來專案的連結，如下圖。

![render 11](https://i.imgur.com/Gob6cWL.png)

### 設定cronjob

我們要使用cronJob去實現自動上傳的功能。

> 連結：<https://cron-job.org/en/>

![cron 1](https://i.imgur.com/XG48eja.png)

註冊登入完之後，按一下Create Cronjob

![cron 2](https://i.imgur.com/nngKiTa.png)

接下來填寫跟我一樣的東西，Title也盡量跟我一樣，以免之後搞錯，URL欄位為剛剛你剛剛記的伺服器連結，範例如下</br>

假如你的伺服器連結為

> <https://helloworld.com>

那就請在URL欄位填寫

> <https://helloworld.com/awake>

其餘設定請填入跟我一樣的數值，填好之後按下面的`Create`

![cron 3](https://i.imgur.com/8h1tRpd.png)

接下來再創建一個，把URL原本的`/awake`改成`/wake`，然後時間改成`Every 10 minutes`，如果時間設定錯誤，會有可能導致<span style="color: red;">IG被封禁</span>

假如你的伺服器連結為

> <https://helloworld.com>

那就請在URL欄位填寫

> <https://helloworld.com/wake>

其餘設定請填入跟我一樣的數值，填好之後按下面的`Create`

---

接下來可以去前端那邊繼續操作了

### 進階系統設定

下面的資訊你可能初期用不到，但是如果帳號的知名度達到一定的水準時，可能會需要知道，如果已經覺得特別累的人可以先不用看到這邊。

#### 雙重驗證設定

因為IG會強迫讓一些知名的帳戶使用雙重驗證，下面會介紹如何使用雙重驗證。

說明待上傳 2024/6/29

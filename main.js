import * as dotenv from "dotenv"
dotenv.config()
import { IgApiClient, IgLoginTwoFactorRequiredError } from 'instagram-private-api';
import pkg from 'request-promise';
const { get } = pkg;
import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import Bluebird from 'bluebird';
const app = express()
import { db } from './config.js'
import { doc, updateDoc, getDoc, getDocs, arrayRemove, collection, query, where } from "firebase/firestore";
import fetch, { FormData } from "node-fetch"
const TOKEN = "zddtPm7xjnW6CSEZqIF9pa2pZVS1TlXCvkHoY6MJY6n"
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/wake', async function (req, res) {
    res.json({
        message: 'hello'
    })
    res.status(200)
    await loadData()
})

app.get('/awake', async function (req, res) {
    res.json({
        message: 'hello'
    })
    res.status(200)
})

app.post('/send', async function (req, res) {
    let formdata = new FormData()
    let message = req.body.message;
    let img = req.body.img;
    console.log(message, img);
    formdata.append('message', message)
    formdata.append('imageThumbnail', img)
    formdata.append('imageFullsize', img)
    let resPond = await fetch('https://notify-api.line.me/api/notify', {
        method: 'POST',
        body: formdata,
        headers: {
            Authorization: 'Bearer ' + TOKEN
        }
    })
    let dataRes = await resPond.json()
    if (dataRes.status == 200) {
        res.json({
            message: 'hello'
        })
        res.status(200)
    } else {
        res.json({
            message: 'nono'
        })
    }
})

app.listen(3001)

const basicRef = doc(db, "community", "basic");

async function fakeSave(data) {
    await updateDoc(basicRef, {
        session: JSON.stringify(data)
    });
}

async function sendErrorMessage(){
    let formData = new FormData()
    formData.append('message', 'ig伺服器錯誤。')
    let res = await fetch('https://notify-api.line.me/api/notify', {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: 'Bearer ' + TOKEN
        }
    })
    let data = await res.json();
    if (data.status == 200) {
        console.log('傳送成功');
    }
}

async function loadData() {
    let theNumber = await loadTheNumber()
    if (!theNumber) return
    // get post info
    const community = collection(db, "community");
    const q = query(community, where("id", "==", theNumber));
    const querySnapshot = await getDocs(q);
    let first = true
    querySnapshot.forEach(async (doc) => {
        if (!first) return
        first = false
        await postToInsta(doc.data().img, doc.data().text, theNumber)
        console.log('已上傳一則貼文');
    });
}

async function loadTheNumber() {
    const docSnap = await getDoc(basicRef);
    if (docSnap.exists()) {
        console.log(docSnap.data());
        if (docSnap.data().list.length == 0) {
            console.log('已經沒有待上傳貼文');
            return false;
        } else {
            let data = docSnap.data().list[0].toString()
            console.log(docSnap.data().list);
            return data
        }
    } else {
        return false;
    }
}

async function fakeLoad() {
    const docSnap = await getDoc(basicRef);
    if (!docSnap.exists()) {
        return;
    } else {
        if (docSnap.data().session == "") {
            return;
        } else {
            return docSnap.data().session
        }
    }
}

async function fakeExists() {
    const docSnap = await getDoc(basicRef);
    if (!docSnap.exists()) {
        return false;
    } else {
        if (docSnap.data().session == "") {
            return false;
        } else {
            return true
        }
    }
}


const postToInsta = async (url, time, theNumber) => {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);
    ig.request.end$.subscribe(async () => {
        const serialized = await ig.state.serialize();
        delete serialized.constants;
        await fakeSave(serialized);
    });
    if (await fakeExists()) {
        try {
            await ig.state.deserialize(await fakeLoad());
        } catch (error) {
            await sendErrorMessage()
        }
    } else {
        return Bluebird.try(() => ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD)).catch(
            IgLoginTwoFactorRequiredError,
            async err => {
                const { username, totp_two_factor_on, two_factor_identifier } = err.response.body.two_factor_info;
                // decide which method to use
                const verificationMethod = totp_two_factor_on ? '0' : '1'; // default to 1 for SMS
                // At this point a code should have been sent
                // Get the code
                await new Promise(r => setTimeout(r, 20000));
                const docSnap = await getDoc(basicRef);
                if (!docSnap.exists()) {
                    return;
                } else {
                    if (docSnap.data().code == "") {
                        return;
                    }
                }
                return ig.account.twoFactorLogin({
                    username,
                    verificationCode: docSnap.data().code,
                    twoFactorIdentifier: two_factor_identifier,
                    verificationMethod, // '1' = SMS (default), '0' = TOTP (google auth for example)
                    trustThisDevice: '1', // Can be omitted as '1' is used by default
                });
            },
        ).catch(async (e) => {await sendErrorMessage()});
    }
    const imageBuffer = await get({
        url: url,
        encoding: null,
    });
    await ig.publish.photo({
        file: imageBuffer,
        caption: time
    });
    await updateDoc(basicRef, {
        list: arrayRemove(theNumber)
    });
}




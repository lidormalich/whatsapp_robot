const fs = require("fs");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const mongoose = require("mongoose");
const WaMSG = require("./models/WaMSG");
const axios = require("axios");
const {
    checkImeiHot,
    checkImeiPelephone,
    checkImeiPartner,
    checkImeiCelcom,
} = require("./extra/checkImei");
const User = require("./models/User");
const { checkHadran, updateHadranSW, updateHadranSupport, addHadranDevice } = require("./extra/checkHadran");
const { Admin } = require("mongodb");
const { checkIfIsAdmin, editUserPermission, editUserBlock, editUserPermissionHadran } = require("./extra/Users");
require("dotenv").config();

mongoose.Promise = global.Promise;
mongoose
    .connect(process.env.DB, { useNewUrlParser: true })
    .then(() => console.log("conected to Database"))
    .catch((err) => console.log(err));

const SESSION_FILE_PATH = "./session.json"; // Path where the session data will be stored
// let lastMSG = "";
// Load the session data if it has been previously saved
let sessionData = "";
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({ authStrategy: new LocalAuth() }); // Use the saved values Token
console.log("Initializing...");
client.initialize();

const readIMEIStatus = async (imei, name) => {
    let hot = await checkImeiHot(imei);
    let pelephone = await checkImeiPelephone(imei);
    let partner = await checkImeiPartner(imei);
    let cellcom = await checkImeiCelcom(imei);
    // console.log({ hot, pelephone, partner, cellcom });
    let time = await getTimeStamp();
    return `שלום ${name} 
   הIMEI נשלח לבדיקה והנה התוצאות:
  המכשיר   *${imei}* נמצא במאגר החברות בסטטוס הבא: 
  בהוט מובייל ${!hot ? "מדווח נקי✅" : "מדווח כלוסט❌"}
  בפלאפון ${!pelephone ? "מדווח נקי✅" : "מדווח כלוסט❌"}
  בפרטנר ${!partner ? "מדווח נקי✅" : "מדווח כלוסט❌"}
  בסלקום ${!cellcom ? "מדווח נקי✅" : "מדווח כלוסט❌"}

  *מעודכן לתאריך ${time}*
  `;
};
const updatelastMSG = async (lastMSG, phone) => {
    let check = await User.findOneAndUpdate(
        { number: phone },
        { lastMSG },
        { new: true }
    );
    return check;
};
const getTimeStamp = async () => {
    const options = {
        url: "http://worldtimeapi.org/api/timezone/Asia/Jerusalem",
        method: "GET",
    };

    let res = await axios(options);
    date = new Date(res?.data?.datetime);
    let time = (date.getDate().toString().length > 1 ? date.getDate() : "0" + date.getDate()) +
        "/" + (date.getMonth().toString().length > 1 ? date.getMonth() : "0" + date.getMonth()) +
        "/" + date.getFullYear() +
        " " + (date.getHours().toString().length > 1 ? date.getHours() : "0" + date.getHours()) +
        ":" + (date.getMinutes().toString().length > 1 ? date.getMinutes() : "0" + date.getMinutes());

    // let newDate =
    //     date.getDate() +
    //     "/" +
    //     (date.getMonth() + 1) +
    //     "/" +
    //     date.getFullYear() +
    //     " " +
    //     date.getHours() +
    //     ":" +
    //     date.getMinutes() +
    //     ":" +
    //     date.getSeconds();
    return time;
};
const ImagetoDataURLBase64 = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    }))


client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});
client.on("ready", async () => {
    console.log("Client is ready!");
    const number = "0526761204"; //   Message to Admin

    const sanitized_number = number.toString().replace(/[- )(]/g, "");
    const final_number = `972${sanitized_number.substring(
        sanitized_number.length - 10
    )}`;
    const number_details = await client.getNumberId(final_number); // get mobile number details
    if (number_details) {
        let time = await getTimeStamp();
        const sendMessageData = await client.sendMessage(
            number_details._serialized,
            "המערכת עלתה מחדש ✅" + time
        );
    } else {
        console.log(final_number, "Mobile number is not registered");
    }
});

client.on("message", async (message) => {
    let havereplay = false;
    let media = "", lastMSG = "";

    const contact = await message.getContact();
    const name = contact.pushname;
    const msg = message.body;
    const msgfrom = message.from;

    const chat = await message.getChat();

    let userInfo = await User.find({ number: message.from });
    if (!userInfo[0]) {
        userInfo = await User.create({ number: message.from, lastMSG: "", isBlock: false, isHadran: false });
        media = await MessageMedia.fromUrl('https://i.imgur.com/43Rj0m0.png');
        chat.sendMessage(media);
        client.sendMessage(msgfrom, "שלום וברוכים הבאים לרובוט לעזרה רשום עזרה");
    }
    lastMSG = userInfo[0]?.lastMSG;
    if (userInfo[0].isBlock) return;
    const time = await getTimeStamp();
    const isAdmin = await checkIfIsAdmin(message.from)
    const isHadran = userInfo[0].isHadran;
    console.log({ message: msg, from: message.from, isAdmin });

    //   get all arry message
    let arrMSG = await WaMSG.find({});
    //   check last msg remmber
    switch (lastMSG) {
        case "בדיקת IMEI":
            let cleanLostRes = await readIMEIStatus(msg, name);
            client.sendMessage(msgfrom, cleanLostRes);
            havereplay = true;
            updatelastMSG(msg, msgfrom);
            break;
        case "הדרן":
            updatelastMSG(msg, msgfrom);
            let res = await checkHadran(msg);
            res += `
             *מעודכן לתאריך ${time}*`;
            client.sendMessage(msgfrom, res);
            havereplay = true;
            break;
        case "עדכון מכשיר הדרן":
            if (isAdmin || isHadran) {
                let respo1 = await updateHadranSupport(msg);
                respo1 += `
             *מעודכן לתאריך ${time}*`
                client.sendMessage(msgfrom, respo1);
            } else {
                client.sendMessage(msgfrom, "אין הרשאות מתאימות" + `
             *מעודכן לתאריך ${time}*`)
            }
            havereplay = true;
            break;
        case "עדכון גרסאות הדרן":
            if (isAdmin || isHadran) {
                let res2 = await updateHadranSW(msg);
                client.sendMessage(msgfrom, res2); res2 += `
             *מעודכן לתאריך ${time}*`
            } else {
                client.sendMessage(msgfrom, "אין הרשאות מתאימות" + `
             *מעודכן לתאריך ${time}*`)
            }
            havereplay = true;
            break;
        case "עריכת אדמין": if (isAdmin) {
            let res4 = await editUserPermission(msg);
            res4 += `
             *עודכן בתאריך ${time}*`;
            client.sendMessage(msgfrom, res4);

        } else {
            client.sendMessage(msgfrom, "פקודה לא חוקית")
        }
            havereplay = true;
            break;
        case "עריכת חסימה אדמין":
            if (isAdmin) {
                let res4 = await editUserBlock(msg);
                res4 += `
             *עודכן בתאריך ${time}*`;
                client.sendMessage(msgfrom, res4);

            } else {
                client.sendMessage(msgfrom, "פקודה לא חוקית")
            }
            havereplay = true;
            break;
        case "הוספת מכשיר":
            if (isAdmin || isHadran) {
                let res3 = await addHadranDevice(msg);
                client.sendMessage(msgfrom, res3); res3 += `
             *מעודכן לתאריך ${time}*`
            } else {
                client.sendMessage(msgfrom, "אין הרשאות מתאימות" + `
             *מעודכן לתאריך ${time}*`)
            }
            havereplay = true;
            break;
        case "שליחת הודעה אדמין":
            if (isAdmin) {
                let number = info.slice(0, info.indexOf(' '));
                if (!number.endsWith('@c.us')) { number = number + "@c.us" }
                let message = info.slice(info.indexOf(' ') + 1, info.length);

                client.sendMessage(phone, message);
                client.sendMessage(msgfrom, "נשלח בהצלחה"
                    + `
             *מעודכן לתאריך ${time}*`);

            } else {
                client.sendMessage(msgfrom, "פקודה לא חוקית")
            }
            havereplay = true;
            break;
        case "עריכת משתמש הדרן":
            if (isAdmin) {
                let res5 = await editUserPermissionHadran(msg);
                res5 += `
             *עודכן בתאריך ${time}*`;
                client.sendMessage(msgfrom, res5);

            } else {
                client.sendMessage(msgfrom, "פקודה לא חוקית")
            }
            havereplay = true;
            break;
        default:
            break;
    }

    msg.toUpperCase();
    console.log({ msg });
    for (const item of arrMSG) {

        if (msg === item.roll) {
            switch (msg) {
                case "בדיקת IMEI":
                    media = await MessageMedia.fromUrl('https://www.imei.info/static/imei/img/illustration1.png');
                    chat.sendMessage(media);
                    updatelastMSG(msg, msgfrom);
                    client.sendMessage(msgfrom, item.res);
                    havereplay = true;
                    break;
                case "הדרן":
                    media = await MessageMedia.fromUrl('https://haredimnet.co.il/user_images/businesses_index/biz_11803076.jpg');
                    chat.sendMessage(media);
                    client.sendMessage(msgfrom, item.res);
                    updatelastMSG(msg, msgfrom);
                    havereplay = true;
                    break;
                case "עדכון מכשיר הדרן":
                    client.sendMessage(msgfrom, item.res);
                    updatelastMSG(msg, msgfrom);
                    havereplay = true;
                    break;
                case "עדכון גרסאות הדרן":
                    client.sendMessage(msgfrom, item.res);
                    updatelastMSG(msg, msgfrom);
                    havereplay = true;
                    break;
                case "הוספת מכשיר":
                    client.sendMessage(msgfrom, item.res);
                    updatelastMSG(msg, msgfrom);
                    havereplay = true;
                    break;
                case "עריכת אדמין":
                    client.sendMessage(msgfrom, item.res);
                    updatelastMSG(msg, msgfrom);
                    havereplay = true;
                case "עריכת חסימה אדמין":
                    client.sendMessage(msgfrom, item.res);
                    updatelastMSG(msg, msgfrom);
                    havereplay = true;
                    break;
                case "שליחת הודעה אדמין":
                    client.sendMessage(msgfrom, item.res);
                    updatelastMSG(msg, msgfrom);
                    havereplay = true;
                case "עריכת משתמש הדרן":
                    client.sendMessage(msgfrom, item.res);
                    updatelastMSG(msg, msgfrom);
                    havereplay = true;
                    break;

                default:
                    // console.log({ replay: item.res });
                    client.sendMessage(msgfrom, item.res);
                    havereplay = true;
                    //   lastMSG = msg;
                    updatelastMSG(msg, msgfrom);
                    break;
            }
        }
    }

    if (msg === "30 תפוצה") {
        updatelastMSG(msg, msgfrom);
        client.getChats().then((chats) => {
            let myGroup = chats.filter((chat) => chat.isGroup == true);
            // console.log({ myGroup });
            for (const group of myGroup) {
                console.log(`Massage to group ${group.name} was send`);
                client.sendMessage(group?.id?._serialized, "בדיקה test");
                havereplay = true;
            }
        });
    }
    updatelastMSG(msg, msgfrom);
    if (!havereplay) {
        updatelastMSG("", msgfrom);
        client.sendMessage(
            msgfrom,
            `סליחה אבל לא הצלחתי להבין אותך חבר, הפקודה לא רשומה במאגר.
      אנא נסה שוב בעוד ${(Math.random() + "").substring(2, 4)} שניות`
        );
    }
});

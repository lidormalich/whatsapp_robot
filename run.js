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
} = require("./checkImei");
const User = require("./models/User");
const { checkHadran, updateHadranSW, updateHadranSupport, addHadranDevice } = require("./checkHadran");
const { Admin } = require("mongodb");
const { checkIfIsAdmin, editUser } = require("./Users");
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
    let media = "";
    const chat = await message.getChat();
    let lastMSG = await User.find({ number: message.from });
    if (!lastMSG[0]) {
        lastMSG = await User.create({ number: message.from, lastMSG: "" });
    }
    lastMSG = lastMSG[0]?.lastMSG;
    const contact = await message.getContact();
    const name = contact.pushname;
    const msg = message.body;
    const msgfrom = message.from;
    const time = await getTimeStamp();
    const isAdmin = await checkIfIsAdmin(message.from)
    console.log({ message: msg, from: message.from, isAdmin, isAdmin: false });

    //   get all arry message
    let arrMSG = await WaMSG.find({});
    //   check last msg remmber
    switch (lastMSG) {
        case "בדיקת IMEI":
            let cleanLostRes = await readIMEIStatus(msg, name);
            // console.log({ response: cleanLostRes });
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
            if (isAdmin) {
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
            if (isAdmin) {
                let res2 = await updateHadranSW(msg);
                client.sendMessage(msgfrom, res2); res2 += `
             *מעודכן לתאריך ${time}*`
            } else {
                client.sendMessage(msgfrom, "אין הרשאות מתאימות" + `
             *מעודכן לתאריך ${time}*`)
            }
            havereplay = true;
            break;
        case "עריכת אדמין":
            if (isAdmin) {
                let res3 = await editUser(msg);
                res3 += `
             *עודכן בתאריך ${time}*`;
                client.sendMessage(msgfrom, res3);

            } else {
                client.sendMessage(msgfrom, "אין הרשאות מתאימות" + `
             *מעודכן לתאריך ${time}*`)
            }
            havereplay = true;
            break;
        case "הוספת מכשיר":
            if (isAdmin) {
                let res3 = await addHadranDevice(msg);
                client.sendMessage(msgfrom, res3); res3 += `
             *מעודכן לתאריך ${time}*`
            } else {
                client.sendMessage(msgfrom, "אין הרשאות מתאימות" + `
             *מעודכן לתאריך ${time}*`)
            }
            havereplay = true;
            break;

        default:
            break;
    }


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

const HadranModel = require("../models/HadranModel");
const User = require("../models/User");


const checkIfIsAdmin = async (number) => {
  let numberToCheck = number;
  if (!numberToCheck.endsWith('@c.us')) { numberToCheck = numberToCheck + "@c.us" }
  let [userInfo] = await User.find({ number: numberToCheck });
  if (userInfo.number == numberToCheck) {
    return userInfo.isAdmin || false;
  }
  return false;
}
async function editUserPermission(info, client) {
  try {
    let numberOem = info;
    let number = info.slice(0, info.indexOf(' '));
    if (!isNumeric(number)) return client.sendMessage(msgfrom, "מספר לא חוקי")

    if (!number.endsWith('@c.us')) { number = number + "@c.us" }
    let isAdmin1 = info.slice(info.indexOf(' ') + 1, info.length);
    let isAdmin;

    switch (isAdmin1) {
      case "הסרה":
        isAdmin = false;
        break;
      case "הוספה":
        isAdmin = true;
        break;
      default:
        isAdmin = false;
        break;
    }


    let UserDB = await User.findOneAndUpdate({ number }, { isAdmin },
      { new: true });

    if (!UserDB) {
      return "לא נמצא משתמש";
    }
    return `המשתמש ${numberOem} עודכן בהצלחה`;
  } catch (error) {
    console.log(error);
  }
}
async function editUserPermissionHadran(info, client) {
  try {
    let numberOem = info;
    let number = info.slice(0, info.indexOf(' '));
    if (!isNumeric(number)) return client.sendMessage(msgfrom, "מספר לא חוקי")

    if (!number.endsWith('@c.us')) { number = number + "@c.us" }
    let isHadran1 = info.slice(info.indexOf(' ') + 1, info.length);
    let isHadran;

    switch (isHadran1) {
      case "הסרה":
        isHadran = false;
        break;
      case "הוספה":
        isHadran = true;
        break;
      default:
        isHadran = false;
        break;
    }


    let UserDB = await User.findOneAndUpdate({ number }, { isHadran },
      { new: true });

    if (!UserDB) {
      return "לא נמצא משתמש";
    }
    return `המשתמש ${numberOem} עודכן בהצלחה`;
  } catch (error) {
    console.log(error);
  }
}
async function editUserBlock(info, client) {
  try {
    let numberOem = info;
    let number = info.slice(0, info.indexOf(' '));
    if (!isNumeric(number)) return client.sendMessage(msgfrom, "מספר לא חוקי")

    if (!number.endsWith('@c.us')) { number = number + "@c.us" }
    let isBlock1 = info.slice(info.indexOf(' ') + 1, info.length);
    let isBlock;

    switch (isBlock1) {
      case "חסימה":
        isBlock = true;
        break;
      case "פתיחה":
        isBlock = false;
        break;
      default:
        isBlock = false;
        break;
    }


    let UserDB = await User.findOneAndUpdate({ number }, { isBlock },
      { new: true });

    if (!UserDB) {
      return "לא נמצא משתמש";
    }
    return `המשתמש ${numberOem} עודכן בהצלחה`;
  } catch (error) {
    console.log(error);
  }
}
module.exports = { checkIfIsAdmin, editUserPermission, editUserBlock, editUserPermissionHadran };

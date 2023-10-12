const HadranModel = require("../models/HadranModel");
const User = require("../models/User");


const checkIfIsAdmin = async (number) => {
  let numberToCheck = number;
  if (!numberToCheck.endsWith('@c.us')) { numberToCheck = numberToCheck + "@c.us" }
  let [userInfo] = await User.find({ number: numberToCheck });
  if (userInfo.number == numberToCheck) {
    return userInfo.isAdmin;
  }
  return false;
}
async function editUser(info) {
  try {
    let numberOem = info;
    let number = info.slice(0, info.indexOf(' '));
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
module.exports = { checkIfIsAdmin, editUser };

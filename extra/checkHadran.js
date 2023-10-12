const HadranModel = require("../models/HadranModel");

async function checkHadran(model) {
  try {
    model = model.toUpperCase();
    let [modelCheck] = await HadranModel.find({ model });

    if (!modelCheck) {
      return "מכשיר לא נתמך כרגע";
    }

    let support = modelCheck?.support;
    if (!support) {
      console.log({ support });
      return "מכשיר לא נתמך כרגע";
    }

    let res = `המכשיר ${model} - ${modelCheck.name} נתמך בהתקנת הדרן
  אלה כל הגרסאות שמתאימות לצריבה: ${modelCheck.sw}`;
    return res;
  } catch (error) {
    console.log(error);
  }
}
async function updateHadranSupport(modelSupportStr) {
  try {
    let phoneModel = modelSupportStr.slice(0, modelSupportStr.indexOf(' '));
    phoneModel = phoneModel.toUpperCase();
    const phoneSupport = modelSupportStr.slice(modelSupportStr.indexOf(' ') + 1, modelSupportStr.length);
    console.log({ phoneModel, phoneSupport });
    let support = false;
    if (phoneSupport == "תומך") support = true
    if (phoneSupport == "לא תומך") support = false
    const doc = await HadranModel.findOneAndUpdate(
      { model: phoneModel },
      { support: support },
      { new: true }
    );
    if (!doc) return "נא להוסיף קודם מכשיר, מכשיר לא רשום בשרת \n אם הוספת את המכשיר- אנא ודא שרשמת בצורה הנכונה את הפרטים";
    else return "עודכן בהצלחה";
  } catch (error) {
    console.log(error);
  }
}
async function updateHadranSW(modelSupportStr) {
  try {
    console.log("SW");
    let phoneModel = modelSupportStr.slice(0, modelSupportStr.indexOf(' '));
    phoneModel = phoneModel.toUpperCase();
    const phoneSupportSW = modelSupportStr.slice(modelSupportStr.indexOf(' ') + 1, modelSupportStr.length);
    console.log({ phoneModel, phoneSupportSW });

    const doc = await HadranModel.findOneAndUpdate(
      { model: phoneModel },
      { sw: phoneSupportSW },
      { new: true }
    );
    console.log({ doc });
    if (!doc) return "נא להוסיף קודם מכשיר, מכשיר לא רשום בשרת \n אם הוספת את המכשיר- אנא ודא שרשמת בצורה הנכונה את הפרטים";
    else return "עודכן בהצלחה";
  } catch (error) {
    console.log(error);
  }
}
async function addHadranDevice(modelSupportStr) {
  try {
    const myArray = modelSupportStr.split("\n");

    const doc = await HadranModel.create({ model: myArray[0].toUpperCase(), name: myArray[1].toUpperCase(), support: true, sw: myArray[2].toUpperCase() });
    console.log({ doc });
    if (!doc) return "נכשלה ההוספה";
    else return "נוצר בהצלחה המכשיר";
  } catch (error) {
    console.log(error);
  }
}
module.exports = { checkHadran, updateHadranSW, updateHadranSupport, addHadranDevice };

const axios = require("axios");

async function checkImeiHot(imei) {
  let data = `{"IMEINum":"${imei}"}`;
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.hotmobile.co.il/_layouts/HotMobile/Methods/AjaxMethods.aspx/CheckIMEI",
    headers: {
      Accept: "*/*",
      "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
      Connection: "keep-alive",
      "Content-Type": "application/json; charset=UTF-8",
      Cookie:
        "HMSP_SID=b1xl4mbeisfpborpnbyo5255; __AntiXsrfToken=ae359b4bcb8c415ba0b8ab73a4e39e6d; TS0112b57f=01cbd4f22712c6e62ff102b0e9bd2ae48db45009f299bd28030963c396f6908efa3dcfeaccf8a3a71324fd2e4f8b0d5cd958ed2f73a9fdcd8028172f8be67e810bc42cb7a9d6715d639c965e5286857af624eb6864a410814ef3acca69fa58de9463a9c9de; _gid=GA1.3.182124512.1696882985; _gat=1; _gcl_au=1.1.1887661924.1696882985; _gat_UA-29407913-1=1; __ctmid=6524612a000300da1168fe5a; __ctmid=6524612a000300da1168fe5a; _hjSessionUser_1785630=eyJpZCI6IjdlNzU1Y2Q4LWMwMWEtNTExZC1iOTJlLWY1YjRlNjk4MmU1NCIsImNyZWF0ZWQiOjE2OTY4ODI5ODY0OTMsImV4aXN0aW5nIjpmYWxzZX0=; _hjFirstSeen=1; _hjIncludedInSessionSample_1785630=1; _hjSession_1785630=eyJpZCI6IjJhZDU4OGRhLWM3YWYtNDJhNy05ODkyLWRlMjFkOWU3ZjZmYiIsImNyZWF0ZWQiOjE2OTY4ODI5ODY0OTUsImluU2FtcGxlIjp0cnVlLCJzZXNzaW9uaXplckJldGFFbmFibGVkIjpmYWxzZX0=; outbrain_cid_fetch=true; __za_cds_19761772=%7B%22data_for_campaign%22%3A%7B%22country%22%3A%22IL%22%2C%22language%22%3A%22HE%22%2C%22ip%22%3A%2277.125.45.63%22%2C%22start_time%22%3A1696882987000%2C%22session_groups%22%3A%7B%222191%22%3A%7B%22campaign_Id%22%3A%2254513%22%7D%7D%7D%7D; _ga=GA1.3.985811717.1696882985; __za_cd_19761772=%7B%22visits%22%3A%22%5B1696882988%5D%22%2C%22campaigns_status%22%3A%7B%2281309%22%3A1696882989%2C%2281802%22%3A1696882989%2C%2282259%22%3A1696882989%7D%7D; __za_19761772=%7B%22sId%22%3A34903169%2C%22dbwId%22%3A%221%22%2C%22sCode%22%3A%2260afb119bda72427814ba41a09549b70%22%2C%22sInt%22%3A5000%2C%22na%22%3A3%2C%22td%22%3A-1%2C%22ca%22%3A%221%22%7D; _ga_KD7HJD0FWJ=GS1.1.1696882985.1.0.1696882987.0.0.0; TSa5a3bf83027=08521900f9ab2000f1a83b49bb95defd8272ee8b6eec74a69a92a3f169c17bee71923649e56c923a0840855fe91130003e0875b34b3b7bf463fe57611333138e653b7a4c0ef9c529296b34172be1accfdc647bd0a952a29ef492de1352eb0485; TS0112b57f=01cbd4f2275666bdc186e920ac8f589a19d0a3bd627dcb5d35e515e50f25648cb7b5ceeaee25673166f71e49e5f9ca5423ff529619240da5f3ac4df6f3ed35587f56ef55ffea7c11a6fb434dcdc54a1ce37597bb861f1b970fa262b50c9fafd163038a0d1a; TSa5a3bf83027=08521900f9ab2000c72fd2a556e2995aa83320b2f134df59e56b8cb5b00fed9426d6aa4547708e34084e6381ff1130005feac474cffe34f986749bcb212976c240291bce9cf976928be4775fb1c9f3782841be35e63737fd55b3865a3ac9f099",
      DNT: "1",
      Origin: "https://www.hotmobile.co.il",
      Referer:
        "https://www.hotmobile.co.il/ServiceSupport/Pages/HandsetCheck.aspx",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.188 Safari/537.36 CrKey/1.54.250320",
      "X-Requested-With": "XMLHttpRequest",
    },
    data: data,
  };

  let res = await axios.request(config);
  res?.data?.d == "\"Y\"" ? (res = true) : (res = false);
  console.log({ imeiHOT: res });

  return res;
}
async function checkImeiPartner(imei) {
  let data = JSON.stringify({
    IMEI: imei,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://my.partner.co.il/MiniSitesSrv/LoststolenSrv.svc/Services/GetIMEInew",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
      Connection: "keep-alive",
      "Content-Type": "application/json",
      DNT: "1",
      Origin: "https://www.partner.co.il",
      Referer: "https://www.partner.co.il/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
      appName: "LostStolen",
      brand: "orange",
      category: "Site",
      lang: "he-il",
      platform: "WEB",
      "sec-ch-ua":
        '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      subCategory: "LostStolen",
      Cookie:
        "TS01babcba=015f5af86397737ed8d4237da56ab843d01b0b359703b339613f31b73b6480afb7c999f836bf0b0f823e0ed1f8ac84398df1f2c459",
    },
    data: data,
  };

  let res = await axios.request(config);
  res?.data?.ModelBo?.deviceStatus == "Y" ? (res = true) : (res = false);
  console.log({ imeiPartner: res });


  return res;
}
async function checkImeiPelephone(imei) {
  let data = `{"id":"${imei}"}`;
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.pelephone.co.il/digitalsite/handlers/BlkLst.ashx?action=Check&boneId=10012&nsId=6&ObjId=9973&lcId=1037",
    headers: {
      authority: "www.pelephone.co.il",
      accept: "application/json, text/plain, */*",
      "accept-language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      cookie:
        "DigitalSite_SessionId=yxl44jweuf53eptc5dofq31e; mobile=0; PelephoneLoginSession=CfDJ8KtqDWbje69ChpgjsCzwike8wyQzZ%2FOyDMy%2FYpDsngAkLxb%2BU%2BvN5W0p9MrmrO2X2Sw1A9t%2F4x4SMPdfryfN0CzEsexIInxUde%2FaziocXBNXU6HbtpRbfdrzeCX8Y7WId5hDoGxE96BIa7%2B5GIEe58nd4PBzYu4BKUDholhmBKmq; ga-custom3=uVq1VkCZaO70OOov_1696882839223; _gcl_au=1.1.695339803.1696882839; _gid=GA1.3.964424169.1696882840; _tt_enable_cookie=1; _ttp=GJ-4pGb9LnOREnagAZau77jZ-rg; TS01a1afdc=0136294d16e1927452085edd5d47189c945ba0aa1232a7948bfbb237021315bd88cb51252e7db53421867a893058a8969de0178d3e; ga-custom2=i7moq9xMzdH6yhs0_1696929680216__null; usfu_kjFowRKJeNqCHeb6mixz_fA%3d%3d=true; TS9e80928c029=082be53889ab280055614cca360aa4b84fe362264b2f99f2e7db17a057ca589885746442f60cd2fb3c1517454612193e; pele_f5_waf_.pelephone.co.il_%2F_wlf=AAAAAAUcZI15gCQuVldSfy7xh-Et0u8kRpLzxMj5HICowEVgaBGCjgPENdRIisAtJ7XusfakmwnopgdtzymYHZhJLMq0&; _ga=GA1.3.2144465440.1696882840; _gat_UA-1374769-1=1; _hjSessionUser_325434=eyJpZCI6IjFhYzE4OGYyLWJhMDgtNTZjZC1iNmRiLTEwODU1Y2E1YzBhNiIsImNyZWF0ZWQiOjE2OTY4ODI4NDA3OTIsImV4aXN0aW5nIjp0cnVlfQ==; _hjIncludedInSessionSample_325434=0; _hjSession_325434=eyJpZCI6IjhlOTU5ODY5LWY2ZDItNDQ1YS1iNTg1LTZhZGE4MjAwMGE1MCIsImNyZWF0ZWQiOjE2OTY5Mjk2NzM2NjMsImluU2FtcGxlIjpmYWxzZSwic2Vzc2lvbml6ZXJCZXRhRW5hYmxlZCI6ZmFsc2V9; _ga_0KP0TXC0NH=GS1.1.1696929673.2.0.1696929679.54.0.0; TScd8f0111027=082be53889ab2000245c06ee2cae1673c028a3d60bcbba6a235708a1caed796cd1c268a970cffc5a082c1c56771130009b2c23c4183b40c481a4eb0d369c3eebe046631e7b1220a4f36ac51193733e0e32e01123a73cc69a0564bacc3aa332c3; _dd_s=rum=1&id=821ae4f3-f32b-4442-9c21-f54bc462692f&created=1696929671653&expire=1696930594995; TScd8f0111027=082be53889ab2000c44401430d437f2674f14b72b9ee1f7c40b094c3a731509cfa1cd43ba9036dbf08b97cd8c0113000a0141506f1be6cd38e885ae589fe4fb60e30148f47c4cf384a93fbea33cc6b56112cd7b4ed8ab8a4b47223bf60bef203",
      dnt: "1",
      origin: "https://www.pelephone.co.il",
      referer:
        "https://www.pelephone.co.il/digitalsite/heb/self-service/operating-line/line-block/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.188 Safari/537.36 CrKey/1.54.250320",
    },
    data: data,
  };
  let res = await axios.request(config);

  res?.data?.isDeviceInBlackList == true ? (res = true) : (res = false);
  console.log({ checkImeiPelephone: res });

  return res;
}
async function checkImeiCelcom(imei) {
  let data = `ImeiNumber=${imei}`;

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://private.cellcom.co.il/api/all/ImeiDetails/GetImeiDetails',
    headers: {
      'authority': 'private.cellcom.co.il',
      'accept': 'application/json, text/javascript, */*; q=0.01',
      'accept-language': 'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'cookie': 'TS0151143a=0130af7cbf5257722fde0722a41296b0c60cb05975ece3e7cbcb904644466d03c1e388a5e822c0df2d951c9519f343591d890fd0482af6100505c3cd2d7c31ee98e4e1ce4a; _ga=GA1.3.462732847.1696946882; _gid=GA1.3.1190201710.1696946882; _gat_gtag_UA_1963303_35=1; _gcl_au=1.1.1994826395.1696946882; _hjSessionUser_1893954=eyJpZCI6IjkxMmEwMjkzLTQwZDktNTU3MS1iMTkyLTFhZTFjNDRlZDFiMSIsImNyZWF0ZWQiOjE2OTY5NDY4ODMxMDAsImV4aXN0aW5nIjpmYWxzZX0=; _hjFirstSeen=1; _hjIncludedInSessionSample_1893954=0; _hjSession_1893954=eyJpZCI6IjYyMGVjYzZhLWVlMzgtNDJmOS1hYWViLWZhNTJkZTBkOWU3ZiIsImNyZWF0ZWQiOjE2OTY5NDY4ODMxMDIsImluU2FtcGxlIjpmYWxzZSwic2Vzc2lvbml6ZXJCZXRhRW5hYmxlZCI6ZmFsc2V9; __za_cds_19763655=%7B%22data_for_campaign%22%3A%7B%22country%22%3A%22IL%22%2C%22language%22%3A%22HE%22%2C%22ip%22%3A%2277.125.45.63%22%2C%22start_time%22%3A1696946883000%2C%22session_campaigns%22%3A%7B%2286145%22%3A%7B%22type%22%3A%22top-bar%22%2C%22occur%22%3A1%7D%7D%7D%7D; __za_19763655=%7B%22sId%22%3A4648218%2C%22dbwId%22%3A%221%22%2C%22sCode%22%3A%22c1f21065151a4de240a4c40f72c8e0ec%22%2C%22sInt%22%3A5000%2C%22na%22%3A1%2C%22td%22%3A0%2C%22ca%22%3A%221%22%7D; __za_cd_19763655=%7B%22visits%22%3A%22%5B1696946884%5D%22%2C%22campaigns_status%22%3A%7B%2286145%22%3A1696946884%7D%7D; __RequestVerificationToken=I_ULdOPncmIv08CVwjq01e-YhIFnGhb-KEymL0EgnVB6OZ3fijpWMty689sEJGRkfDcb_CQ67zkz5nKYyUFRUTg2GAlneAEYviNJmgCsJ9I1; BIGipServerpool_digital_epi=1836624064.20480.0000; TS01bade11=0130af7cbf5233a740b61950d34637fdeb0587c0b8ae038602f7e78a8a66bb0de09ba8e6739649b417bd4811607818ec4cdab1daabe44330075b4d1bc35269bb3db0caf30142123a752ee84aabbc6cca9ff606e51809ed7ed22f80023abbc67ccb56c9d52f392442c6114175f221e0d6e6e047ff6a; _ga_RGCZL1B8GN=GS1.1.1696946882.1.0.1696946895.0.0.0; _gat=1; _ga=GA1.4.462732847.1696946882; _gid=GA1.4.1190201710.1696946882; _gat_gtag_UA_1963303_1=1; _gali=imei-button; ASP.NET_SessionId=gfgck1e0zmy0iehoqhuzfz5h; TS01bade11=0130af7cbf4bc413f9cbd292010c7c5218a8b3d81cae038602f7e78a8a66bb0de09ba8e6739649b417bd4811607818ec4cdab1daab0b909e071c1e9c8fe1ec62ac9c18230b588d28da2e3ea9d420f1f0f479352e446bb7ee5b5573e814d59ceeea836b330ce6b14257d1b793423986232b8deff867',
      'dnt': '1',
      'origin': 'https://private.cellcom.co.il',
      'referer': 'https://private.cellcom.co.il/support/cellular/check/',
      'sec-ch-ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
      'x-requested-with': 'XMLHttpRequest'
    },
    data: data
  };
  let res = await axios.request(config);

  res?.data?.ImeiStatus == "חסום" ? (res = true) : (res = false);
  console.log({ checkImeiPelephone: res });

  return res;
}
module.exports = { checkImeiHot, checkImeiPelephone, checkImeiPartner, checkImeiCelcom };

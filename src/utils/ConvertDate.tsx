import moment from "moment-timezone";
export default function ConvertDate(time: any) {
  const vietnamTime = moment(time)
    .tz("Asia/Ho_Chi_Minh") // Đặt múi giờ Việt Nam
    .format("HH:mm:ss, DD/MM/YY");

  return vietnamTime;
}

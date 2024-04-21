export default function GetNumberInString(str: string): string | null {
  var so = str.match(/\d/g);
  return so ? so.join("") : null;
}

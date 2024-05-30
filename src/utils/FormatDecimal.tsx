export default function FormatDecimal(number: string | number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "decimal",
  }).format(Number(number));
}

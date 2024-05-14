import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function getFormattedDate() {
  const timeZone = "Europe/Paris";
  const now = new Date();
  const zonedDate = toZonedTime(now, timeZone);

  return format(zonedDate, "dd/MM/yyyy HH:mm", { timeZone });
}

import { renderStatusInfo } from "./render";

let command = ":";
const uselessKeyEvents = ["Shift", "Control"]

export default function handleCommandInput(e: KeyboardEvent) {
    if (uselessKeyEvents.includes(e.key)) {
        return;
    }

    if (e.key === "Backspace") {
        command = command.substring(0, Math.max(1, command.length - 1));
    } else if (e.key === ":" && command.length > 1) {
        command = command + e.key;
    } else {
        command += e.key;
    }
  renderStatusInfo(command, "green");
}

import { renderStatusInfo } from "./render";

let command = ":";

export default function handleCommandInput(e: KeyboardEvent) {
    if (e.key === "Backspace") {
        command = command.substring(0, command.length - 1);
    } else if (e.key === ":" && command.length >= 1) {
        command = command + e.key;
    } else {
        command += e.key;
    }
  renderStatusInfo(command, "green");
}

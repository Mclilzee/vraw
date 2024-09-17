import { renderStatusInfo } from "./render";

let command = "";
export default function handleCommandInput(e: KeyboardEvent) {
    switch (e.key) {
        case "Shift":
        case "Control": break;
        case "Escape": command = ""; break;
        case "Enter": processCommand(); break;
        case "Backspace": command = command.substring(0, Math.max(1, command.length - 1)); break;
        default: command += e.key; break;
    }

    renderStatusInfo(command, "green");
}

function processCommand() {
    command = "";
}

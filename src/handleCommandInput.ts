import { renderStatusInfo } from "./render";

let command = "";

export default function handleCommandInput(e: KeyboardEvent) {
    command += e.key;
  renderStatusInfo(command, "green");
}

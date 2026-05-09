import { Alert } from "./Alert";

export default {
  title: "Components/Alert",
  component: Alert,
  argTypes: {
    variant: { control: "select", options: ["success", "warning", "danger", "info"] },
  },
};

export const Playground = {
  args: {
    title: "Figma Sync Complete",
    description: "All token variables were synced successfully.",
    variant: "info",
  },
};
import { Badge } from "./Badge";

export default {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    variant: { control: "select", options: ["success", "warning", "danger", "info"] },
  },
};

export const Playground = {
  args: {
    children: "Synced",
    variant: "success",
  },
};
import { Select } from "./Select";

export default {
  title: "Components/Select",
  component: Select,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    radius: { control: "select", options: ["sm", "md", "lg", "xl", "full"] },
  },
};

export const Playground = {
  args: {
    label: "Preferred Location",
    size: "md",
    radius: "md",
    options: ["Dubai", "Abu Dhabi", "Sharjah"],
  },
};
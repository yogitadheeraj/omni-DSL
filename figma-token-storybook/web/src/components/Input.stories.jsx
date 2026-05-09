import { Input } from "./Input";

export default {
  title: "Components/Input",
  component: Input,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    radius: { control: "select", options: ["sm", "md", "lg", "xl", "full"] },
    disabled: { control: "boolean" },
  },
};

export const Playground = {
  args: {
    label: "Full Name",
    placeholder: "Enter full name",
    size: "md",
    radius: "md",
    error: "",
    disabled: false,
  },
};
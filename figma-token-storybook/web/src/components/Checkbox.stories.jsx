import { Checkbox } from "./Checkbox";

export default {
  title: "Components/Checkbox",
  component: Checkbox,
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export const Playground = {
  args: {
    label: "I agree to receive updates",
    checked: false,
    disabled: false,
  },
};
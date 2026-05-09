import { Modal } from "./Modal";

export default {
  title: "Components/Modal",
  component: Modal,
  argTypes: {
    open: { control: "boolean" },
  },
};

export const Playground = {
  args: {
    open: true,
    title: "Confirm Booking",
    description: "Are you sure you want to book this test drive?",
  },
};
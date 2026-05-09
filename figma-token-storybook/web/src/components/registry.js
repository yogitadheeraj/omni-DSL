import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { Checkbox } from "./Checkbox";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Alert } from "./Alert";
import { Tabs } from "./Tabs";
import { Modal } from "./Modal";
import { VehicleCard } from "./VehicleCard";
import { LeadForm } from "./LeadForm";
import { OTPForm } from "./OTPForm";

export const componentRegistry = [
  {
    name: "Button",
    group: "Components",
    component: Button,
    controls: {
      size: ["sm", "md", "lg", "xl"],
      variant: ["primary", "secondary", "outline", "ghost", "danger"],
      radius: ["sm", "md", "lg", "xl", "full"],
    },
    defaultProps: { children: "Book Test Drive", size: "md", variant: "primary", radius: "md" },
  },
  {
    name: "Input",
    group: "Components",
    component: Input,
    controls: { size: ["sm", "md", "lg", "xl"], radius: ["sm", "md", "lg", "xl"] },
    defaultProps: { label: "Full Name", placeholder: "Enter full name" },
  },
  {
    name: "Select",
    group: "Components",
    component: Select,
    controls: { size: ["sm", "md", "lg", "xl"], radius: ["sm", "md", "lg", "xl"] },
    defaultProps: { label: "Location", options: ["Dubai", "Abu Dhabi", "Sharjah"] },
  },
  { name: "Checkbox", group: "Components", component: Checkbox, defaultProps: { label: "I agree" } },
  { name: "Card", group: "Components", component: Card, defaultProps: { title: "Card", description: "Token based card" } },
  { name: "Badge", group: "Components", component: Badge, controls: { variant: ["success", "warning", "danger", "info"] }, defaultProps: { children: "Synced", variant: "success" } },
  { name: "Alert", group: "Components", component: Alert, controls: { variant: ["success", "warning", "danger", "info"] }, defaultProps: { title: "Alert", description: "Token based alert" } },
  { name: "Tabs", group: "Components", component: Tabs, defaultProps: { items: ["Overview", "Specs", "Pricing"] } },
  { name: "Modal", group: "Components", component: Modal, defaultProps: { open: true } },
  { name: "VehicleCard", group: "Automotive", component: VehicleCard, defaultProps: { name: "Polestar 2", price: "AED 189,000" } },
  { name: "LeadForm", group: "Automotive", component: LeadForm, defaultProps: {} },
  { name: "OTPForm", group: "Automotive", component: OTPForm, defaultProps: {} },
];
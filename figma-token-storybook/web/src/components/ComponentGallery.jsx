import React from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { Checkbox } from "./Checkbox";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Alert } from "./Alert";
import { Tabs } from "./Tabs";
import { VehicleCard } from "./VehicleCard";
import { LeadForm } from "./LeadForm";
import { OTPForm } from "./OTPForm";

export function ComponentGallery() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Token Driven Component Gallery</h1>
          <p className="mt-2 text-slate-500">All components below use Figma variables through CSS variables.</p>
        </div>

        <Section title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </Section>

        <Section title="Forms">
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Name" placeholder="Enter name" />
            <Select label="Location" />
            <Checkbox label="Accept terms and conditions" />
          </div>
        </Section>

        <Section title="Status">
          <div className="flex flex-wrap gap-3">
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Alert variant="success" title="Synced" description="Figma variables are synced successfully.d" />
            <Alert variant="warning" title="Review Required" description="Some tokens need business approval." />
          </div>
        </Section>

        <Section title="Cards and Tabs">
          <div className="grid gap-5 md:grid-cols-2">
            <Card title="Brand Card" description="This card is fully token driven." />
            <Tabs />
          </div>
        </Section>

        <Section title="Automotive Components">
          <div className="grid gap-5 lg:grid-cols-3">
            <VehicleCard />
            <LeadForm />
            <OTPForm />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}
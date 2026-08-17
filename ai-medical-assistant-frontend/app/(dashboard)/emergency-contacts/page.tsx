"use client";

import { useState } from "react";
import {
  Edit2,
  HeartPulse,
  Loader2,
  Phone,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";

import type { EmergencyContact } from "@/types/emergency-contact";

interface ContactFormProps {
  initialContact?: EmergencyContact;
  isSubmitting: boolean;
  onSubmit: (
    name: string,
    relation: string,
    phone: string,
  ) => Promise<void>;
  onCancel: () => void;
}

function ContactForm({
  initialContact,
  isSubmitting,
  onSubmit,
  onCancel,
}: ContactFormProps) {
  const [name, setName] = useState(initialContact?.name ?? "");
  const [relation, setRelation] = useState(
    initialContact?.relation ?? "",
  );
  const [phone, setPhone] = useState(initialContact?.phone ?? "");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter the contact name.");
      return;
    }

    if (!relation.trim()) {
      setError("Please enter the relationship.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter the phone number.");
      return;
    }

    try {
      await onSubmit(
        name.trim(),
        relation.trim(),
        phone.trim(),
      );
    } catch {
      setError("Unable to save the contact. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-teal-100 bg-teal-50/50 p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            {initialContact
              ? "Edit emergency contact"
              : "Add emergency contact"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Keep someone you trust available for emergencies.
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="contact-name"
            className="text-sm font-medium text-slate-900"
          >
            Name
          </label>

          <Input
            id="contact-name"
            value={name}
            maxLength={100}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Rahul Sharma"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="contact-relation"
            className="text-sm font-medium text-slate-900"
          >
            Relationship
          </label>

          <Input
            id="contact-relation"
            value={relation}
            maxLength={50}
            onChange={(event) => setRelation(event.target.value)}
            placeholder="e.g. Brother, Mother, Friend"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contact-phone"
          className="text-sm font-medium text-slate-900"
        >
          Phone number
        </label>

        <Input
          id="contact-phone"
          type="tel"
          value={phone}
          maxLength={20}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="e.g. +91 9876543210"
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="bg-teal-700 hover:bg-teal-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              {initialContact ? "Save changes" : "Add contact"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default function EmergencyContactsPage() {
  const {
    listQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useEmergencyContacts();

  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] =
    useState<EmergencyContact | null>(null);

  const contacts = listQuery.data?.data ?? [];

  const handleCreate = async (
    name: string,
    relation: string,
    phone: string,
  ) => {
    await createMutation.mutateAsync({
      name,
      relation,
      phone,
    });

    setShowForm(false);
  };

  const handleUpdate = async (
    name: string,
    relation: string,
    phone: string,
  ) => {
    if (!editingContact) {
      return;
    }

    await updateMutation.mutateAsync({
      id: editingContact.id,
      payload: {
        name,
        relation,
        phone,
      },
    });

    setEditingContact(null);
  };

  const handleDelete = async (contact: EmergencyContact) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${contact.name} from your emergency contacts?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(contact.id);
    } catch {
      // Mutation error state is handled below.
    }
  };

  if (listQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-3 h-9 w-64" />
          <Skeleton className="mt-3 h-5 w-96 max-w-full" />
        </div>

        <Skeleton className="h-32 w-full" />

        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (listQuery.isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8 text-center">
          <p className="font-medium text-red-700">
            Failed to load emergency contacts.
          </p>

          <p className="mt-1 text-sm text-red-600">
            Please refresh the page and try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-teal-700">
            Safety
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Emergency Contacts
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Add trusted people who can be contacted if you need help
            during an emergency.
          </p>
        </div>

        {!showForm && !editingContact && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-teal-700 hover:bg-teal-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        )}
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex items-start gap-3 p-5">
          <HeartPulse className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

          <div>
            <p className="font-medium text-amber-900">
              Keep your emergency contacts up to date
            </p>

            <p className="mt-1 text-sm leading-5 text-amber-800">
              These contacts are stored securely with your account and
              can help you reach someone you trust when needed.
            </p>
          </div>
        </CardContent>
      </Card>

      {showForm && !editingContact && (
        <ContactForm
          isSubmitting={createMutation.isPending}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingContact && (
        <ContactForm
          initialContact={editingContact}
          isSubmitting={updateMutation.isPending}
          onSubmit={handleUpdate}
          onCancel={() => setEditingContact(null)}
        />
      )}

      {deleteMutation.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Unable to delete the emergency contact. Please try again.
        </div>
      )}

      {contacts.length === 0 ? (
        <Card className="border-dashed border-slate-300">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-700">
              <UserRound className="h-6 w-6" />
            </div>

            <p className="mt-4 font-medium text-slate-900">
              No emergency contacts yet
            </p>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              Add a family member, friend, or another trusted person
              who can be contacted if you need help.
            </p>

            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                className="mt-5 bg-teal-700 hover:bg-teal-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add your first contact
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Your contacts
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {contacts.length}{" "}
              {contacts.length === 1 ? "contact" : "contacts"} saved.
            </p>
          </div>

          {contacts.map((contact) => (
            <Card key={contact.id}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900">
                      {contact.name}
                    </h3>

                    <p className="mt-1 text-sm text-teal-700">
                      {contact.relation}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <Phone className="h-4 w-4" />
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 sm:justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowForm(false);
                      setEditingContact(contact);
                    }}
                    disabled={
                      updateMutation.isPending ||
                      deleteMutation.isPending
                    }
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void handleDelete(contact)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-600" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
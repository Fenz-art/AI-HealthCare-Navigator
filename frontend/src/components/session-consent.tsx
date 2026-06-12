"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ConsentProps {
  passportExists: boolean;
  documents: { id: string; title: string }[];
  onAccept: (data: { includePassport: boolean; includedDocuments: string[] }) => void;
}

export function SessionConsent({ passportExists, documents, onAccept }: ConsentProps) {
  const [includePassport, setIncludePassport] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const toggleDoc = (id: string) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Consent for Health Session</h1>
        <p className="text-sm text-slate-600">
          Select the data you want to share with CareCompass for this session. Your travel passport and documents remain private until you choose to include them.
        </p>
      </div>

      {passportExists && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="font-semibold text-slate-900">Travel Health Passport</p>
              <p className="text-sm text-slate-500">Share your allergen, medication, and emergency contact summary.</p>
            </div>
            <Button
              variant={includePassport ? "default" : "outline"}
              onClick={() => setIncludePassport((value) => !value)}
            >
              {includePassport ? "Included" : "Include"}
            </Button>
          </CardContent>
        </Card>
      )}

      {documents.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Health Documents</p>
          {documents.map((doc) => (
            <Card key={doc.id} className="border-slate-200 shadow-sm">
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium text-slate-900">{doc.title}</p>
                  <p className="text-sm text-slate-500">Choose this document to share in the session.</p>
                </div>
                <Button
                  variant={selectedDocs.includes(doc.id) ? "default" : "outline"}
                  onClick={() => toggleDoc(doc.id)}
                >
                  {selectedDocs.includes(doc.id) ? "Shared" : "Share"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-600">No uploaded health documents are available yet. Upload files in the Health Vault to include them in a session.</p>
        </div>
      )}

      <Button className="w-full" onClick={() => onAccept({ includePassport, includedDocuments: selectedDocs })}>
        Continue to session
      </Button>
    </div>
  );
}

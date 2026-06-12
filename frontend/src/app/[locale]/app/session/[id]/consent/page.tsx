"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { api, ApiClientError } from "@/lib/api";
import type { HealthDocument, HealthPassport, TravelHealthSession } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionConsent } from "@/components/session-consent";

export default function SessionConsentPage() {
  const params = useParams() as { locale: string; id: string };
  const router = useRouter();
  const t = useTranslations('consent');

  const [session, setSession] = useState<TravelHealthSession | null>(null);
  const [passport, setPassport] = useState<HealthPassport | null>(null);
  const [documents, setDocuments] = useState<HealthDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const sessionData = await api.getSession(params.id);
        setSession(sessionData);

        if (sessionData.userId) {
          const vault = await api.getHealthVault(sessionData.userId);
          setPassport(vault.healthPassport);
          setDocuments(vault.healthDocuments);
        }
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : "Unable to load consent details.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.id]);

  const handleAccept = async (data: { includePassport: boolean; includedDocuments: string[] }) => {
    if (!session) return;

    setLoading(true);
    setError(null);

    try {
      await api.updateSessionConsent(session.id, data);
      await api.runWorkflow({
        sessionId: session.id,
        lat: session.lat ?? 0,
        lng: session.lng ?? 0,
        countryCode: session.countryCode ?? 'US',
      });
      router.push(`/${params.locale}/app/session/${session.id}`);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to continue to session.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-sm text-slate-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('errorTitle')}</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.refresh()}>{t('retry')}</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {!session ? (
        <Card>
          <CardHeader>
            <CardTitle>{t('missingSessionTitle')}</CardTitle>
            <CardDescription>{t('missingSessionMessage')}</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <SessionConsent
          passportExists={Boolean(passport)}
          documents={documents.map((doc) => ({ id: doc.id, title: doc.title }))}
          onAccept={handleAccept}
        />
      )}
      {session && (
        <Card className="rounded-3xl border-slate-200 bg-slate-50 p-5">
          <CardTitle className="text-base font-semibold">{t('sessionSummary')}</CardTitle>
          <CardDescription>
            {t('sessionSummarySubtitle')}
          </CardDescription>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p><strong>{t('location')}:</strong> {session.location ?? 'Unknown'}</p>
            <p><strong>{t('symptoms')}:</strong> {session.symptoms.join(', ')}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/${params.locale}/app/session/${session.id}`)}>
              {t('goBack')}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

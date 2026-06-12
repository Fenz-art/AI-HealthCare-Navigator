'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const countries = [
  { name: 'United States', code: 'US' },
  { name: 'India', code: 'IN' },
  { name: 'Japan', code: 'JP' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Italy', code: 'IT' },
  { name: 'Spain', code: 'ES' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Australia', code: 'AU' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'South Korea', code: 'KR' },
  { name: 'Sweden', code: 'SE' },
  { name: 'UAE', code: 'AE' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Egypt', code: 'EG' },
];

const languages = [
  { name: 'English', code: 'en' },
  { name: 'Spanish', code: 'es' },
  { name: 'French', code: 'fr' },
  { name: 'German', code: 'de' },
  { name: 'Portuguese', code: 'pt' },
  { name: 'Japanese', code: 'ja' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Thai', code: 'th' },
  { name: 'Vietnamese', code: 'vi' },
  { name: 'Korean', code: 'ko' },
  { name: 'Turkish', code: 'tr' },
  { name: 'Arabic', code: 'ar' },
];

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    homeCountry: '',
    preferredLanguage: 'en',
    allergies: '',
    medications: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeCountry: formData.homeCountry,
          preferredLanguage: formData.preferredLanguage,
          allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
          medications: formData.medications ? formData.medications.split(',').map(m => m.trim()) : [],
          emergencyContacts: [
            {
              name: formData.emergencyContact,
              phone: formData.emergencyPhone,
            }
          ],
        }),
      });

      if (res.ok) {
        router.push('/app');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <p className="text-sm text-slate-500 mt-2">
              Tell us about your health so we can provide better assistance when traveling.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Home Country */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Home Country</label>
                <select
                  name="homeCountry"
                  value={formData.homeCountry}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select your home country</option>
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Preferred Language */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Preferred Language</label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {languages.map(l => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>

              {/* Allergies */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Allergies (Optional)</label>
                <Input
                  name="allergies"
                  placeholder="e.g., penicillin, peanuts (separate with commas)"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              {/* Current Medications */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Current Medications (Optional)</label>
                <Input
                  name="medications"
                  placeholder="e.g., aspirin, metformin (separate with commas)"
                  value={formData.medications}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Emergency Contact Name</label>
                  <Input
                    name="emergencyContact"
                    placeholder="Full name"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Emergency Phone</label>
                  <Input
                    name="emergencyPhone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !formData.homeCountry}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 font-medium rounded-lg"
              >
                {loading ? 'Saving...' : 'Complete Profile'}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                You can update this information anytime in your profile settings.
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

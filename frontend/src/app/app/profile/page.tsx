import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Account settings and travel preferences.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Traveler profile</CardTitle>
          <CardDescription>Anonymous sessions for now — no login required.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Default language: English</p>
          <Separator />
          <p>Medical disclaimer accepted on session start.</p>
        </CardContent>
      </Card>
    </div>
  );
}

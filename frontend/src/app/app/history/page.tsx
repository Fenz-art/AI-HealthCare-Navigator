import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Session history</h1>
        <p className="mt-2 text-muted-foreground">
          Past sessions will appear here once auth and persistence ship.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>No history yet</CardTitle>
          <CardDescription>
            Start a session to build your travel health timeline.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

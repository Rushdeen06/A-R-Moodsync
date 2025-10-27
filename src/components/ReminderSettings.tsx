import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Bell, Clock } from 'lucide-react';
import { Badge } from './ui/badge';

interface ReminderSettingsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  lastReminder: Date | null;
}

export function ReminderSettings({ enabled, onToggle, lastReminder }: ReminderSettingsProps) {
  const getNextReminderTime = () => {
    if (!enabled || !lastReminder) return 'Not scheduled';
    const next = new Date(lastReminder.getTime() + 2 * 60 * 60 * 1000); // 2 hours from last
    const now = new Date();
    
    if (next < now) {
      return 'Due now';
    }
    
    const diffMs = next.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    if (hours > 0) {
      return `in ${hours}h ${mins}m`;
    }
    return `in ${mins}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-purple-500" />
          Mood Reminders
        </CardTitle>
        <CardDescription>Get gentle reminders to check in with yourself</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Label htmlFor="reminders" className="cursor-pointer">
              Enable reminders every 2 hours
            </Label>
          </div>
          <Switch
            id="reminders"
            checked={enabled}
            onCheckedChange={onToggle}
          />
        </div>
        
        {enabled && (
          <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
            <Clock className="h-4 w-4 text-purple-600" />
            <div className="flex-1">
              <p className="text-sm text-gray-700">Next reminder</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                {getNextReminderTime()}
              </Badge>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 Regular check-ins help build emotional awareness</p>
          <p>🔔 You'll receive a gentle notification to track your mood</p>
        </div>
      </CardContent>
    </Card>
  );
}

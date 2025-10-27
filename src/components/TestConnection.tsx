import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { api } from '../utils/api';

export function TestConnection() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testHealthCheck = async () => {
    setIsLoading(true);
    setResult('Testing...');
    
    try {
      const data = await api.healthCheck();
      console.log('Health check response:', data);
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Health check error:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Backend Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testHealthCheck} disabled={isLoading}>
          {isLoading ? 'Testing...' : 'Test Health Check'}
        </Button>
        {result && (
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
            {result}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}

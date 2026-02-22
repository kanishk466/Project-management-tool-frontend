import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authFetch } from '@/lib/authFetch';
import { TestCasesResponse, TestCase } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TestCasesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<TestCasesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestCases = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await authFetch(
          `${import.meta.env.VITE_API_BASE_URL}/tickets/${id}/testcases`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch test cases');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch test cases');
      } finally {
        setLoading(false);
      }
    };

    fetchTestCases();
  }, [id]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-destructive/10 text-destructive';
      case 'MEDIUM':
        return 'bg-chart-3/10 text-chart-3';
      case 'LOW':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'POSITIVE'
      ? 'bg-green-100/10 text-green-600'
      : 'bg-red-100/10 text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading test cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{data?.ticketNumber || 'Test Cases'}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Total test cases: <span className="font-semibold">{data?.testCases.length || 0}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* No Test Cases */}
      {!error && (!data?.testCases || data.testCases.length === 0) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No test cases found for this ticket.</AlertDescription>
        </Alert>
      )}

      {/* Test Cases Grid */}
      <div className="grid gap-6">
        {data?.testCases.map((testCase) => (
          <Card key={testCase.id} className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg">{testCase.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getTypeColor(testCase.type)}>
                      {testCase.type}
                    </Badge>
                    <Badge className={getPriorityColor(testCase.priority)}>
                      {testCase.priority}
                    </Badge>
                    {testCase.aiGenerated && (
                      <Badge variant="outline" className="bg-purple-100/10 text-purple-600">
                        AI Generated
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Preconditions */}
              <div>
                <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Preconditions</h4>
                <ul className="space-y-1">
                  {testCase.preconditions.map((precondition, idx) => (
                    <li key={idx} className="text-sm flex gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{precondition}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div>
                <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Steps</h4>
                <ol className="space-y-1">
                  {testCase.steps.map((step, idx) => (
                    <li key={idx} className="text-sm flex gap-2">
                      <span className="text-muted-foreground">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Expected Result */}
              <div>
                <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Expected Result</h4>
                <p className="text-sm bg-muted/50 p-3 rounded-md border border-border">
                  {testCase.expectedResult}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(testCase.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

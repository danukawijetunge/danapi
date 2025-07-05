import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';

const EDGE_FUNCTION_URL = 'https://univxcwsaupszlyqkjfo.functions.supabase.co/validate-key';
const EDGE_FUNCTION_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const APIPlayground: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    setLoading(true);
    setResult(null);
    setMessage('');
    try {
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${EDGE_FUNCTION_ANON_KEY}`
        },
        body: JSON.stringify({ apiKey })
      });
      const data = await response.json();
      setLoading(false);
      if (data.valid) {
        setResult('success');
        setMessage('API Key is valid!');
      } else {
        setResult('error');
        setMessage('API Key is invalid or not found.');
      }
    } catch (error) {
      setLoading(false);
      setResult('error');
      setMessage('An error occurred while validating the API Key.');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Card sx={{ minWidth: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>API Playground</Typography>
          <TextField
            label="Enter API Key"
            fullWidth
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleValidate} disabled={loading || !apiKey} fullWidth>
            {loading ? 'VALIDATING...' : 'VALIDATE API KEY'}
          </Button>
          {result && (
            <Alert severity={result} sx={{ mt: 2 }}>{message}</Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default APIPlayground; 
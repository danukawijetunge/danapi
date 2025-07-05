import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';
import { supabase } from './supabaseClient';

const APIPlayground: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    setLoading(true);
    setResult(null);
    setMessage('');
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('key', apiKey)
      .single();
    setLoading(false);
    if (error || !data) {
      setResult('error');
      setMessage('API Key is invalid or not found.');
    } else {
      setResult('success');
      setMessage('API Key is valid!');
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
            {loading ? 'Validating...' : 'Validate API Key'}
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
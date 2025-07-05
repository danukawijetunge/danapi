const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { apiKey } = req.body;
    if (!apiKey) {
      res.status(400).json({ valid: false, error: 'Missing apiKey' });
      return;
    }

    // Debug: log env and body
    console.log('Supabase URL:', process.env.VITE_SUPABASE_URL);
    console.log('Supabase Key:', process.env.VITE_SUPABASE_ANON_KEY ? 'set' : 'not set');
    console.log('Request body:', req.body);

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('key', apiKey)
      .single();

    if (error || !data) {
      res.status(200).json({ valid: false });
    } else {
      res.status(200).json({ valid: true });
    }
  } catch (err) {
    console.error('Serverless function error:', err);
    res.status(500).json({ error: { code: '500', message: err.message } });
  }
}; 
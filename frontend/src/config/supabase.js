import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wyceqxfvcrxqvyegastf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Y2VxeGZ2Y3J4cXZ5ZWdhc3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzcyMTAsImV4cCI6MjA2MTM1MzIxMH0.JH3Q2ZQjz4nKJ7beHedWCTxR0Ur9AiiWNOxaZV2w9Jo';

export const supabase = createClient(supabaseUrl, supabaseKey);
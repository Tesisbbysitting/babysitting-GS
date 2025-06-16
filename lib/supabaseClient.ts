import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oehywxvoclukzvnwgihr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9laHl3eHZvY2x1a3p2bndnaWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMjk0MzYsImV4cCI6MjA2NDkwNTQzNn0.IpQKJAP9BjjKbNO4FG4UxuWVjsLsjruUxAm0tbOw5q8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
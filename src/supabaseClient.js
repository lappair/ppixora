import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://uifooztyarlfnbqapckd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZm9venR5YXJsZm5icWFwY2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NDk3NjIsImV4cCI6MjA5MTEyNTc2Mn0.w8pKOlt3mNVp6qngBKH9EEVjrFzxRCAscHVI6qVzuh8"                
);
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lybnggazhbgwhucfvyjx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5Ym5nZ2F6aGJnd2h1Y2Z2eWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NTg5MTksImV4cCI6MjA4NjUzNDkxOX0.XRe8Dsk_NjJ9xxoG_i1uVeileVnkj0uiynZEWTke3r0'

export const supabase = createClient(supabaseUrl, supabaseKey)
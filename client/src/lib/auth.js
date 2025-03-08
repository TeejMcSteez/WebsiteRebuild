import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://dzqcqtucdqznjvagxmhj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6cWNxdHVjZHF6bmp2YWd4bWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDE5OTUsImV4cCI6MjA1NjM3Nzk5NX0.iUdqHG_dvoEfqndwfgqhz1ikik7H7PPk2okKlz8xlb8');

/**
 * Checks if the current user is authed on Supabase
 * @returns {Promise<Boolean>}
 */
export async function isUserAuthed() {
    // Gets current session if any
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session || !session.access_token) {
        return false
    }

    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        return false;
    }

    return true;
}
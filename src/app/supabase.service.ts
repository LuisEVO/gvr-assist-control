import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(
      environment.supabase.url,
      environment.supabase.key,
    );
  }
}

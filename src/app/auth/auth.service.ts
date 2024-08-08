import { inject, Injectable } from '@angular/core';
import { SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabaseClient = inject(SupabaseService).supabaseClient;

  async getUserId() {
    const {
      data: { session },
    } = await this.session();

    return session?.user.id;
  }

  session() {
    return this.supabaseClient.auth.getSession();
  }

  signUp(credentials: SignUpWithPasswordCredentials) {
    return this.supabaseClient.auth.signUp(credentials);
  }

  signIn(credentials: SignUpWithPasswordCredentials) {
    return this.supabaseClient.auth.signInWithPassword(credentials);
  }

  signOut() {
    return this.supabaseClient.auth.signOut();
  }
}

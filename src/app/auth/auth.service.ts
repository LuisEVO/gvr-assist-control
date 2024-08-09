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

  async isAdmin() {
    const { data } = await this.session();
    const email = data.session?.user.email || '';
    return [
      'luis.vilcarromero.ortiz@gmail.com',
      'gvr.osco2719@gmail.com',
    ].includes(email);
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

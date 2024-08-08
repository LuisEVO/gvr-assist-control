import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { SupabaseService } from '../supabase.service';
import moment from 'moment';

export enum AssistControlType {
  in = 1,
  out = 2,
}

export interface AssistControl {
  id: string;
  date: string;
  type: AssistControlType;
  userId: string;
  documentPath: string;
}

@Injectable({
  providedIn: 'root',
})
export class AssistControlService {
  private supabaseClient = inject(SupabaseService).supabaseClient;
  private authService = inject(AuthService);

  async getTodayRegister(
    type: AssistControlType,
  ): Promise<AssistControl | null> {
    const userId = await this.authService.getUserId();

    const { data } = await this.supabaseClient
      .from('assist-control')
      .select()
      .eq('userId', userId)
      .eq('type', type)
      .eq('date', moment().format('YYYY-MM-DD'))
      .returns<AssistControl[]>();

    return data?.length ? data[0] : null;
  }

  async create(dto: Partial<AssistControl>): Promise<AssistControl | null> {
    const userId = await this.authService.getUserId();

    const { data } = await this.supabaseClient
      .from('assist-control')
      .insert({
        ...dto,
        userId,
      })
      .select()
      .returns<AssistControl[]>();

    return data?.length ? data[0] : null;
  }

  async delete(id: string) {
    return await this.supabaseClient.from('notes').delete().eq('id', id);
  }

  async downLoadDocument(path: string) {
    return await this.supabaseClient.storage.from('documents').download(path);
  }

  async uploadDocument(filePath: string, file: File) {
    return await this.supabaseClient.storage
      .from('documents')
      .upload(filePath, file);
  }
}

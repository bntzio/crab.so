/* eslint-disable camelcase */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      communities: {
        Row: {
          id: string
          updated_at: string | null
          name: string
          public_key: string
        }
        Insert: {
          id?: string
          updated_at?: string | null
          name: string
          public_key: string
        }
        Update: {
          id?: string
          updated_at?: string | null
          name?: string
          public_key?: string
        }
      }
      profiles: {
        Row: {
          id: string
          avatar: string | null
          bio: string | null
          created_at: string
          updated_at: string | null
          user_id: number | null
          username: string | null
        }
        Insert: {
          id: string
          avatar?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string | null
          user_id?: number | null
          username?: string | null
        }
        Update: {
          id?: string
          avatar?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string | null
          user_id?: number | null
          username?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

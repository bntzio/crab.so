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
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
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

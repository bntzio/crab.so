/* eslint-disable camelcase */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      communities: {
        Row: {
          name: string
          updated_at: string | null
          id: string
          public_key: string
          owner: string
          slug: string
        }
        Insert: {
          name: string
          updated_at?: string | null
          id?: string
          public_key: string
          owner: string
          slug: string
        }
        Update: {
          name?: string
          updated_at?: string | null
          id?: string
          public_key?: string
          owner?: string
          slug?: string
        }
      }
      community_requests: {
        Row: {
          id: string
          created_at: string | null
          name: string
          slug: string
          about: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string | null
          name: string
          slug: string
          about: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string | null
          name?: string
          slug?: string
          about?: string
          user_id?: string
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
          nickname: string | null
        }
        Insert: {
          id: string
          avatar?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string | null
          user_id?: number | null
          username?: string | null
          nickname?: string | null
        }
        Update: {
          id?: string
          avatar?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string | null
          user_id?: number | null
          username?: string | null
          nickname?: string | null
        }
      }
      users: {
        Row: {
          id: string
          public_key: string | null
          created_at: string | null
          username: string | null
          nickname: string | null
        }
        Insert: {
          id: string
          public_key?: string | null
          created_at?: string | null
          username?: string | null
          nickname?: string | null
        }
        Update: {
          id?: string
          public_key?: string | null
          created_at?: string | null
          username?: string | null
          nickname?: string | null
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

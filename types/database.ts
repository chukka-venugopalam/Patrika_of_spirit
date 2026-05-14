export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          impact_score: number;
          chains_created: number;
          total_reach: number;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          impact_score?: number;
          chains_created?: number;
          total_reach?: number;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          impact_score?: number;
          chains_created?: number;
          total_reach?: number;
          onboarding_completed?: boolean;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          color: string;
          post_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          color: string;
          post_count?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          color?: string;
          post_count?: number;
        };
      };
      awareness_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          hero_image: string | null;
          category_id: string;
          author_id: string;
          urgency: "critical" | "high" | "medium" | "low";
          status: "draft" | "published" | "archived";
          problem_explanation: string | null;
          why_it_matters: string | null;
          consequences: string | null;
          real_examples: string | null;
          solutions: string | null;
          reading_time: number;
          view_count: number;
          share_count: number;
          like_count: number;
          chain_count: number;
          tags: string[];
          is_featured: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          hero_image?: string | null;
          category_id: string;
          author_id: string;
          urgency?: "critical" | "high" | "medium" | "low";
          status?: "draft" | "published" | "archived";
          problem_explanation?: string | null;
          why_it_matters?: string | null;
          consequences?: string | null;
          real_examples?: string | null;
          solutions?: string | null;
          reading_time?: number;
          view_count?: number;
          share_count?: number;
          like_count?: number;
          chain_count?: number;
          tags?: string[];
          is_featured?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          subtitle?: string | null;
          hero_image?: string | null;
          category_id?: string;
          urgency?: "critical" | "high" | "medium" | "low";
          status?: "draft" | "published" | "archived";
          problem_explanation?: string | null;
          why_it_matters?: string | null;
          consequences?: string | null;
          real_examples?: string | null;
          solutions?: string | null;
          reading_time?: number;
          view_count?: number;
          share_count?: number;
          like_count?: number;
          chain_count?: number;
          tags?: string[];
          is_featured?: boolean;
          published_at?: string | null;
          updated_at?: string;
        };
      };
      awareness_chains: {
        Row: {
          id: string;
          post_id: string;
          root_user_id: string;
          parent_chain_id: string | null;
          share_code: string;
          depth: number;
          total_reach: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          root_user_id: string;
          parent_chain_id?: string | null;
          share_code: string;
          depth?: number;
          total_reach?: number;
          created_at?: string;
        };
        Update: {
          depth?: number;
          total_reach?: number;
        };
      };
      shares: {
        Row: {
          id: string;
          post_id: string;
          user_id: string | null;
          chain_id: string | null;
          platform: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id?: string | null;
          chain_id?: string | null;
          platform: string;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
      user_interests: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          color: string;
          requirement_type: string;
          requirement_value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          color: string;
          requirement_type: string;
          requirement_value: number;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          earned_at?: string;
        };
        Update: Record<string, never>;
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          parent_id: string | null;
          content: string;
          like_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          parent_id?: string | null;
          content: string;
          like_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          like_count?: number;
          updated_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_view_count: {
        Args: { post_id: string };
        Returns: void;
      };
      get_chain_depth: {
        Args: { chain_id: string };
        Returns: number;
      };
    };
    Enums: {
      urgency_level: "critical" | "high" | "medium" | "low";
      post_status: "draft" | "published" | "archived";
    };
  };
}

// Convenience types
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type AwarenessPost = Database["public"]["Tables"]["awareness_posts"]["Row"];
export type AwarenessChain = Database["public"]["Tables"]["awareness_chains"]["Row"];
export type Share = Database["public"]["Tables"]["shares"]["Row"];
export type UserInterest = Database["public"]["Tables"]["user_interests"]["Row"];
export type Badge = Database["public"]["Tables"]["badges"]["Row"];
export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type Like = Database["public"]["Tables"]["likes"]["Row"];

// Extended types with joins
export type PostWithCategory = AwarenessPost & {
  categories: Category;
  users: Pick<User, "id" | "username" | "avatar_url" | "full_name">;
};

export type CommentWithUser = Comment & {
  users: Pick<User, "id" | "username" | "avatar_url" | "full_name">;
  replies?: CommentWithUser[];
};

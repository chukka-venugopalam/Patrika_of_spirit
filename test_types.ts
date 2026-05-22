import type { Database } from "./types/database";
import { SupabaseClient } from "@supabase/supabase-js";

type Schema = Database["public"];

// Let's define the Supabase Generic types ourselves to see what fails
type GenericRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};
type GenericTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: GenericRelationship[];
};
type GenericView =
  | {
      Row: Record<string, unknown>;
      Insert: Record<string, unknown>;
      Update: Record<string, unknown>;
      Relationships: GenericRelationship[];
    }
  | {
      Row: Record<string, unknown>;
      Relationships: GenericRelationship[];
    };
type GenericSetofOption = {
  isSetofReturn?: boolean | undefined;
  isOneToOne?: boolean | undefined;
  isNotNullable?: boolean | undefined;
  to: string;
  from: string;
};
type GenericFunction = {
  Args: Record<string, unknown> | never;
  Returns: unknown;
  SetofOptions?: GenericSetofOption;
};
type GenericSchema = {
  Tables: Record<string, GenericTable>;
  Views: Record<string, GenericView>;
  Functions: Record<string, GenericFunction>;
};

// Check if Database["public"] is assignable to GenericSchema
type IsSchemaAssignable = Schema extends GenericSchema ? true : false;

// Check table by table
type UsersTableAssignable = Schema["Tables"]["users"] extends GenericTable ? true : false;
type CategoriesTableAssignable = Schema["Tables"]["categories"] extends GenericTable ? true : false;
type PostsTableAssignable = Schema["Tables"]["awareness_posts"] extends GenericTable ? true : false;
type ChainsTableAssignable = Schema["Tables"]["awareness_chains"] extends GenericTable ? true : false;
type SharesTableAssignable = Schema["Tables"]["shares"] extends GenericTable ? true : false;
type InterestsTableAssignable = Schema["Tables"]["user_interests"] extends GenericTable ? true : false;
type BadgesTableAssignable = Schema["Tables"]["badges"] extends GenericTable ? true : false;
type UserBadgesTableAssignable = Schema["Tables"]["user_badges"] extends GenericTable ? true : false;
type CommentsTableAssignable = Schema["Tables"]["comments"] extends GenericTable ? true : false;
type LikesTableAssignable = Schema["Tables"]["likes"] extends GenericTable ? true : false;

// Check Views
type ViewsAssignable = Schema["Views"] extends Record<string, GenericView> ? true : false;

// Check Functions
type FunctionsAssignable = Schema["Functions"] extends Record<string, GenericFunction> ? true : false;

// Test declarations to force compiler output/inspection
const test1: IsSchemaAssignable = true;
const testTable: UsersTableAssignable = true;
const testViews: ViewsAssignable = true;
const testFuncs: FunctionsAssignable = true;
const testComments: CommentsTableAssignable = true;
const testShares: SharesTableAssignable = true;

const client = {} as SupabaseClient<Database>;
const testQuery = async () => {
  const { data } = await client.from("categories").select("*");
  if (data) {
    console.log(data[0].id);
  }
};

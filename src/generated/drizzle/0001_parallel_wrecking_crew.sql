CREATE TABLE "workspace" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now(),
	"updated_at" timestamp(6) with time zone DEFAULT now(),
	"deleted_at" timestamp,
	"deletion_reason" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_id_index" ON "workspace" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_org_slug_idx" ON "workspace" USING btree ("organization_id","slug");--> statement-breakpoint
CREATE INDEX "workspace_org_idx" ON "workspace" USING btree ("organization_id");
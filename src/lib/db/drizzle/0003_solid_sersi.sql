ALTER TABLE "comment" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "comment" CASCADE;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "community_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "post_community_id_index" ON "post" USING btree ("community_id");
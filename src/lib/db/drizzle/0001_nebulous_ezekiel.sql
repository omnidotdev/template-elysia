CREATE TABLE "community" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text,
	"creator_id" uuid NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now(),
	"updated_at" timestamp(6) with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "community_member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"joined_at" timestamp(6) with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "community_moderator" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"added_at" timestamp(6) with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "community" ADD CONSTRAINT "community_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_member" ADD CONSTRAINT "community_member_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_member" ADD CONSTRAINT "community_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_moderator" ADD CONSTRAINT "community_moderator_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_moderator" ADD CONSTRAINT "community_moderator_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "community_id_index" ON "community" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "community_name_index" ON "community" USING btree ("name");--> statement-breakpoint
CREATE INDEX "community_creator_id_index" ON "community" USING btree ("creator_id");--> statement-breakpoint
CREATE UNIQUE INDEX "community_member_id_index" ON "community_member" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "community_member_community_id_user_id_index" ON "community_member" USING btree ("community_id","user_id");--> statement-breakpoint
CREATE INDEX "community_member_community_id_index" ON "community_member" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "community_member_user_id_index" ON "community_member" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "community_moderator_id_index" ON "community_moderator" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "community_moderator_community_id_user_id_index" ON "community_moderator" USING btree ("community_id","user_id");--> statement-breakpoint
CREATE INDEX "community_moderator_community_id_index" ON "community_moderator" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "community_moderator_user_id_index" ON "community_moderator" USING btree ("user_id");
-- CreateTable
CREATE TABLE "auth" (
    "id" UUID NOT NULL,
    "hash_password" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" UUID NOT NULL,
    "display_name" TEXT,
    "role_name" TEXT,
    "bio_title" TEXT,
    "bio_description" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resume_url" TEXT,
    "site_url" TEXT,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_experience" (
    "id" UUID NOT NULL,
    "job_title" TEXT,
    "company_name" TEXT,
    "start_date" DATE,
    "end_date" DATE,
    "is_current" BOOLEAN,
    "description" TEXT,
    "display_order" INTEGER,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "work_experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "category_name" TEXT,
    "skill_names" TEXT,
    "display_order" INTEGER,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education" (
    "id" UUID NOT NULL,
    "major" TEXT,
    "institution" TEXT,
    "start_date" DATE,
    "end_date" DATE,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "issuer" TEXT,
    "complete_date" DATE,
    "display_order" INTEGER,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_experience" (
    "id" UUID NOT NULL,
    "title" TEXT,
    "is_in_progress" BOOLEAN,
    "start_date" DATE,
    "end_date" DATE,
    "image_url" TEXT,
    "description" TEXT,
    "tags" TEXT,
    "display_order" INTEGER,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "project_experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_links" (
    "id" UUID NOT NULL,
    "project_id" UUID,
    "name" TEXT,
    "url" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "project_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" UUID NOT NULL,
    "type" TEXT,
    "value" TEXT,
    "display_order" INTEGER,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_links_project_id_idx" ON "project_links"("project_id");

-- AddForeignKey
ALTER TABLE "project_links" ADD CONSTRAINT "project_links_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project_experience"("id") ON DELETE SET NULL ON UPDATE CASCADE;

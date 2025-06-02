-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "unique_id" TEXT NOT NULL,
    "google_sub" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_unique_id_key" ON "User"("unique_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_google_sub_key" ON "User"("google_sub");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

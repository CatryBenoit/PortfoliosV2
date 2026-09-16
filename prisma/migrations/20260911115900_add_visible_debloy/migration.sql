-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "system" TEXT NOT NULL,
    "tech" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "pos_x" REAL NOT NULL,
    "pos_y" REAL NOT NULL,
    "pos_z" REAL NOT NULL,
    "description" TEXT,
    "github_url" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "debloy" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Project" ("color", "createdAt", "description", "github_url", "id", "name", "pos_x", "pos_y", "pos_z", "system", "tech") SELECT "color", "createdAt", "description", "github_url", "id", "name", "pos_x", "pos_y", "pos_z", "system", "tech" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

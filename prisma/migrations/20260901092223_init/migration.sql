/*
  Warnings:

  - Added the required column `pos_x` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pos_y` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pos_z` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `system` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tech` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "system" TEXT NOT NULL,
    "tech" TEXT NOT NULL,
    "pos_x" REAL NOT NULL,
    "pos_y" REAL NOT NULL,
    "pos_z" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "githubUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Project" ("createdAt", "description", "githubUrl", "id", "imageUrl", "title") SELECT "createdAt", "description", "githubUrl", "id", "imageUrl", "title" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

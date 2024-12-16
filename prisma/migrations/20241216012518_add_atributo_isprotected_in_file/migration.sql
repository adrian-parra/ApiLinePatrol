-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isProtected" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_File" ("createdAt", "fileName", "filePath", "id") SELECT "createdAt", "fileName", "filePath", "id" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE UNIQUE INDEX "File_filePath_key" ON "File"("filePath");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

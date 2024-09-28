/*
  Warnings:

  - You are about to drop the column `idEstacion` on the `EquipoComputo` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EquipoComputo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hostname" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_EquipoComputo" ("createdAt", "estado", "hostname", "id", "updatedAt") SELECT "createdAt", "estado", "hostname", "id", "updatedAt" FROM "EquipoComputo";
DROP TABLE "EquipoComputo";
ALTER TABLE "new_EquipoComputo" RENAME TO "EquipoComputo";
CREATE UNIQUE INDEX "EquipoComputo_hostname_key" ON "EquipoComputo"("hostname");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

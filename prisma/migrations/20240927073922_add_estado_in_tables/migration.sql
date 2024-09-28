/*
  Warnings:

  - You are about to alter the column `estado` on the `Planta` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.
  - Added the required column `updatedAt` to the `EquipoComputo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Planta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Planta" ("createdAt", "estado", "id", "nombre", "updatedAt") SELECT "createdAt", "estado", "id", "nombre", "updatedAt" FROM "Planta";
DROP TABLE "Planta";
ALTER TABLE "new_Planta" RENAME TO "Planta";
CREATE TABLE "new_Estacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "idLinea" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Estacion_idLinea_fkey" FOREIGN KEY ("idLinea") REFERENCES "Linea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Estacion" ("createdAt", "id", "idLinea", "nombre", "updatedAt") SELECT "createdAt", "id", "idLinea", "nombre", "updatedAt" FROM "Estacion";
DROP TABLE "Estacion";
ALTER TABLE "new_Estacion" RENAME TO "Estacion";
CREATE TABLE "new_EquipoComputo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hostname" TEXT NOT NULL,
    "idEstacion" INTEGER NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EquipoComputo_idEstacion_fkey" FOREIGN KEY ("idEstacion") REFERENCES "Estacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EquipoComputo" ("hostname", "id", "idEstacion") SELECT "hostname", "id", "idEstacion" FROM "EquipoComputo";
DROP TABLE "EquipoComputo";
ALTER TABLE "new_EquipoComputo" RENAME TO "EquipoComputo";
CREATE TABLE "new_Linea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "idPlanta" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Linea_idPlanta_fkey" FOREIGN KEY ("idPlanta") REFERENCES "Planta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Linea" ("createdAt", "id", "idPlanta", "nombre", "updatedAt") SELECT "createdAt", "id", "idPlanta", "nombre", "updatedAt" FROM "Linea";
DROP TABLE "Linea";
ALTER TABLE "new_Linea" RENAME TO "Linea";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

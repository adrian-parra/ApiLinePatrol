/*
  Warnings:

  - The primary key for the `Planta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Planta` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `estado` to the `Planta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Planta` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Linea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "idPlanta" INTEGER NOT NULL,
    CONSTRAINT "Linea_idPlanta_fkey" FOREIGN KEY ("idPlanta") REFERENCES "Planta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Estacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "idLinea" INTEGER NOT NULL,
    CONSTRAINT "Estacion_idLinea_fkey" FOREIGN KEY ("idLinea") REFERENCES "Linea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EquipoComputo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hostname" TEXT NOT NULL,
    "idEstacion" INTEGER NOT NULL,
    CONSTRAINT "EquipoComputo_idEstacion_fkey" FOREIGN KEY ("idEstacion") REFERENCES "Estacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Planta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Planta" ("id", "nombre") SELECT "id", "nombre" FROM "Planta";
DROP TABLE "Planta";
ALTER TABLE "new_Planta" RENAME TO "Planta";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

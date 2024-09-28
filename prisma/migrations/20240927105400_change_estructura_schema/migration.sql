/*
  Warnings:

  - You are about to drop the column `idLinea` on the `Estacion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `Linea` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "LineaEstacionEquipo" (
    "idLinea" INTEGER NOT NULL,
    "idEstacion" INTEGER NOT NULL,
    "idEquipo" INTEGER NOT NULL,

    PRIMARY KEY ("idLinea", "idEstacion", "idEquipo"),
    CONSTRAINT "LineaEstacionEquipo_idLinea_fkey" FOREIGN KEY ("idLinea") REFERENCES "Linea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LineaEstacionEquipo_idEstacion_fkey" FOREIGN KEY ("idEstacion") REFERENCES "Estacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LineaEstacionEquipo_idEquipo_fkey" FOREIGN KEY ("idEquipo") REFERENCES "EquipoComputo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Software" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EquipoComputoSoftware" (
    "idEquipoComputo" INTEGER NOT NULL,
    "idSoftware" INTEGER NOT NULL,

    PRIMARY KEY ("idEquipoComputo", "idSoftware"),
    CONSTRAINT "EquipoComputoSoftware_idEquipoComputo_fkey" FOREIGN KEY ("idEquipoComputo") REFERENCES "EquipoComputo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EquipoComputoSoftware_idSoftware_fkey" FOREIGN KEY ("idSoftware") REFERENCES "Software" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EquipoComputo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hostname" TEXT NOT NULL,
    "idEstacion" INTEGER NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_EquipoComputo" ("createdAt", "estado", "hostname", "id", "idEstacion", "updatedAt") SELECT "createdAt", "estado", "hostname", "id", "idEstacion", "updatedAt" FROM "EquipoComputo";
DROP TABLE "EquipoComputo";
ALTER TABLE "new_EquipoComputo" RENAME TO "EquipoComputo";
CREATE UNIQUE INDEX "EquipoComputo_hostname_key" ON "EquipoComputo"("hostname");
CREATE TABLE "new_Estacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Estacion" ("createdAt", "estado", "id", "nombre", "updatedAt") SELECT "createdAt", "estado", "id", "nombre", "updatedAt" FROM "Estacion";
DROP TABLE "Estacion";
ALTER TABLE "new_Estacion" RENAME TO "Estacion";
CREATE UNIQUE INDEX "Estacion_nombre_key" ON "Estacion"("nombre");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Software_nombre_key" ON "Software"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Linea_nombre_key" ON "Linea"("nombre");

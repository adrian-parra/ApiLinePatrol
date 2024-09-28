/*
  Warnings:

  - The primary key for the `LineaEstacionEquipo` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LineaEstacionEquipo" (
    "idLinea" INTEGER NOT NULL,
    "idEstacion" INTEGER NOT NULL,
    "idEquipo" INTEGER NOT NULL,

    PRIMARY KEY ("idLinea", "idEstacion"),
    CONSTRAINT "LineaEstacionEquipo_idLinea_fkey" FOREIGN KEY ("idLinea") REFERENCES "Linea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LineaEstacionEquipo_idEstacion_fkey" FOREIGN KEY ("idEstacion") REFERENCES "Estacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LineaEstacionEquipo_idEquipo_fkey" FOREIGN KEY ("idEquipo") REFERENCES "EquipoComputo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LineaEstacionEquipo" ("idEquipo", "idEstacion", "idLinea") SELECT "idEquipo", "idEstacion", "idLinea" FROM "LineaEstacionEquipo";
DROP TABLE "LineaEstacionEquipo";
ALTER TABLE "new_LineaEstacionEquipo" RENAME TO "LineaEstacionEquipo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

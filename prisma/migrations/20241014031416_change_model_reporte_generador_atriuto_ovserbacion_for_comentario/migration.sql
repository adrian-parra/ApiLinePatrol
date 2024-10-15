/*
  Warnings:

  - You are about to drop the column `Observaciones` on the `reporteGenerador` table. All the data in the column will be lost.
  - Added the required column `Comentario` to the `reporteGenerador` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_reporteGenerador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "responsable" TEXT NOT NULL,
    "path_imagen_horas_trabajadas" TEXT NOT NULL,
    "path_imagen_status_bateria" TEXT NOT NULL,
    "path_imagen_nivel_anticongelante" TEXT NOT NULL,
    "path_imagen_nivel_diesel" TEXT NOT NULL,
    "path_imagen_nivel_aceite" TEXT NOT NULL,
    "Comentario" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_reporteGenerador" ("created_at", "estado", "id", "path_imagen_horas_trabajadas", "path_imagen_nivel_aceite", "path_imagen_nivel_anticongelante", "path_imagen_nivel_diesel", "path_imagen_status_bateria", "responsable", "updated_at") SELECT "created_at", "estado", "id", "path_imagen_horas_trabajadas", "path_imagen_nivel_aceite", "path_imagen_nivel_anticongelante", "path_imagen_nivel_diesel", "path_imagen_status_bateria", "responsable", "updated_at" FROM "reporteGenerador";
DROP TABLE "reporteGenerador";
ALTER TABLE "new_reporteGenerador" RENAME TO "reporteGenerador";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

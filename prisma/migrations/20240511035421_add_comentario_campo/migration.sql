/*
  Warnings:

  - Added the required column `comentario` to the `line_patrol` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_line_patrol" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_planta" TEXT NOT NULL,
    "id_linea" TEXT NOT NULL,
    "id_estacion" TEXT NOT NULL,
    "path_imagen" TEXT NOT NULL,
    "comentario" TEXT NOT NULL,
    "path_imagen_after" TEXT,
    "persona_libera" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_line_patrol" ("created_at", "estado", "id", "id_estacion", "id_linea", "id_planta", "path_imagen", "path_imagen_after", "persona_libera", "updated_at") SELECT "created_at", "estado", "id", "id_estacion", "id_linea", "id_planta", "path_imagen", "path_imagen_after", "persona_libera", "updated_at" FROM "line_patrol";
DROP TABLE "line_patrol";
ALTER TABLE "new_line_patrol" RENAME TO "line_patrol";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

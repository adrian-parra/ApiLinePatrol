-- CreateTable
CREATE TABLE "line_patrol" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_planta" TEXT NOT NULL,
    "id_linea" TEXT NOT NULL,
    "id_estacion" TEXT NOT NULL,
    "path_imagen" TEXT NOT NULL,
    "path_imagen_after" TEXT,
    "persona_libera" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

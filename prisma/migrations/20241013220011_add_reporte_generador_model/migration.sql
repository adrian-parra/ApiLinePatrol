-- CreateTable
CREATE TABLE "reporteGenerador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "responsable" TEXT NOT NULL,
    "path_imagen_horas_trabajadas" TEXT NOT NULL,
    "path_imagen_status_bateria" TEXT NOT NULL,
    "path_imagen_nivel_anticongelante" TEXT NOT NULL,
    "path_imagen_nivel_diesel" TEXT NOT NULL,
    "path_imagen_nivel_aceite" TEXT NOT NULL,
    "Observaciones" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

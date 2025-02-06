-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Soporte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descripcion" TEXT NOT NULL,
    "solucion" TEXT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responsable" TEXT NOT NULL,
    "requeridoPor" TEXT NOT NULL DEFAULT '',
    "estado" TEXT NOT NULL,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "idEquipoComputo" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Soporte_idEquipoComputo_fkey" FOREIGN KEY ("idEquipoComputo") REFERENCES "EquipoComputo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Soporte" ("createdAt", "descripcion", "estado", "fecha", "habilitado", "id", "idEquipoComputo", "responsable", "solucion", "updatedAt") SELECT "createdAt", "descripcion", "estado", "fecha", "habilitado", "id", "idEquipoComputo", "responsable", "solucion", "updatedAt" FROM "Soporte";
DROP TABLE "Soporte";
ALTER TABLE "new_Soporte" RENAME TO "Soporte";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

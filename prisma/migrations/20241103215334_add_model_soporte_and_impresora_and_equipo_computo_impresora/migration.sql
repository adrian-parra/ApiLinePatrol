-- CreateTable
CREATE TABLE "Impresora" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "modelo" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "hostname" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EquipoComputoImpresora" (
    "idEquipoComputo" INTEGER NOT NULL,
    "idImpresora" INTEGER NOT NULL,

    PRIMARY KEY ("idEquipoComputo", "idImpresora"),
    CONSTRAINT "EquipoComputoImpresora_idEquipoComputo_fkey" FOREIGN KEY ("idEquipoComputo") REFERENCES "EquipoComputo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EquipoComputoImpresora_idImpresora_fkey" FOREIGN KEY ("idImpresora") REFERENCES "Impresora" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Soporte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descripcion" TEXT NOT NULL,
    "solucion" TEXT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responsable" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "idEquipoComputo" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Soporte_idEquipoComputo_fkey" FOREIGN KEY ("idEquipoComputo") REFERENCES "EquipoComputo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Impresora_nombre_key" ON "Impresora"("nombre");

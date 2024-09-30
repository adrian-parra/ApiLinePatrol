/*
  Warnings:

  - A unique constraint covering the columns `[idEquipo]` on the table `LineaEstacionEquipo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LineaEstacionEquipo_idEquipo_key" ON "LineaEstacionEquipo"("idEquipo");

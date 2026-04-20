-- CreateTable
CREATE TABLE "Tecnico" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tecnico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "bairro" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saude" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "cartaoSus" TEXT,
    "ultimaConsulta" TIMESTAMP(3),
    "vacinasEmDia" BOOLEAN NOT NULL DEFAULT true,
    "alertas" TEXT[],
    "temAlerta" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Saude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Educacao" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "escola" TEXT,
    "serie" TEXT,
    "frequenciaPercentual" DOUBLE PRECISION,
    "alertas" TEXT[],
    "temAlerta" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Educacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssistenciaSocial" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "nis" TEXT,
    "beneficios" TEXT[],
    "statusBeneficios" TEXT,
    "alertas" TEXT[],
    "temAlerta" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AssistenciaSocial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Revisao" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "tecnicoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Revisao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tecnico_email_key" ON "Tecnico"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Saude_childId_key" ON "Saude"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "Educacao_childId_key" ON "Educacao"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "AssistenciaSocial_childId_key" ON "AssistenciaSocial"("childId");

-- AddForeignKey
ALTER TABLE "Saude" ADD CONSTRAINT "Saude_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Educacao" ADD CONSTRAINT "Educacao_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistenciaSocial" ADD CONSTRAINT "AssistenciaSocial_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revisao" ADD CONSTRAINT "Revisao_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revisao" ADD CONSTRAINT "Revisao_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "Tecnico"("id") ON UPDATE CASCADE;

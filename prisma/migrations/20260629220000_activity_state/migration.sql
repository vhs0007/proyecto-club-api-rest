-- AlterTable: reemplazar isActive por state
ALTER TABLE "activity" ADD COLUMN "state" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE';

-- Migrar datos existentes
UPDATE "activity" SET "state" = CASE WHEN "isActive" = false THEN 'CANCELADO' ELSE 'PENDIENTE' END;

-- Eliminar columna anterior
ALTER TABLE "activity" DROP COLUMN "isActive";

-- Constraint CHECK sobre valores permitidos
ALTER TABLE "activity" ADD CONSTRAINT "activity_state_check"
  CHECK (state IN ('PENDIENTE','CONFIRMADO','CANCELADO','COMPLETADO','SEÑADA'));

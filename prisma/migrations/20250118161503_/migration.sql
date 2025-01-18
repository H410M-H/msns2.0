-- AlterTable
ALTER TABLE "fees" ADD COLUMN     "type" "FeeCategory" NOT NULL DEFAULT 'MonthlyFee';

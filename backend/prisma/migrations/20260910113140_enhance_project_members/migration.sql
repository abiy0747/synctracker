-- AlterTable
ALTER TABLE "ProjectMember" ADD COLUMN     "assignedById" INTEGER,
ADD COLUMN     "lastUpdateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "parentMemberId" INTEGER,
ADD COLUMN     "responsibility" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'MEMBER',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'IN_SYNC';

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_parentMemberId_fkey" FOREIGN KEY ("parentMemberId") REFERENCES "ProjectMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

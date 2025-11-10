-- CreateTable
CREATE TABLE "difficulty_ratings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mysteryId" TEXT NOT NULL,
    "difficulty" SMALLINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "difficulty_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "difficulty_ratings_userId_mysteryId_key" ON "difficulty_ratings"("userId", "mysteryId");

-- AddForeignKey
ALTER TABLE "difficulty_ratings" ADD CONSTRAINT "difficulty_ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "difficulty_ratings" ADD CONSTRAINT "difficulty_ratings_mysteryId_fkey" FOREIGN KEY ("mysteryId") REFERENCES "mysteries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

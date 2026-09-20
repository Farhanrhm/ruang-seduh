-- CreateIndex
CREATE INDEX "BrewJournal_userId_idx" ON "BrewJournal"("userId");

-- CreateIndex
CREATE INDEX "Comment_postSlug_idx" ON "Comment"("postSlug");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

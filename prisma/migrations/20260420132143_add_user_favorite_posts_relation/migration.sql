-- CreateTable
CREATE TABLE "_UserFavoritePosts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserFavoritePosts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserFavoritePosts_B_index" ON "_UserFavoritePosts"("B");

-- AddForeignKey
ALTER TABLE "_UserFavoritePosts" ADD CONSTRAINT "_UserFavoritePosts_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("postId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavoritePosts" ADD CONSTRAINT "_UserFavoritePosts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

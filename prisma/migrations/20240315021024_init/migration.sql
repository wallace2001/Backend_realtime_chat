/*
  Warnings:

  - Added the required column `owner` to the `Chatroom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chatroom" ADD COLUMN     "owner" INTEGER NOT NULL;

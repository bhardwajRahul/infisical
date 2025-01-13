// Code generated by automation script, DO NOT EDIT.
// Automated by pulling database and generating zod schema
// To update. Just run npm run generate:schema
// Written by akhilmhdh.

import { z } from "zod";

import { TImmutableDBKeys } from "./models";

export const ResourceMetadataSchema = z.object({
  id: z.string().uuid(),
  key: z.string(),
  value: z.string(),
  orgId: z.string().uuid(),
  userId: z.string().uuid().nullable().optional(),
  identityId: z.string().uuid().nullable().optional(),
  secretId: z.string().uuid().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TResourceMetadata = z.infer<typeof ResourceMetadataSchema>;
export type TResourceMetadataInsert = Omit<z.input<typeof ResourceMetadataSchema>, TImmutableDBKeys>;
export type TResourceMetadataUpdate = Partial<Omit<z.input<typeof ResourceMetadataSchema>, TImmutableDBKeys>>;
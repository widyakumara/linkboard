"use client";

import { useState } from "react";
import { DeleteCollectionDialog } from "~/components/delete-collection-dialog";
import { EditCollectionDialog } from "~/components/edit-collection-dialog";
import { PencilIcon } from "~/components/icons/pencil";
import { TrashIcon } from "~/components/icons/trash";
import { Button } from "~/components/primitives/button";
import { Collection } from "~/server/db/schema";

type CollectionDialogGroupProps = {
  collection: Collection;
};

export function CollectionDialogGroup({
  collection,
}: CollectionDialogGroupProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <Button plain onClick={() => setIsDeleteDialogOpen(true)}>
        <TrashIcon className="size-5" />
      </Button>
      <Button plain onClick={() => setIsEditDialogOpen(true)}>
        <PencilIcon className="size-5" />
      </Button>

      <DeleteCollectionDialog
        collectionId={collection.id}
        collectionName={collection.name}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />

      <EditCollectionDialog
        collection={collection}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
      />
    </>
  );
}

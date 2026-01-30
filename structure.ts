// structure.ts
import {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S, context) => {
  const {currentUser} = context

  // Define who the "Super Admin" is
  const isSuperAdmin = ['collinsruto48@gmail.com', 'erefweb@gmail.com'].includes(
    currentUser?.email || 'example@gmail.com',
  )

  return S.list()
    .title('Content')
    .items([
      // 1. Show regular schemas to everyone
      ...S.documentTypeListItems().filter(
        (listItem) => !['settings', 'apiConfig'].includes(listItem.getId()!),
      ),

      S.divider(),

      // 2. Only show "Settings" to the Super Admin
      ...(isSuperAdmin
        ? [
            S.listItem()
              .title('Admin Settings')
              .child(S.document().schemaType('settings').documentId('settings')),
          ]
        : []),
    ])
}

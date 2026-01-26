// structure.ts
import type {StructureResolver} from 'sanity/structure'

const SUPER_ADMINS = new Set(['collinsruto48@gmail.com', 'erefwe@gmail.com'])

export const structure: StructureResolver = (S, context) => {
  // Some setups may not provide currentUser here — handle safely
  const email = context?.currentUser?.email
  const isSuperAdmin = email ? SUPER_ADMINS.has(email) : false

  const hiddenTypes = new Set(['settings', 'apiConfig'])

  return S.list()
    .title('Content')
    .items([
      // Normal content types (hide settings + apiConfig from general list)
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId()
        return id ? !hiddenTypes.has(id) : true
      }),

      S.divider(),

      // Only show Settings shortcut to super admins
      ...(isSuperAdmin
        ? [
            S.listItem()
              .title('Admin Settings')
              .child(S.document().schemaType('settings').documentId('settings')),
          ]
        : []),
    ])
}

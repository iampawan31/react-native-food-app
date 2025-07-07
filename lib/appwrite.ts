import { Category, CreateUserParams, GetMenuParams, SignInParams } from '@/type'
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage
} from 'react-native-appwrite'

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: 'com.iampawan31.foodordering',
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
  categoriesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
  menuCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID!,
  customizationsCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATIONS_COLLECTION_ID!,
  menuCustomizationsCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATION_COLLECTION_ID!
}

export const appwriteClient = new Client()

appwriteClient
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform)

export const appwriteAccount = new Account(appwriteClient)
export const appwriteDatabases = new Databases(appwriteClient)
export const appwriteAvatars = new Avatars(appwriteClient)
export const appwriteStorage = new Storage(appwriteClient)

export const createUser = async ({
  name,
  email,
  password
}: CreateUserParams) => {
  try {
    const newAccount = await appwriteAccount.create(
      ID.unique(),
      email,
      password,
      name
    )

    if (!newAccount) {
      throw new Error('Error creating a new account')
    }

    await signIn({ email, password })

    const avatarUrl = appwriteAvatars.getInitialsURL(name)

    return await appwriteDatabases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        name,
        avatar: avatarUrl
      }
    )
  } catch (error) {
    throw new Error(error as string)
  }
}

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = appwriteAccount.createEmailPasswordSession(email, password)
  } catch (error) {
    console.log(error)
    throw new Error(error as string)
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await appwriteAccount.get()

    if (!currentAccount) throw new Error('Session not found for current user')

    const currentUser = await appwriteDatabases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser) throw new Error()

    return currentUser.documents[0]
  } catch (error) {
    throw new Error(error as string)
  }
}

export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = []

    if (category) queries.push(Query.equal('categories', category))
    if (query) queries.push(Query.search('name', query))

    const menus = await appwriteDatabases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      queries
    )

    return menus.documents
  } catch (error) {
    throw new Error(error as string)
  }
}

export const getCategories = async () => {
  try {
    const categories = await appwriteDatabases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId
    )

    return categories.documents as Category[]
  } catch (error) {
    throw new Error(error as string)
  }
}

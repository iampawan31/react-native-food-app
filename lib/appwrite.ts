import { CreateUserParams, SignInParams } from '@/type'
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query
} from 'react-native-appwrite'

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: 'com.iampawan31.foodordering',
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID!
}

export const appwriteClient = new Client()

appwriteClient
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform)

export const appwriteAccount = new Account(appwriteClient)
export const appwriteDatabases = new Databases(appwriteClient)
export const appwriteAvatars = new Avatars(appwriteClient)

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

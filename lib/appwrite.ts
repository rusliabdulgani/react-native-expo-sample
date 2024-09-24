import {
  Client,
  Account,
  ID,
  Avatars,
  Models,
  Databases,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.rusliabdulgani.reactnativecrashcourse",
  projectId: "653bb4ae25d4e219da42",
  databaseId: "66f168f800360c444f39",
  userCollectionId: "66f1693400371ae6867f",
  videoCollectionId: "66f16aae00064379bbab",
  storageId: "66f16d5e0029b8a8f99d",
};

const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

export const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

type CreateUserParamsType = {
  email: string;
  password: string;
  username: string;
};

export const createUser = async ({
  email,
  password,
  username,
}: CreateUserParamsType): Promise<Models.Document> => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        avatar: avatarUrl,
        username,
      }
    );

    return newUser;
  } catch (error) {
    console.log("error create user....", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("unknown error");
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<Models.Session> => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("unknown error");
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {}
};

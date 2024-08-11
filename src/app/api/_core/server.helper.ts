// should use-server-only here

export const UPLOADTHING_PATH = `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`;

export const getUploadthingKey = (m: string) => m.split(UPLOADTHING_PATH)[1];

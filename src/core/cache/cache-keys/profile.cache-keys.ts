const PREFIX = "profile";

export const ProfileCacheKeys = {
  allPattern: `${PREFIX}:*`,
  getProfile: `${PREFIX}:all`,
  getProfileLatestStatus: `${PREFIX}:latest-updated`,
  getProfileInfo: `${PREFIX}:info`,
  getProfileResume: `${PREFIX}:resume`,
  getProfileWork: `${PREFIX}:work`,
  getProfileContact: `${PREFIX}:contact`
} as const;

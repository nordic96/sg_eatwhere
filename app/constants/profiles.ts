export type ProfileType = "mail" | "github" | "leetcode" | "linkedin";

export interface Profile {
  url: string;
  icon_url: string;
  type: ProfileType;
}

export const profileData: Profile[] = [
  {
    url: "",
    icon_url: "/window.svg",
    type: "mail",
  },
  {
    url: "https://github.com",
    icon_url: "/brands/github.svg",
    type: "github",
  },
  {
    url: "https://linkedin.com",
    icon_url: "/brands/linkedin.svg",
    type: "linkedin",
  },
];

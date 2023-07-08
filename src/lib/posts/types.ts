export type IPost = {
  title: string;
  excerpt: any;
  slug: string;
  number: number;
  publishedAt: string;
  updatedAt?: string;
  url: string;
  labels: {
    name: string;
    color: string;
  }[];
  body: string;
};

export type IDiscussion = {
  number: number;
  title: string;
  createdAt: string;
  publishedAt: string;
  lastEditedAt?: string;
  url: string;
  body: string;
  category: {
    name: string;
  };
  labels: {
    nodes: {
      name: string;
      color: string;
    }[];
  };
};

export type IPageInfo = {
  hasNextPage: boolean;
  endCursor?: string;
};

export type IDiscussions = {
  nodes: IDiscussion;
  pageInfo: IPageInfo;
};

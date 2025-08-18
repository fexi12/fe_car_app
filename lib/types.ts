export type StatusResponse = {
  data: {
    logged_in: boolean;
    user: {
      id: string;
      role: string;
      username: string;
    };
  };
  ok: boolean;
};
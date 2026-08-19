export type TDriverError = {
  code: string;
  detail?: string;
  table?: string;
  column?: string;
  constraint?: string;
};
